import { useMemo, useState } from 'react'
import { CalendarClock, Hash, Pencil, Plus, Repeat, Trash2, TrendingDown } from 'lucide-react'
import { api } from '../api'
import { isAuthError, messageOf, useFetch } from '../useFetch'
import { formatData, formatEuro } from '../format'
import { MESI_PER_RICORRENZA, Movimento, RICORRENZA_LABEL, STATI_PER_TIPO } from '../types'
import KpiCard from '../components/KpiCard'
import DataTable, { Column } from '../components/DataTable'
import StatoBadge from '../components/StatoBadge'
import RecordFormModal from '../components/RecordFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Loader from '../components/Loader'

// Importo periodico dell'abbonamento (quello che paghi): totale documento.
const periodo = (m: Movimento) => m.totale_cents
// Costo normalizzato al mese: totale / mesi coperti dal periodo.
const alMese = (m: Movimento) => Math.round(m.totale_cents / (MESI_PER_RICORRENZA[m.ricorrenza] || 1))
// Suffisso compatto della cadenza accanto all'importo.
const CADENZA_SUFFISSO: Record<string, string> = {
  mensile: '/mese',
  annuale: '/anno',
  biennale: '/2 anni',
  quadriennale: '/4 anni',
}

const AbbonamentiPage = () => {
  const { data, loading, error, reload } = useFetch<Movimento[]>(
    () => api.listRecords({ gruppo: 'movimenti' }),
    [],
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Movimento | null>(null)
  const [prefill, setPrefill] = useState<Partial<Movimento> | null>(null)
  const [toDelete, setToDelete] = useState<Movimento | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Solo gli abbonamenti: uscite (spese / fatture ricevute) con ricorrenza mensile/annuale.
  const abbonamenti = useMemo(
    () =>
      (data || []).filter(
        (m) =>
          (m.tipo === 'spesa' || m.tipo === 'fattura_ricevuta') &&
          m.ricorrenza &&
          m.ricorrenza !== 'una_tantum',
      ),
    [data],
  )

  const totaleMese = abbonamenti.reduce((s, m) => s + alMese(m), 0)
  const prossimo = useMemo(() => {
    const conData = abbonamenti.filter((m) => m.prossimo_rinnovo)
    if (!conData.length) return null
    return conData.reduce((a, b) => ((a.prossimo_rinnovo || '') <= (b.prossimo_rinnovo || '') ? a : b))
  }, [abbonamenti])

  // Costo dei mensili (cadenza < 1 anno): outflow costante ogni anno.
  const mensiliMese = abbonamenti
    .filter((m) => m.ricorrenza === 'mensile')
    .reduce((s, m) => s + m.totale_cents, 0)

  // Proiezione dei rinnovi annuali/pluriennali per i prossimi anni, a partire dalla
  // data di prossimo rinnovo e ripetendo ogni N anni (N = mesi periodo / 12).
  const ANNI = 6
  const proiezione = useMemo(() => {
    const base = new Date().getFullYear()
    const end = base + ANNI - 1
    const anni = Array.from({ length: ANNI }, (_, i) => ({
      anno: base + i,
      voci: [] as { nome: string; cents: number }[],
      totale: 0,
    }))
    for (const m of abbonamenti) {
      const mesi = MESI_PER_RICORRENZA[m.ricorrenza]
      if (!m.prossimo_rinnovo || !mesi || mesi < 12) continue
      const passo = mesi / 12
      const start = parseInt(m.prossimo_rinnovo.slice(0, 4), 10)
      if (!start) continue
      for (let y = start; y <= end; y += passo) {
        if (y < base) continue
        const b = anni[y - base]
        b.voci.push({ nome: m.controparte || '—', cents: m.totale_cents })
        b.totale += m.totale_cents
      }
    }
    return anni
  }, [abbonamenti])

  const openNew = () => {
    setEditing(null)
    setActionError(null)
    setPrefill({ tipo: 'spesa', ricorrenza: 'mensile', stato: 'pagata' })
    setModalOpen(true)
  }
  const openEdit = (m: Movimento) => {
    setEditing(m)
    setPrefill(null)
    setActionError(null)
    setModalOpen(true)
  }

  const patchStato = async (m: Movimento, stato: string) => {
    setActionError(null)
    try {
      await api.patchRecord(m.id, { stato })
      reload()
    } catch (e) {
      if (isAuthError(e)) window.location.assign('/login')
      else setActionError(messageOf(e))
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await api.deleteRecord(toDelete.id)
      setToDelete(null)
      reload()
    } catch (e) {
      setToDelete(null)
      if (isAuthError(e)) window.location.assign('/login')
      else setActionError(messageOf(e))
    }
  }

  const columns: Column<Movimento>[] = [
    {
      key: 'servizio',
      header: 'Servizio / Fornitore',
      render: (m) => (
        <div>
          <div className="font-medium">{m.controparte || '—'}</div>
          {m.descrizione && <div className="text-xs text-black/50">{m.descrizione}</div>}
        </div>
      ),
    },
    {
      key: 'importo',
      header: 'Importo',
      align: 'right',
      render: (m) => (
        <span className="font-medium">
          {formatEuro(periodo(m))}
          <span className="text-xs font-normal text-black/40"> {CADENZA_SUFFISSO[m.ricorrenza] || ''}</span>
        </span>
      ),
    },
    {
      key: 'cadenza',
      header: 'Cadenza',
      render: (m) => (
        <span className="inline-flex items-center gap-1 text-xs text-sky-700">
          <Repeat size={12} />
          {RICORRENZA_LABEL[m.ricorrenza] || m.ricorrenza}
        </span>
      ),
    },
    { key: 'mese', header: 'Al mese', align: 'right', render: (m) => formatEuro(alMese(m)) },
    { key: 'rinnovo', header: 'Prossimo rinnovo', render: (m) => formatData(m.prossimo_rinnovo) },
    {
      key: 'stato',
      header: 'Stato',
      render: (m) => (
        <StatoBadge stato={m.stato} options={STATI_PER_TIPO[m.tipo]} onChange={(s) => patchStato(m, s)} />
      ),
    },
    {
      key: 'azioni',
      header: '',
      align: 'right',
      render: (m) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              openEdit(m)
            }}
            className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 hover:text-black"
            aria-label="Modifica"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setToDelete(m)
            }}
            className="rounded-lg p-1.5 text-black/50 hover:bg-red-50 hover:text-[#D03F29]"
            aria-label="Elimina"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">Abbonamenti</h1>
          <p className="mt-1 text-sm text-black/50">Servizi e abbonamenti ricorrenti che paghi</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-[#D03F29] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b5331f]"
        >
          <Plus size={18} />
          Nuovo abbonamento
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Spesa al mese" value={formatEuro(totaleMese)} sub="Totale abbonamenti / mese" icon={TrendingDown} accent="red" delay={0} />
        <KpiCard label="Spesa all'anno" value={formatEuro(totaleMese * 12)} sub="Proiezione annua" icon={Repeat} accent="plain" delay={0.05} />
        <KpiCard label="Abbonamenti attivi" value={String(abbonamenti.length)} sub="Voci ricorrenti" icon={Hash} accent="dark" delay={0.1} />
        <KpiCard
          label="Prossimo rinnovo"
          value={prossimo ? formatData(prossimo.prossimo_rinnovo) : '—'}
          sub={prossimo ? prossimo.controparte || '—' : 'Nessuna scadenza'}
          icon={CalendarClock}
          accent="yellow"
          delay={0.15}
        />
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{actionError}</div>
      )}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{error}</div>}

      <DataTable
        columns={columns}
        rows={abbonamenti}
        rowKey={(m) => m.id}
        onRowClick={openEdit}
        emptyMessage="Nessun abbonamento. Aggiungi i servizi ricorrenti che paghi con «Nuovo abbonamento»."
      />

      {abbonamenti.some((m) => m.prossimo_rinnovo) && (
        <div className="mt-8">
          <h2 className="mb-1 font-black">Proiezione rinnovi</h2>
          <p className="mb-3 text-sm text-black/50">
            Spesa dei rinnovi annuali e pluriennali, anno per anno (auto-rinnovo attivo).
          </p>
          <div className="divide-y divide-black/5 rounded-2xl border border-black/10 bg-white shadow-sm">
            {proiezione.map(({ anno, voci, totale }) => (
              <div key={anno} className="flex items-start gap-3 px-4 py-3 text-sm">
                <div className="w-12 shrink-0 font-black">{anno}</div>
                <div className="min-w-0 flex-1 text-black/60">
                  {voci.length ? voci.map((v) => v.nome).join(' · ') : 'Nessun rinnovo'}
                </div>
                <div className="shrink-0 font-bold">{formatEuro(totale)}</div>
              </div>
            ))}
          </div>
          {mensiliMese > 0 && (
            <p className="mt-2 text-xs text-black/40">
              Esclusi i mensili (Google, Claude…): {formatEuro(mensiliMese)}/mese ={' '}
              {formatEuro(mensiliMese * 12)}/anno, costanti ogni anno.
            </p>
          )}
        </div>
      )}

      <RecordFormModal
        open={modalOpen}
        initial={editing}
        defaultTipo="spesa"
        prefill={prefill}
        onClose={() => {
          setModalOpen(false)
          setPrefill(null)
        }}
        onSaved={() => {
          setModalOpen(false)
          setPrefill(null)
          reload()
        }}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminare l'abbonamento?"
        message="La voce ricorrente verrà rimossa definitivamente dall'archivio."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}

export default AbbonamentiPage
