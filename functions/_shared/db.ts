// Helper D1 + validazione + risposte JSON per le Functions dell'area amministrazione.

import { computeAmounts } from './money'
import {
  Allegato,
  Movimento,
  MovimentoInput,
  Ricorrenza,
  RICORRENZE,
  STATI_PER_TIPO,
  TIPI,
  TipoMovimento,
} from './types'

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' }

export function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  })
}

export function errorJson(message: string, status = 400): Response {
  return json({ error: message }, status)
}

// Stato di default per ciascun tipo quando non specificato.
const STATO_DEFAULT: Record<TipoMovimento, string> = {
  pagamento: 'incassato',
  fattura_emessa: 'da_fare',
  fattura_ricevuta: 'da_pagare',
  // Il compenso si registra di norma dopo aver ricevuto il bonifico: default "incassato".
  ritenuta: 'incassato',
  preventivo: 'firmato',
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

function intOf(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}

// Percentuale: ammette decimali (es. 11,5% ritenuta agenti), limitata a 0..100.
function clampPerc(v: unknown): number {
  const n = Number(v)
  if (!Number.isFinite(n) || n < 0) return 0
  if (n > 100) return 100
  return n
}

// Valida e normalizza l'input. Ritorna {input} oppure {error}.
export function validateInput(
  body: unknown,
  { partial = false }: { partial?: boolean } = {},
): { input?: MovimentoInput; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { error: 'Corpo della richiesta non valido' }
  }
  const b = body as Record<string, unknown>

  let tipo: TipoMovimento | undefined
  if (b.tipo !== undefined) {
    if (!TIPI.includes(b.tipo as TipoMovimento)) return { error: 'Tipo non valido' }
    tipo = b.tipo as TipoMovimento
  } else if (!partial) {
    return { error: 'Campo "tipo" obbligatorio' }
  }

  // Validazione stato rispetto al tipo (quando entrambi noti).
  let stato = b.stato === undefined ? undefined : str(b.stato)
  if (stato && tipo && !STATI_PER_TIPO[tipo].includes(stato)) {
    return { error: `Stato "${stato}" non valido per il tipo "${tipo}"` }
  }

  const input: MovimentoInput = { tipo: tipo as TipoMovimento }
  if (b.controparte !== undefined) input.controparte = str(b.controparte)
  if (b.descrizione !== undefined) input.descrizione = str(b.descrizione)
  if (b.numero !== undefined) input.numero = str(b.numero)
  if (b.data !== undefined) input.data = str(b.data)
  if (b.data_scadenza !== undefined) input.data_scadenza = str(b.data_scadenza)
  if (b.data_pagamento !== undefined) input.data_pagamento = str(b.data_pagamento)
  if (b.imponibile_cents !== undefined) input.imponibile_cents = intOf(b.imponibile_cents)
  if (b.cassa_percentuale !== undefined) input.cassa_percentuale = clampPerc(b.cassa_percentuale)
  if (b.iva_percentuale !== undefined) input.iva_percentuale = clampPerc(b.iva_percentuale)
  if (b.ritenuta_percentuale !== undefined) input.ritenuta_percentuale = clampPerc(b.ritenuta_percentuale)
  if (b.fattura_id !== undefined) input.fattura_id = str(b.fattura_id)
  if (b.preventivo_id !== undefined) input.preventivo_id = str(b.preventivo_id)
  if (b.note !== undefined) input.note = str(b.note)
  if (stato !== undefined) input.stato = stato
  if (b.ricorrenza !== undefined) {
    const r = str(b.ricorrenza)
    if (r && !RICORRENZE.includes(r as Ricorrenza)) return { error: 'Ricorrenza non valida' }
    input.ricorrenza = r || 'una_tantum'
  }
  if (b.prossimo_rinnovo !== undefined) input.prossimo_rinnovo = str(b.prossimo_rinnovo)

  return { input }
}

const COLUMNS = [
  'id', 'tipo', 'controparte', 'descrizione', 'numero', 'data', 'data_scadenza',
  'data_pagamento', 'imponibile_cents', 'cassa_percentuale', 'cassa_cents',
  'iva_percentuale', 'iva_cents', 'ritenuta_percentuale', 'ritenuta_cents',
  'totale_cents', 'netto_cents', 'stato', 'fattura_id', 'preventivo_id', 'note',
  'ricorrenza', 'prossimo_rinnovo', 'created_at', 'updated_at',
]

function rowValues(m: Movimento): unknown[] {
  return COLUMNS.map((c) => (m as unknown as Record<string, unknown>)[c])
}

// Costruisce un Movimento completo unendo i valori esistenti (per update) con l'input.
export function buildMovimento(input: MovimentoInput, existing?: Movimento): Movimento {
  const now = Date.now()
  const base: Movimento = existing ?? {
    id: crypto.randomUUID(),
    tipo: input.tipo,
    controparte: null, descrizione: null, numero: null,
    data: null, data_scadenza: null, data_pagamento: null,
    imponibile_cents: 0, cassa_percentuale: 0, cassa_cents: 0,
    iva_percentuale: 0, iva_cents: 0, ritenuta_percentuale: 0, ritenuta_cents: 0,
    totale_cents: 0, netto_cents: 0,
    stato: STATO_DEFAULT[input.tipo], fattura_id: null, preventivo_id: null, note: null,
    ricorrenza: 'una_tantum', prossimo_rinnovo: null,
    created_at: now, updated_at: now,
  }

  // Usa il valore dell'input solo se la chiave è presente (così in modifica si può
  // anche azzerare un campo a null), altrimenti mantiene quello esistente.
  const has = (k: keyof MovimentoInput) => Object.prototype.hasOwnProperty.call(input, k)

  const tipo = (input.tipo ?? base.tipo) as TipoMovimento
  const merged: Movimento = {
    ...base,
    tipo,
    controparte: has('controparte') ? input.controparte ?? null : base.controparte,
    descrizione: has('descrizione') ? input.descrizione ?? null : base.descrizione,
    numero: has('numero') ? input.numero ?? null : base.numero,
    data: has('data') ? input.data ?? null : base.data,
    data_scadenza: has('data_scadenza') ? input.data_scadenza ?? null : base.data_scadenza,
    data_pagamento: has('data_pagamento') ? input.data_pagamento ?? null : base.data_pagamento,
    stato: (has('stato') ? input.stato : base.stato) || STATO_DEFAULT[tipo],
    fattura_id: has('fattura_id') ? input.fattura_id ?? null : base.fattura_id,
    preventivo_id: has('preventivo_id') ? input.preventivo_id ?? null : base.preventivo_id,
    note: has('note') ? input.note ?? null : base.note,
    ricorrenza: (has('ricorrenza') ? input.ricorrenza : base.ricorrenza) || 'una_tantum',
    prossimo_rinnovo: has('prossimo_rinnovo') ? input.prossimo_rinnovo ?? null : base.prossimo_rinnovo,
    updated_at: now,
  }

  // Garantisce l'invariante stato-tipo: se (es. cambiando tipo) lo stato non e'
  // ammesso per il tipo risultante, riporta allo stato di default del tipo.
  if (!STATI_PER_TIPO[tipo].includes(merged.stato || '')) {
    merged.stato = STATO_DEFAULT[tipo]
  }

  // Ricalcolo autorevole degli importi (input client non fidato).
  const amounts = computeAmounts({
    imponibile_cents: has('imponibile_cents') ? input.imponibile_cents : base.imponibile_cents,
    cassa_percentuale: has('cassa_percentuale') ? input.cassa_percentuale : base.cassa_percentuale,
    iva_percentuale: has('iva_percentuale') ? input.iva_percentuale : base.iva_percentuale,
    ritenuta_percentuale: has('ritenuta_percentuale') ? input.ritenuta_percentuale : base.ritenuta_percentuale,
  })

  return { ...merged, ...amounts }
}

// ---------- query D1 ----------

export interface ListFilters {
  tipo?: string | null
  stato?: string | null
  from?: string | null
  to?: string | null
  q?: string | null
  limit?: number | null
  gruppo?: string | null // 'movimenti' (tutto tranne preventivi) | 'preventivi'
}

export async function listMovimenti(db: D1Database, f: ListFilters): Promise<Movimento[]> {
  const where: string[] = []
  const binds: unknown[] = []
  if (f.gruppo === 'movimenti') where.push("tipo <> 'preventivo'")
  else if (f.gruppo === 'preventivi') where.push("tipo = 'preventivo'")
  if (f.tipo) { where.push('tipo = ?'); binds.push(f.tipo) }
  if (f.stato) { where.push('stato = ?'); binds.push(f.stato) }
  if (f.from) { where.push('data >= ?'); binds.push(f.from) }
  if (f.to) { where.push('data <= ?'); binds.push(f.to) }
  if (f.q) {
    where.push('(controparte LIKE ? OR descrizione LIKE ? OR numero LIKE ?)')
    const like = `%${f.q}%`
    binds.push(like, like, like)
  }
  // incassato_collegato: per i preventivi, netto dei movimenti collegati ed
  // effettivamente incassati (pagamenti, compensi 'incassato', fatture 'pagata').
  const incassatoCollegato = `(
    SELECT COALESCE(SUM(c.netto_cents), 0) FROM movimenti c
    WHERE c.preventivo_id = movimenti.id
      AND (c.tipo='pagamento'
           OR (c.tipo='ritenuta' AND c.stato='incassato')
           OR (c.tipo='fattura_emessa' AND c.stato='pagata'))
  )`
  let sql =
    'SELECT *,' +
    ' (SELECT COUNT(*) FROM allegati a WHERE a.movimento_id = movimenti.id) AS allegati_count,' +
    ` ${incassatoCollegato} AS incassato_collegato` +
    ' FROM movimenti'
  if (where.length) sql += ' WHERE ' + where.join(' AND ')
  sql += ' ORDER BY COALESCE(data, "") DESC, created_at DESC'
  if (f.limit && f.limit > 0) { sql += ' LIMIT ?'; binds.push(f.limit) }

  const res = await db.prepare(sql).bind(...binds).all<Movimento>()
  return res.results ?? []
}

export async function getMovimentoById(db: D1Database, id: string): Promise<Movimento | null> {
  return db.prepare('SELECT * FROM movimenti WHERE id = ?').bind(id).first<Movimento>()
}

export async function insertMovimento(db: D1Database, m: Movimento): Promise<void> {
  const placeholders = COLUMNS.map(() => '?').join(', ')
  await db
    .prepare(`INSERT INTO movimenti (${COLUMNS.join(', ')}) VALUES (${placeholders})`)
    .bind(...rowValues(m))
    .run()
}

export async function updateMovimento(db: D1Database, m: Movimento): Promise<void> {
  const editable = COLUMNS.filter((c) => c !== 'id' && c !== 'created_at')
  const setClause = editable.map((c) => `${c} = ?`).join(', ')
  const values = editable.map((c) => (m as unknown as Record<string, unknown>)[c])
  await db
    .prepare(`UPDATE movimenti SET ${setClause} WHERE id = ?`)
    .bind(...values, m.id)
    .run()
}

export async function deleteMovimentoById(db: D1Database, id: string): Promise<boolean> {
  const res = await db.prepare('DELETE FROM movimenti WHERE id = ?').bind(id).run()
  return (res.meta?.changes ?? 0) > 0
}

// ---------- anti brute-force login (best-effort: degrada se la tabella manca) ----------

const MAX_FAILS = 8
const WINDOW_MS = 15 * 60 * 1000
const LOCK_MS = 15 * 60 * 1000

export async function isLoginLocked(db: D1Database, ip: string): Promise<boolean> {
  try {
    const row = await db
      .prepare('SELECT locked_until FROM login_attempts WHERE ip = ?')
      .bind(ip)
      .first<{ locked_until: number | null }>()
    return Boolean(row && row.locked_until && row.locked_until > Date.now())
  } catch {
    return false
  }
}

export async function registerLoginFailure(db: D1Database, ip: string): Promise<void> {
  try {
    const now = Date.now()
    const row = await db
      .prepare('SELECT fails, first_fail FROM login_attempts WHERE ip = ?')
      .bind(ip)
      .first<{ fails: number; first_fail: number | null }>()
    if (!row) {
      await db
        .prepare('INSERT INTO login_attempts (ip, fails, first_fail, locked_until) VALUES (?, 1, ?, NULL)')
        .bind(ip, now)
        .run()
      return
    }
    const windowStart = row.first_fail ?? now
    let fails = row.fails + 1
    let firstFail = windowStart
    if (now - windowStart > WINDOW_MS) {
      fails = 1
      firstFail = now
    }
    const lockedUntil = fails >= MAX_FAILS ? now + LOCK_MS : null
    await db
      .prepare('UPDATE login_attempts SET fails = ?, first_fail = ?, locked_until = ? WHERE ip = ?')
      .bind(fails, firstFail, lockedUntil, ip)
      .run()
  } catch {
    /* best-effort */
  }
}

export async function clearLoginFailures(db: D1Database, ip: string): Promise<void> {
  try {
    await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run()
  } catch {
    /* best-effort */
  }
}

// ---------- allegati (metadati su D1, file su R2) ----------

export async function insertAllegato(db: D1Database, a: Allegato): Promise<void> {
  await db
    .prepare(
      'INSERT INTO allegati (id, movimento_id, filename, content_type, size, r2_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(a.id, a.movimento_id, a.filename, a.content_type, a.size, a.r2_key, a.created_at)
    .run()
}

export async function listAllegatiByMovimento(db: D1Database, movimentoId: string): Promise<Allegato[]> {
  const res = await db
    .prepare('SELECT * FROM allegati WHERE movimento_id = ? ORDER BY created_at ASC')
    .bind(movimentoId)
    .all<Allegato>()
  return res.results ?? []
}

export async function getAllegatoById(db: D1Database, id: string): Promise<Allegato | null> {
  return db.prepare('SELECT * FROM allegati WHERE id = ?').bind(id).first<Allegato>()
}

export async function deleteAllegatoRow(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM allegati WHERE id = ?').bind(id).run()
}

// Elimina dal R2 e da D1 tutti gli allegati di un movimento (best-effort sul R2).
export async function deleteAllegatiForMovimento(
  db: D1Database,
  bucket: R2Bucket,
  movimentoId: string,
): Promise<void> {
  const allegati = await listAllegatiByMovimento(db, movimentoId)
  for (const a of allegati) {
    try {
      await bucket.delete(a.r2_key)
    } catch {
      /* best-effort: prosegue comunque */
    }
  }
  await db.prepare('DELETE FROM allegati WHERE movimento_id = ?').bind(movimentoId).run()
}
