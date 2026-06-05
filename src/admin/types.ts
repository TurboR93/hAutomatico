// Tipi e costanti dell'area amministrazione (lato client).
// Tenere allineato con functions/_shared/types.ts.

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

export const TIPO_LABEL: Record<TipoMovimento, string> = {
  pagamento: 'Pagamento ricevuto',
  spesa: 'Spesa',
  fattura_emessa: 'Fattura emessa',
  fattura_ricevuta: 'Fattura ricevuta',
  ritenuta: "Compenso (ritenuta d'acconto)",
  preventivo: 'Preventivo',
}

// Soglia annua dei compensi da prestazione occasionale (lordo), in centesimi.
// Da privato senza P.IVA: 5.000 € lordi/anno = 4.000 netti + 1.000 di ritenuta.
export const SOGLIA_COMPENSI_CENTS = 500000

// I movimenti contabili veri (il preventivo è pipeline, vive in un contesto separato).
export const MOVIMENTO_TIPI: TipoMovimento[] = [
  'pagamento',
  'spesa',
  'fattura_emessa',
  'fattura_ricevuta',
  'ritenuta',
]

export const STATI_PER_TIPO: Record<TipoMovimento, string[]> = {
  pagamento: ['incassato'],
  // Spesa semplice (anche ricorrente): di norma registrata già pagata.
  spesa: ['pagata', 'da_pagare'],
  fattura_emessa: ['da_fare', 'emessa', 'pagata'],
  fattura_ricevuta: ['da_pagare', 'pagata'],
  // Compenso occasionale: lo incassi (la ritenuta la versa il committente, non tu).
  ritenuta: ['da_incassare', 'incassato'],
  preventivo: ['firmato', 'in_corso', 'completato', 'fatturato'],
}

export const STATO_LABEL: Record<string, string> = {
  incassato: 'Incassato',
  da_incassare: 'Da incassare',
  da_fare: 'Da fare',
  emessa: 'Emessa',
  pagata: 'Pagata',
  da_pagare: 'Da pagare',
  // legacy (vecchie ritenute "da versare/versata", ora compensi): mantenuti per non
  // rompere la visualizzazione di righe storiche prima della migrazione.
  da_versare: 'Da versare',
  versata: 'Versata',
  firmato: 'Firmato',
  in_corso: 'In corso',
  completato: 'Completato',
  fatturato: 'Fatturato',
}

// Stati che indicano "denaro effettivamente movimentato".
export const STATI_CONCLUSI = new Set(['incassato', 'pagata', 'versata'])

export type Ricorrenza = 'una_tantum' | 'mensile' | 'annuale' | 'biennale' | 'quadriennale'
export const RICORRENZE: Ricorrenza[] = ['una_tantum', 'mensile', 'annuale', 'biennale', 'quadriennale']
export const RICORRENZA_LABEL: Record<string, string> = {
  una_tantum: 'Una tantum',
  mensile: 'Mensile',
  annuale: 'Annuale',
  biennale: 'Ogni 2 anni',
  quadriennale: 'Ogni 4 anni',
}
// Mesi coperti da un periodo, per normalizzare i costi ricorrenti.
export const MESI_PER_RICORRENZA: Record<string, number> = {
  mensile: 1,
  annuale: 12,
  biennale: 24,
  quadriennale: 48,
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
  // Solo in lettura: netto dei movimenti collegati ed effettivamente incassati
  // (valorizzato per i preventivi).
  incassato_collegato?: number
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
  preventivo_id?: string | null
  cliente_id?: string | null
  note?: string | null
  ricorrenza?: string | null
  prossimo_rinnovo?: string | null
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

export interface Allegato {
  id: string
  movimento_id: string
  filename: string
  content_type: string | null
  size: number
  created_at: number
}

export interface Kpi {
  fatturato: number
  incassato: number
  daIncassare: number
  spese: number
  spesePagate: number
  speseDaPagare: number
  saldo: number
  pipelinePreventivi: number
  entrateRicorrentiAnnue: number
  usciteRicorrentiAnnue: number
  // Prestazione occasionale (anno solare corrente).
  annoFiscale: number
  sogliaCompensi: number // soglia annua lordo (centesimi)
  compensiLordiAnno: number // lordo dei compensi con ritenuta nell'anno
  compensiNettiAnno: number // netto effettivamente incassato
  ritenuteAnno: number // ritenuta d'acconto trattenuta (acconto IRPEF)
}

export interface ProssimoRinnovo {
  id: string
  tipo: TipoMovimento
  controparte: string | null
  descrizione: string | null
  ricorrenza: string
  prossimo_rinnovo: string | null
  imponibile_cents: number
  totale_cents: number
}

export interface Conteggi {
  fattureDaFare: number
  fattureEmesse: number
  fattureDaPagare: number
  preventiviAperti: number
  compensiDaIncassare: number
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
  prossimiRinnovi: ProssimoRinnovo[]
}

export function isEntrata(tipo: TipoMovimento): boolean {
  return tipo === 'pagamento' || tipo === 'fattura_emessa' || tipo === 'ritenuta'
}
