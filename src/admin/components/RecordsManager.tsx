import { useEffect, useMemo, useState } from 'react'
import { Paperclip, Pencil, Plus, Repeat, Trash2 } from 'lucide-react'
import { api, RecordFilters } from '../api'
import { isAuthError, messageOf, useFetch } from '../useFetch'
import { formatData, formatEuro } from '../format'
import { Movimento, RICORRENZA_LABEL, STATI_PER_TIPO, TIPO_LABEL, TipoMovimento } from '../types'
import DataTable, { Column } from './DataTable'
import StatoBadge from './StatoBadge'
import RecordFormModal from './RecordFormModal'
import ConfirmDialog from './ConfirmDialog'
import FiltersBar, { FiltersValues } from './FiltersBar'
import Loader from './Loader'

interface RecordsManagerProps {
  title: string
  subtitle?: string
  newLabel: string
  defaultTipo: TipoMovimento
  baseFilter?: RecordFilters
  lockTipo?: boolean
  showTipoColumn?: boolean
  showFilters?: boolean
  filterShowTipo?: boolean
  loadFattureForLink?: boolean
}

const RecordsManager = ({
  title,
  subtitle,
  newLabel,
  defaultTipo,
  baseFilter = {},
  lockTipo = false,
  showTipoColumn = false,
  showFilters = true,
  filterShowTipo = true,
  loadFattureForLink = false,
}: RecordsManagerProps) => {
  const [filters, setFilters] = useState<FiltersValues>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Movimento | null>(null)
  const [toDelete, setToDelete] = useState<Movimento | null>(null)
  const [fatture, setFatture] = useState<Movimento[]>([])
  const [actionError, setActionError] = useState<string | null>(null)

  const query: RecordFilters = useMemo(
    () => ({
      ...baseFilter,
      tipo: filters.tipo || baseFilter.tipo,
      stato: filters.stato || undefined,
      q: filters.q || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, baseFilter.tipo],
  )

  const { data, loading, error, reload } = useFetch<Movimento[]>(() => api.listRecords(query), [query])

  useEffect(() => {
    if (!loadFattureForLink) return
    api
      .listRecords({ tipo: 'fattura_emessa' })
      .then(setFatture)
      .catch(() => setFatture([]))
  }, [loadFattureForLink])

  const records = data || []

  const openNew = () => {
    setEditing(null)
    setActionError(null)
    setModalOpen(true)
  }
  const openEdit = (m: Movimento) => {
    setEditing(m)
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
    { key: 'data', header: 'Data', render: (m) => formatData(m.data) },
    ...(showTipoColumn
      ? [{ key: 'tipo', header: 'Tipo', render: (m: Movimento) => TIPO_LABEL[m.tipo] }]
      : []),
    {
      key: 'controparte',
      header: 'Controparte',
      render: (m) => (
        <div>
          <div className="flex items-center gap-1.5 font-medium">
            {m.controparte || '—'}
            {!!m.allegati_count && (
              <span className="inline-flex items-center gap-0.5 text-xs font-normal text-black/40" title={`${m.allegati_count} allegati`}>
                <Paperclip size={12} />
                {m.allegati_count}
              </span>
            )}
          </div>
          {m.descrizione && <div className="text-xs text-black/50">{m.descrizione}</div>}
          {m.ricorrenza && m.ricorrenza !== 'una_tantum' && (
            <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-sky-700">
              <Repeat size={11} />
              {RICORRENZA_LABEL[m.ricorrenza] || m.ricorrenza}
              {m.prossimo_rinnovo ? ` · rinnovo ${formatData(m.prossimo_rinnovo)}` : ''}
            </div>
          )}
        </div>
      ),
    },
    { key: 'numero', header: 'Numero', render: (m) => m.numero || '—' },
    { key: 'totale', header: 'Totale', align: 'right', render: (m) => formatEuro(m.totale_cents) },
    {
      key: 'netto',
      header: 'Netto',
      align: 'right',
      render: (m) => <span className="font-medium">{formatEuro(m.netto_cents)}</span>,
    },
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-black/50">{subtitle}</p>}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-[#D03F29] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b5331f]"
        >
          <Plus size={18} />
          {newLabel}
        </button>
      </div>

      {showFilters && (
        <div className="mb-4">
          <FiltersBar values={filters} onChange={setFilters} showTipo={filterShowTipo} />
        </div>
      )}

      {actionError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{actionError}</div>
      )}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{error}</div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} rows={records} rowKey={(m) => m.id} onRowClick={openEdit} />
      )}

      <RecordFormModal
        open={modalOpen}
        initial={editing}
        defaultTipo={defaultTipo}
        lockTipo={lockTipo}
        fatture={fatture}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false)
          reload()
        }}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminare il movimento?"
        message="L'azione è irreversibile e rimuove definitivamente questa voce dall'archivio."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}

export default RecordsManager
