import { ReactNode, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileText, Paperclip, Trash2, Upload, X } from 'lucide-react'
import { api } from '../api'
import { isAuthError, messageOf } from '../useFetch'
import { computeAmounts, grossUpToImponibile } from '../money'
import { centsToInput, euroToCents, formatEuro, formatFileSize, oggiISO } from '../format'
import {
  Allegato,
  Cliente,
  isEntrata,
  Movimento,
  MovimentoInput,
  RICORRENZA_LABEL,
  RICORRENZE,
  STATI_PER_TIPO,
  STATO_LABEL,
  TIPI,
  TIPO_LABEL,
  TipoMovimento,
} from '../types'
import ClienteFormModal from './ClienteFormModal'

interface RecordFormModalProps {
  open: boolean
  initial?: Movimento | null
  defaultTipo?: TipoMovimento
  lockTipo?: boolean
  tipiOptions?: TipoMovimento[]
  // Valori iniziali per un nuovo movimento (es. registrazione incasso da preventivo).
  prefill?: Partial<Movimento> | null
  onClose: () => void
  onSaved: (record: Movimento) => void
}

interface FormState {
  tipo: TipoMovimento
  controparte: string
  descrizione: string
  numero: string
  data: string
  data_scadenza: string
  data_pagamento: string
  imponibile: string
  cassa_percentuale: string
  iva_percentuale: string
  ritenuta_percentuale: string
  stato: string
  fattura_id: string
  preventivo_id: string
  cliente_id: string
  note: string
  ricorrenza: string
  prossimo_rinnovo: string
}

const inputCls =
  'w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:border-[#D03F29] focus:outline-none'

function defaultForm(tipo: TipoMovimento): FormState {
  return {
    tipo,
    controparte: '',
    descrizione: '',
    numero: '',
    data: oggiISO(),
    data_scadenza: '',
    data_pagamento: '',
    imponibile: '',
    cassa_percentuale: '',
    iva_percentuale: tipo === 'fattura_emessa' ? '22' : '',
    ritenuta_percentuale: tipo === 'ritenuta' ? '20' : '',
    // Il compenso si registra di norma a bonifico ricevuto: default "incassato".
    stato: tipo === 'ritenuta' ? 'incassato' : STATI_PER_TIPO[tipo][0],
    fattura_id: '',
    preventivo_id: '',
    cliente_id: '',
    note: '',
    ricorrenza: 'una_tantum',
    prossimo_rinnovo: '',
  }
}

function formFromMovimento(m: Movimento): FormState {
  return {
    tipo: m.tipo,
    controparte: m.controparte || '',
    descrizione: m.descrizione || '',
    numero: m.numero || '',
    data: m.data || '',
    data_scadenza: m.data_scadenza || '',
    data_pagamento: m.data_pagamento || '',
    imponibile: centsToInput(m.imponibile_cents),
    cassa_percentuale: m.cassa_percentuale ? String(m.cassa_percentuale) : '',
    iva_percentuale: m.iva_percentuale ? String(m.iva_percentuale) : '',
    ritenuta_percentuale: m.ritenuta_percentuale ? String(m.ritenuta_percentuale) : '',
    stato: m.stato || STATI_PER_TIPO[m.tipo][0],
    fattura_id: m.fattura_id || '',
    preventivo_id: m.preventivo_id || '',
    cliente_id: m.cliente_id || '',
    note: m.note || '',
    ricorrenza: m.ricorrenza || 'una_tantum',
    prossimo_rinnovo: m.prossimo_rinnovo || '',
  }
}

// Applica valori iniziali (es. da preventivo) sopra il form di default di un nuovo record.
function applyPrefill(base: FormState, p: Partial<Movimento>): FormState {
  return {
    ...base,
    tipo: p.tipo ?? base.tipo,
    controparte: p.controparte ?? base.controparte,
    cliente_id: p.cliente_id ?? base.cliente_id,
    descrizione: p.descrizione ?? base.descrizione,
    preventivo_id: p.preventivo_id ?? base.preventivo_id,
    imponibile: p.imponibile_cents != null ? centsToInput(p.imponibile_cents) : base.imponibile,
    stato: p.stato ?? base.stato,
    ricorrenza: p.ricorrenza ?? base.ricorrenza,
    prossimo_rinnovo: p.prossimo_rinnovo ?? base.prossimo_rinnovo,
  }
}

const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-black/50">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-black/40">{hint}</span>}
  </label>
)

const RecordFormModal = ({
  open,
  initial,
  defaultTipo = 'fattura_emessa',
  lockTipo = false,
  tipiOptions = TIPI,
  prefill,
  onClose,
  onSaved,
}: RecordFormModalProps) => {
  const [form, setForm] = useState<FormState>(defaultForm(defaultTipo))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allegati, setAllegati] = useState<Allegato[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [importoNetto, setImportoNetto] = useState(false)
  const [preventivi, setPreventivi] = useState<Movimento[]>([])
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [clienteModalOpen, setClienteModalOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setError(null)
    setPendingFiles([])
    setAllegati([])
    // Nuovo compenso (ritenuta d'acconto): si parte dal netto del bonifico, la
    // ritenuta si aggiunge sopra. In modifica si mostra invece il lordo già salvato.
    const seedTipo = (!initial && prefill?.tipo) || defaultTipo
    setImportoNetto(!initial && seedTipo === 'ritenuta')
    const base = initial ? formFromMovimento(initial) : defaultForm(defaultTipo)
    setForm(!initial && prefill ? applyPrefill(base, prefill) : base)
    setClienteModalOpen(false)
    // Preventivi e clienti disponibili per i collegamenti.
    api
      .listRecords({ gruppo: 'preventivi' })
      .then(setPreventivi)
      .catch(() => setPreventivi([]))
    api
      .listClienti()
      .then(setClienti)
      .catch(() => setClienti([]))
    if (initial) {
      api
        .listAllegati(initial.id)
        .then(setAllegati)
        .catch(() => setAllegati([]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial, defaultTipo, prefill])

  const addFiles = (files: FileList | null) => {
    if (!files) return
    setPendingFiles((prev) => [...prev, ...Array.from(files)])
  }
  const removePending = (idx: number) =>
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))

  const deleteAllegato = async (a: Allegato) => {
    try {
      await api.deleteAllegato(a.id)
      setAllegati((prev) => prev.filter((x) => x.id !== a.id))
    } catch (e) {
      if (isAuthError(e)) window.location.assign('/login')
      else setError(messageOf(e))
    }
  }

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  const changeTipo = (tipo: TipoMovimento) => {
    set({ tipo, stato: tipo === 'ritenuta' ? 'incassato' : STATI_PER_TIPO[tipo][0] })
    setImportoNetto(tipo === 'ritenuta')
  }

  // Selezione cliente: '__new__' apre la creazione rapida; altrimenti collega e
  // copia il nome nella controparte (denormalizzato, così liste/export restano semplici).
  const selectCliente = (id: string) => {
    if (id === '__new__') {
      setClienteModalOpen(true)
      return
    }
    const c = clienti.find((x) => x.id === id)
    set({ cliente_id: id, controparte: c ? c.nome : '' })
  }
  const onClienteCreated = (c: Cliente) => {
    setClienti((prev) => [...prev, c].sort((a, b) => a.nome.localeCompare(b.nome)))
    set({ cliente_id: c.id, controparte: c.nome })
    setClienteModalOpen(false)
  }

  const isPagamento = form.tipo === 'pagamento'
  // Compenso da prestazione occasionale (privato senza P.IVA): solo ritenuta d'acconto,
  // niente cassa né IVA.
  const isCompenso = form.tipo === 'ritenuta'
  // Il preventivo è riferito all'incasso effettivo: importo netto, niente IVA/ritenuta.
  const isPreventivo = form.tipo === 'preventivo'
  // Spesa semplice (anche ricorrente): importo secco, niente IVA/cassa/ritenuta.
  const isSpesa = form.tipo === 'spesa'
  const isSimple = isPagamento || isPreventivo || isSpesa
  const showFiscal = !isSimple
  const showCassaIva = showFiscal && !isCompenso
  const showScadenza = form.tipo === 'fattura_emessa' || form.tipo === 'fattura_ricevuta'
  // La ricorrenza (una tantum / mensile / annuale) vale per fatture e spese.
  const showRicorrenza = form.tipo === 'fattura_emessa' || form.tipo === 'fattura_ricevuta' || isSpesa
  // Fattura ricevuta e spesa sono verso un fornitore (testo libero); il resto verso un cliente.
  const isFornitore = form.tipo === 'fattura_ricevuta' || isSpesa
  const clientFacing = !isFornitore
  // Un incasso (pagamento, compenso, fattura emessa) può essere collegato a un preventivo.
  const canLinkPreventivo = isEntrata(form.tipo)
  const importoLabel = isCompenso
    ? importoNetto
      ? 'Netto incassato (bonifico)'
      : 'Compenso lordo'
    : isPreventivo
      ? 'Importo (incasso previsto)'
      : isPagamento || isSpesa
        ? 'Importo'
        : 'Imponibile (compenso)'
  const controparteLabel = isFornitore ? 'Fornitore / servizio' : 'Cliente'
  const dataLabel = isPreventivo ? 'Data firma' : isSpesa ? 'Data spesa' : 'Data documento'
  // Preventivi selezionabili: quelli aperti + l'eventuale già collegato.
  const linkablePreventivi = preventivi.filter(
    (p) => p.stato === 'firmato' || p.stato === 'in_corso' || p.id === form.preventivo_id,
  )

  const cassaP = showCassaIva ? Number(form.cassa_percentuale) || 0 : 0
  const ivaP = showCassaIva ? Number(form.iva_percentuale) || 0 : 0
  const ritP = showFiscal ? Number(form.ritenuta_percentuale) || 0 : 0
  const importoCents = euroToCents(form.imponibile)
  // Se l'importo inserito è il netto, ricava il compenso lordo (imponibile).
  const imponibileCents = importoNetto
    ? grossUpToImponibile(importoCents, cassaP, ivaP, ritP)
    : importoCents
  const preview = computeAmounts({
    imponibile_cents: imponibileCents,
    cassa_percentuale: cassaP,
    iva_percentuale: ivaP,
    ritenuta_percentuale: ritP,
  })

  const submit = async () => {
    setSaving(true)
    setError(null)
    const input: MovimentoInput = {
      tipo: form.tipo,
      controparte: form.controparte,
      descrizione: form.descrizione,
      numero: form.numero,
      data: form.data,
      data_scadenza: showScadenza ? form.data_scadenza : null,
      data_pagamento: form.data_pagamento,
      imponibile_cents: imponibileCents,
      cassa_percentuale: cassaP,
      iva_percentuale: ivaP,
      ritenuta_percentuale: ritP,
      stato: form.stato,
      fattura_id: null,
      preventivo_id: canLinkPreventivo ? form.preventivo_id || null : null,
      cliente_id: clientFacing ? form.cliente_id || null : null,
      note: form.note,
      ricorrenza: form.ricorrenza,
      prossimo_rinnovo: form.ricorrenza !== 'una_tantum' ? form.prossimo_rinnovo || null : null,
    }
    try {
      const record = initial
        ? await api.updateRecord(initial.id, input)
        : await api.createRecord(input)
      // Carica gli eventuali file selezionati sul movimento (appena) salvato.
      for (const file of pendingFiles) {
        await api.uploadAllegato(record.id, file)
      }
      onSaved(record)
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
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <h2 className="text-lg font-black">
                {initial ? 'Modifica' : 'Nuovo'} — {TIPO_LABEL[form.tipo]}
              </h2>
              <button onClick={onClose} className="text-black/50 hover:text-black" aria-label="Chiudi">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!lockTipo && (
                  <Field label="Tipo">
                    <select
                      value={form.tipo}
                      onChange={(e) => changeTipo(e.target.value as TipoMovimento)}
                      className={inputCls}
                    >
                      {tipiOptions.map((t) => (
                        <option key={t} value={t}>
                          {TIPO_LABEL[t]}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <Field label={controparteLabel}>
                  {clientFacing ? (
                    <>
                      <select
                        value={form.cliente_id}
                        onChange={(e) => selectCliente(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">— nessun cliente —</option>
                        {clienti.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                        <option value="__new__">➕ Nuovo cliente…</option>
                      </select>
                      {!form.cliente_id && form.controparte && (
                        <span className="mt-1 block text-xs text-amber-600">
                          Attuale: {form.controparte} — non collegato all'anagrafica
                        </span>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      value={form.controparte}
                      onChange={(e) => set({ controparte: e.target.value })}
                      className={inputCls}
                      placeholder="Nome fornitore"
                    />
                  )}
                </Field>

                <Field label="Stato">
                  <select value={form.stato} onChange={(e) => set({ stato: e.target.value })} className={inputCls}>
                    {STATI_PER_TIPO[form.tipo].map((s) => (
                      <option key={s} value={s}>
                        {STATO_LABEL[s] || s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Numero documento">
                  <input
                    type="text"
                    value={form.numero}
                    onChange={(e) => set({ numero: e.target.value })}
                    className={inputCls}
                    placeholder="es. 2026/001"
                  />
                </Field>

                <Field label={dataLabel}>
                  <input type="date" value={form.data} onChange={(e) => set({ data: e.target.value })} className={inputCls} />
                </Field>

                {showScadenza && (
                  <Field label="Scadenza">
                    <input
                      type="date"
                      value={form.data_scadenza}
                      onChange={(e) => set({ data_scadenza: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                )}

                <Field label="Data incasso / pagamento" hint="Quando il denaro entra o esce davvero">
                  <input
                    type="date"
                    value={form.data_pagamento}
                    onChange={(e) => set({ data_pagamento: e.target.value })}
                    className={inputCls}
                  />
                </Field>

                {showRicorrenza && (
                  <Field label="Ricorrenza">
                    <select
                      value={form.ricorrenza}
                      onChange={(e) => set({ ricorrenza: e.target.value })}
                      className={inputCls}
                    >
                      {RICORRENZE.map((r) => (
                        <option key={r} value={r}>
                          {RICORRENZA_LABEL[r]}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                {showRicorrenza && form.ricorrenza !== 'una_tantum' && (
                  <Field label="Prossimo rinnovo" hint="Quando va rinnovata/rifatturata">
                    <input
                      type="date"
                      value={form.prossimo_rinnovo}
                      onChange={(e) => set({ prossimo_rinnovo: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                )}

                {canLinkPreventivo && (
                  <Field label="Collega a preventivo" hint="Scala l'incasso dal residuo del preventivo">
                    <select
                      value={form.preventivo_id}
                      onChange={(e) => set({ preventivo_id: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">— nessuno —</option>
                      {linkablePreventivi.map((p) => {
                        const residuo = p.imponibile_cents - (p.incassato_collegato || 0)
                        return (
                          <option key={p.id} value={p.id}>
                            {(p.numero || 's.n.') + ' · ' + (p.controparte || '—') + ' · residuo ' + formatEuro(residuo)}
                          </option>
                        )
                      })}
                    </select>
                  </Field>
                )}

              </div>

              <Field label="Descrizione">
                <input
                  type="text"
                  value={form.descrizione}
                  onChange={(e) => set({ descrizione: e.target.value })}
                  className={inputCls}
                  placeholder="Descrizione della prestazione"
                />
              </Field>

              {/* Importi */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label={importoLabel}>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.imponibile}
                    onChange={(e) => set({ imponibile: e.target.value })}
                    className={inputCls}
                    placeholder="0,00"
                  />
                </Field>
                {showCassaIva && (
                  <>
                    <Field label="Cassa %" hint="Contributo prev.">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={form.cassa_percentuale}
                        onChange={(e) => set({ cassa_percentuale: e.target.value })}
                        className={inputCls}
                        placeholder="0"
                      />
                    </Field>
                    <Field label="IVA %">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={form.iva_percentuale}
                        onChange={(e) => set({ iva_percentuale: e.target.value })}
                        className={inputCls}
                        placeholder="22"
                      />
                    </Field>
                  </>
                )}
                {showFiscal && (
                  <Field label="Ritenuta %" hint={isCompenso ? "20% prest. occasionale" : undefined}>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={form.ritenuta_percentuale}
                      onChange={(e) => set({ ritenuta_percentuale: e.target.value })}
                      className={inputCls}
                      placeholder={isCompenso ? '20' : '0'}
                    />
                  </Field>
                )}
              </div>

              {showFiscal && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={importoNetto}
                    onChange={(e) => setImportoNetto(e.target.checked)}
                    className="h-4 w-4 accent-[#D03F29]"
                  />
                  <span>
                    L'importo inserito è il <b>netto</b> che incasso (la ritenuta si aggiunge sopra)
                  </span>
                </label>
              )}

              {/* Anteprima calcolo */}
              {showFiscal && (
                <div className="rounded-xl bg-neutral-50 p-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-1 sm:grid-cols-3">
                    <span className="text-black/50">Imponibile (lordo)</span>
                    <span className="text-right font-medium sm:col-span-2">{formatEuro(imponibileCents)}</span>
                    {preview.cassa_cents > 0 && (
                      <>
                        <span className="text-black/50">Cassa</span>
                        <span className="text-right font-medium sm:col-span-2">{formatEuro(preview.cassa_cents)}</span>
                      </>
                    )}
                    {(showCassaIva || preview.iva_cents > 0) && (
                      <>
                        <span className="text-black/50">IVA</span>
                        <span className="text-right font-medium sm:col-span-2">{formatEuro(preview.iva_cents)}</span>
                      </>
                    )}
                    {preview.ritenuta_cents > 0 && (
                      <>
                        <span className="text-[#D03F29]">Ritenuta d'acconto</span>
                        <span className="text-right font-medium text-[#D03F29] sm:col-span-2">
                          − {formatEuro(preview.ritenuta_cents)}
                        </span>
                      </>
                    )}
                    <span className="mt-1 border-t border-black/10 pt-1 font-bold">
                      {isCompenso ? 'Compenso lordo' : 'Totale documento'}
                    </span>
                    <span className="mt-1 border-t border-black/10 pt-1 text-right font-bold sm:col-span-2">
                      {formatEuro(preview.totale_cents)}
                    </span>
                    <span className="font-black text-emerald-700">
                      {isCompenso ? 'Netto incassato' : 'Netto a pagare'}
                    </span>
                    <span className="text-right font-black text-emerald-700 sm:col-span-2">
                      {formatEuro(preview.netto_cents)}
                    </span>
                  </div>
                </div>
              )}

              <Field label="Note">
                <textarea
                  value={form.note}
                  onChange={(e) => set({ note: e.target.value })}
                  className={`${inputCls} min-h-[64px] resize-y`}
                  placeholder="Note interne (opzionale)"
                />
              </Field>

              {/* Allegati */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-black/50">
                  <Paperclip size={14} /> Allegati
                </div>
                <div className="space-y-2">
                  {allegati.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-sm"
                    >
                      <FileText size={16} className="shrink-0 text-black/40" />
                      <span className="min-w-0 flex-1 truncate">{a.filename}</span>
                      <span className="shrink-0 text-xs text-black/40">{formatFileSize(a.size)}</span>
                      <a
                        href={api.allegatoUrl(a.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-lg p-1 text-black/50 hover:bg-black/5 hover:text-black"
                        title="Apri / scarica"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => deleteAllegato(a)}
                        className="shrink-0 rounded-lg p-1 text-black/50 hover:bg-red-50 hover:text-[#D03F29]"
                        title="Elimina"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {pendingFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-dashed border-[#D03F29]/40 bg-[#FDF07A]/20 px-3 py-2 text-sm"
                    >
                      <Upload size={16} className="shrink-0 text-[#D03F29]" />
                      <span className="min-w-0 flex-1 truncate">{f.name}</span>
                      <span className="shrink-0 text-xs text-black/40">{formatFileSize(f.size)} · da caricare</span>
                      <button
                        type="button"
                        onClick={() => removePending(i)}
                        className="shrink-0 rounded-lg p-1 text-black/50 hover:bg-black/5"
                        title="Rimuovi"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {allegati.length === 0 && pendingFiles.length === 0 && (
                    <p className="text-xs text-black/40">Nessun documento allegato.</p>
                  )}
                </div>

                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold hover:bg-black/5">
                  <Paperclip size={16} />
                  Aggiungi file
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files)
                      e.target.value = ''
                    }}
                  />
                </label>
                <p className="mt-1 text-xs text-black/40">
                  PDF o immagini, fino a 10 MB per file. I file selezionati vengono caricati al salvataggio.
                </p>
              </div>

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

            <ClienteFormModal
              open={clienteModalOpen}
              nested
              onClose={() => setClienteModalOpen(false)}
              onSaved={onClienteCreated}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RecordFormModal
