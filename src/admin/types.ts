// Tipi e costanti dell'area amministrazione (lato client).
// Tenere allineato con functions/_shared/types.ts.

export type TipoMovimento =
  | 'pagamento'
  | 'fattura_emessa'
  | 'fattura_ricevuta'
  | 'ritenuta'
  | 'preventivo'

export const TIPI: TipoMovimento[] = [
  'pagamento',
  'fattura_emessa',
  'fattura_ricevuta',
  'ritenuta',
  'preventivo',
]

export const TIPO_LABEL: Record<TipoMovimento, string> = {
  pagamento: 'Pagamento ricevuto',
  fattura_emessa: 'Fattura emessa',
  fattura_ricevuta: 'Fattura ricevuta',
  ritenuta: "Ritenuta d'acconto",
  preventivo: 'Preventivo',
}

export const STATI_PER_TIPO: Record<TipoMovimento, string[]> = {
  pagamento: ['incassato'],
  fattura_emessa: ['da_fare', 'emessa', 'pagata'],
  fattura_ricevuta: ['da_pagare', 'pagata'],
  ritenuta: ['da_versare', 'versata'],
  preventivo: ['firmato', 'in_corso', 'completato', 'fatturato'],
}

export const STATO_LABEL: Record<string, string> = {
  incassato: 'Incassato',
  da_fare: 'Da fare',
  emessa: 'Emessa',
  pagata: 'Pagata',
  da_pagare: 'Da pagare',
  da_versare: 'Da versare',
  versata: 'Versata',
  firmato: 'Firmato',
  in_corso: 'In corso',
  completato: 'Completato',
  fatturato: 'Fatturato',
}

// Stati che indicano "denaro effettivamente movimentato".
export const STATI_CONCLUSI = new Set(['incassato', 'pagata', 'versata'])

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
  note: string | null
  created_at: number
  updated_at: number
}

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
  note?: string | null
}

export interface Kpi {
  fatturato: number
  incassato: number
  daIncassare: number
  spese: number
  spesePagate: number
  speseDaPagare: number
  saldo: number
  ritenuteSubite: number
  pipelinePreventivi: number
}

export interface Conteggi {
  fattureDaFare: number
  fattureEmesse: number
  fattureDaPagare: number
  preventiviAperti: number
  ritenuteDaVersare: number
}

export interface PuntoMensile {
  mese: string
  incassi: number
  spese: number
}

export interface Summary {
  kpi: Kpi
  conteggi: Conteggi
  serieMensile: PuntoMensile[]
}

export function isEntrata(tipo: TipoMovimento): boolean {
  return tipo === 'pagamento' || tipo === 'fattura_emessa'
}
