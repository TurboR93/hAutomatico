// Anteprima calcolo importi (lato client). Il calcolo autorevole resta server-side
// in functions/_shared/money.ts: tenere allineate le due funzioni.
//
// imponibile (+ cassa) + IVA - ritenuta
//   IVA su (imponibile + cassa); ritenuta sull'imponibile (compenso).

export interface AmountInput {
  imponibile_cents?: number | null
  cassa_percentuale?: number | null
  iva_percentuale?: number | null
  ritenuta_percentuale?: number | null
}

export interface ComputedAmounts {
  cassa_cents: number
  iva_cents: number
  ritenuta_cents: number
  totale_cents: number
  netto_cents: number
}

// I centesimi devono essere interi; le percentuali possono avere decimali.
function toInt(value: number | null | undefined): number {
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : 0
}
function toPerc(value: number | null | undefined): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

// Dato il NETTO che si vuole incassare, ricava l'imponibile (compenso lordo) tale che
// imponibile + cassa + IVA - ritenuta = netto. Caso tipico occasionale (cassa/IVA 0):
// imponibile = netto / (1 - ritenuta%).
export function grossUpToImponibile(
  nettoCents: number,
  cassaPerc = 0,
  ivaPerc = 0,
  ritenutaPerc = 0,
): number {
  const c = toPerc(cassaPerc) / 100
  const v = toPerc(ivaPerc) / 100
  const r = toPerc(ritenutaPerc) / 100
  const factor = 1 + c + (1 + c) * v - r
  if (!(factor > 0)) return toInt(nettoCents)
  return Math.round(toInt(nettoCents) / factor)
}

export function computeAmounts(input: AmountInput): ComputedAmounts {
  const imponibile = toInt(input.imponibile_cents)
  const cassaPerc = toPerc(input.cassa_percentuale)
  const ivaPerc = toPerc(input.iva_percentuale)
  const ritenutaPerc = toPerc(input.ritenuta_percentuale)

  const cassa = Math.round((imponibile * cassaPerc) / 100)
  const iva = Math.round(((imponibile + cassa) * ivaPerc) / 100)
  const ritenuta = Math.round((imponibile * ritenutaPerc) / 100)
  const totale = imponibile + cassa + iva
  const netto = totale - ritenuta

  return {
    cassa_cents: cassa,
    iva_cents: iva,
    ritenuta_cents: ritenuta,
    totale_cents: totale,
    netto_cents: netto,
  }
}
