import { useMemo, useState } from 'react'
import { Mail, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { api } from '../api'
import { isAuthError, messageOf, useFetch } from '../useFetch'
import { Cliente } from '../types'
import DataTable, { Column } from '../components/DataTable'
import ClienteFormModal from '../components/ClienteFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Loader from '../components/Loader'

const ClientiPage = () => {
  const [q, setQ] = useState('')
  const { data, loading, error, reload } = useFetch<Cliente[]>(() => api.listClienti(), [])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [toDelete, setToDelete] = useState<Cliente | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const clienti = useMemo(() => {
    const list = data || []
    const term = q.trim().toLowerCase()
    if (!term) return list
    return list.filter((c) =>
      [c.nome, c.email, c.telefono, c.piva_cf].some((v) => (v || '').toLowerCase().includes(term)),
    )
  }, [data, q])

  const openNew = () => {
    setEditing(null)
    setActionError(null)
    setModalOpen(true)
  }
  const openEdit = (c: Cliente) => {
    setEditing(c)
    setActionError(null)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await api.deleteCliente(toDelete.id)
      setToDelete(null)
      reload()
    } catch (e) {
      setToDelete(null)
      if (isAuthError(e)) window.location.assign('/login')
      else setActionError(messageOf(e))
    }
  }

  const columns: Column<Cliente>[] = [
    {
      key: 'nome',
      header: 'Cliente',
      render: (c) => (
        <div>
          <div className="font-medium">{c.nome}</div>
          {c.piva_cf && <div className="text-xs text-black/50">{c.piva_cf}</div>}
        </div>
      ),
    },
    {
      key: 'contatti',
      header: 'Contatti',
      render: (c) => (
        <div className="space-y-0.5 text-xs text-black/60">
          {c.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={12} /> {c.email}
            </div>
          )}
          {c.telefono && (
            <div className="flex items-center gap-1.5">
              <Phone size={12} /> {c.telefono}
            </div>
          )}
          {!c.email && !c.telefono && '—'}
        </div>
      ),
    },
    { key: 'indirizzo', header: 'Indirizzo', render: (c) => c.indirizzo || '—' },
    {
      key: 'azioni',
      header: '',
      align: 'right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              openEdit(c)
            }}
            className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 hover:text-black"
            aria-label="Modifica"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setToDelete(c)
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
          <h1 className="text-2xl font-black md:text-3xl">Clienti</h1>
          <p className="mt-1 text-sm text-black/50">Anagrafica dei tuoi clienti</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-[#D03F29] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b5331f]"
        >
          <Plus size={18} />
          Nuovo cliente
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca per nome, email, P.IVA…"
          className="w-full max-w-sm rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:border-[#D03F29] focus:outline-none"
        />
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{actionError}</div>
      )}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={clienti}
          rowKey={(c) => c.id}
          onRowClick={openEdit}
          emptyMessage="Ancora nessun cliente. Aggiungi il primo con «Nuovo cliente»."
        />
      )}

      <ClienteFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false)
          reload()
        }}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminare il cliente?"
        message="Il cliente verrà rimosso dall'anagrafica. I movimenti collegati restano, ma perdono il riferimento al cliente."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}

export default ClientiPage
