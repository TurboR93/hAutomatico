// Tipi condivisi lato server (Cloudflare Pages Functions / Workers runtime).
// Tenere allineato con src/admin/types.ts (lato client).

export interface Env {
  DB: D1Database
  DOCS: R2Bucket
  ADMIN_PASSWORD_HASH: string
  AUTH_SECRET: string
}

export interface Allegato {
  id: string
  movimento_id: string
  filename: string
  content_type: string | null
  size: number
  r2_key: string
  created_at: number
}

export interface Cliente {
  id: string
  nome: string
  email: string | null
  telefono: string | null
  piva_cf: string | null
  indirizzo: string | null
  note: string | null
  created_at: number
  updated_at: number
}

export interface ClienteInput {
  nome: string
  email?: string | null
  telefono?: string | null
  piva_cf?: string | null
  indirizzo?: string | null
  note?: string | null
}

export type TipoMovimento =
  | 'pagamento'
  | 'spesa'
  | 'fattura_emessa'
  | 'fattura_ricevuta'
  | 'ritenuta'
  | 'preventivo'

export const TIPI: TipoMovimento[] = [
  'pagamento',
  'spesa',
  'fattura_emessa',
  'fattura_ricevuta',
  'ritenuta',
  'preventivo',
]

export type Ricorrenza = 'una_tantum' | 'mensile' | 'annuale'
export const RICORRENZE: Ricorrenza[] = ['una_tantum', 'mensile', 'annuale']

// Stati ammessi per ciascun tipo (macchina a stati, validata lato server).
export const STATI_PER_TIPO: Record<TipoMovimento, string[]> = {
  pagamento: ['incassato'],
  spesa: ['pagata', 'da_pagare'],
  fattura_emessa: ['da_fare', 'emessa', 'pagata'],
  fattura_ricevuta: ['da_pagare', 'pagata'],
  // Compenso occasionale: lo incassi (la ritenuta la versa il committente, non tu).
  ritenuta: ['da_incassare', 'incassato'],
  preventivo: ['firmato', 'in_corso', 'completato', 'fatturato'],
}

export interface Movimento {
  id: string
  tipo: TipoMovimento
  controparte: string | null
  descrizione: string | null
  numero: string | null
  data: string | null
  data_scadenza: string | null
  data_pagamento: string | null
  imponibile_cents: number
  cassa_percentuale: number
  cassa_cents: number
  iva_percentuale: number
  iva_cents: number
  ritenuta_percentuale: number
  ritenuta_cents: number
  totale_cents: number
  netto_cents: number
  stato: string | null
  fattura_id: string | null
  preventivo_id: string | null
  cliente_id: string | null
  note: string | null
  ricorrenza: string
  prossimo_rinnovo: string | null
  created_at: number
  updated_at: number
  allegati_count?: number
  incassato_collegato?: number
}

// Campi accettati in input (gli importi calcolati vengono ricalcolati server-side).
export interface MovimentoInput {
  tipo: TipoMovimento
  controparte?: string | null
  descrizione?: string | null
  numero?: string | null
  data?: string | null
  data_scadenza?: string | null
  data_pagamento?: string | null
  imponibile_cents?: number
  cassa_percentuale?: number
  iva_percentuale?: number
  ritenuta_percentuale?: number
  stato?: string | null
  fattura_id?: string | null
  preventivo_id?: string | null
  cliente_id?: string | null
  note?: string | null
  ricorrenza?: string | null
  prossimo_rinnovo?: string | null
}
