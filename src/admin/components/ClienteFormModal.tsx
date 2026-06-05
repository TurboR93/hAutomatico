import { ReactNode, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { api } from '../api'
import { isAuthError, messageOf } from '../useFetch'
import { Cliente, ClienteInput } from '../types'

interface ClienteFormModalProps {
  open: boolean
  initial?: Cliente | null
  // Nome iniziale per la creazione rapida (es. dal form movimento).
  initialNome?: string
  // z-index elevato quando il modale è annidato dentro un altro modale.
  nested?: boolean
  onClose: () => void
  onSaved: (cliente: Cliente) => void
}

interface FormState {
  nome: string
  email: string
  telefono: string
  piva_cf: string
  indirizzo: string
  note: string
}

const inputCls =
  'w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:border-[#D03F29] focus:outline-none'

const empty: FormState = { nome: '', email: '', telefono: '', piva_cf: '', indirizzo: '', note: '' }

function fromCliente(c: Cliente): FormState {
  return {
    nome: c.nome || '',
    email: c.email || '',
    telefono: c.telefono || '',
    piva_cf: c.piva_cf || '',
    indirizzo: c.indirizzo || '',
    note: c.note || '',
  }
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-black/50">{label}</span>
    {children}
  </label>
)

const ClienteFormModal = ({
  open,
  initial,
  initialNome,
  nested = false,
  onClose,
  onSaved,
}: ClienteFormModalProps) => {
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm(initial ? fromCliente(initial) : { ...empty, nome: initialNome || '' })
  }, [open, initial, initialNome])

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  const submit = async () => {
    if (!form.nome.trim()) {
      setError('Il nome del cliente è obbligatorio')
      return
    }
    setSaving(true)
    setError(null)
    const input: ClienteInput = {
      nome: form.nome.trim(),
      email: form.email || null,
      telefono: form.telefono || null,
      piva_cf: form.piva_cf || null,
      indirizzo: form.indirizzo || null,
      note: form.note || null,
    }
    try {
      const cliente = initial
        ? await api.updateCliente(initial.id, input)
        : await api.createCliente(input)
      onSaved(cliente)
    } catch (e) {
      if (isAuthError(e)) window.location.assign('/login')
      else setError(messageOf(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 flex items-start justify-center overflow-y-auto bg-black/50 p-4 ${nested ? 'z-[60]' : 'z-50'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <h2 className="text-lg font-black">{initial ? 'Modifica cliente' : 'Nuovo cliente'}</h2>
              <button onClick={onClose} className="text-black/50 hover:text-black" aria-label="Chiudi">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <Field label="Nome / Ragione sociale">
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => set({ nome: e.target.value })}
                  className={inputCls}
                  placeholder="Es. Mario Rossi / Acme S.r.l."
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inputCls} placeholder="cliente@email.it" />
                </Field>
                <Field label="Telefono">
                  <input type="tel" value={form.telefono} onChange={(e) => set({ telefono: e.target.value })} className={inputCls} placeholder="+39 ..." />
                </Field>
                <Field label="P.IVA / Cod. Fiscale">
                  <input type="text" value={form.piva_cf} onChange={(e) => set({ piva_cf: e.target.value })} className={inputCls} placeholder="IT..." />
                </Field>
                <Field label="Indirizzo">
                  <input type="text" value={form.indirizzo} onChange={(e) => set({ indirizzo: e.target.value })} className={inputCls} placeholder="Via, città" />
                </Field>
              </div>

              <Field label="Note">
                <textarea
                  value={form.note}
                  onChange={(e) => set({ note: e.target.value })}
                  className={`${inputCls} min-h-[64px] resize-y`}
                  placeholder="Note interne (opzionale)"
                />
              </Field>

              {error && <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-[#D03F29]">{error}</div>}
            </div>

            <div className="flex justify-end gap-3 border-t border-black/10 px-6 py-4">
              <button onClick={onClose} className="rounded-full px-5 py-2 text-sm font-bold text-black hover:bg-black/5">
                Annulla
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="rounded-full bg-[#D03F29] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#b5331f] disabled:opacity-60"
              >
                {saving ? 'Salvataggio…' : 'Salva'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ClienteFormModal
