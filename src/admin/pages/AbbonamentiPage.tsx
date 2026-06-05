import { useMemo, useState } from 'react'
import { CalendarClock, Hash, Pencil, Plus, Repeat, Trash2, TrendingDown } from 'lucide-react'
import { api } from '../api'
import { isAuthError, messageOf, useFetch } from '../useFetch'
import { formatData, formatEuro } from '../format'
import { Movimento, RICORRENZA_LABEL, STATI_PER_TIPO } from '../types'
import KpiCard from '../components/KpiCard'
import DataTable, { Column } from '../components/DataTable'
import StatoBadge from '../components/StatoBadge'
import RecordFormModal from '../components/RecordFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Loader from '../components/Loader'

// Importo periodico dell'abbonamento (quello che paghi): totale documento.
const periodo = (m: Movimento) => m.totale_cents
// Costo normalizzato al mese (annuale / 12).
const alMese = (m: Movimento) => (m.ricorrenza === 'annuale' ? Math.round(m.totale_cents / 12) : m.totale_cents)

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
          <span className="text-xs font-normal text-black/40"> /{m.ricorrenza === 'mensile' ? 'mese' : 'anno'}</span>
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
