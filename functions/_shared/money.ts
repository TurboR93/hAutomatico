// Calcolo fiscale (puro, senza dipendenze). Unica fonte di verita' lato server.
// Tenere allineato con src/admin/money.ts (anteprima lato client).
//
// Struttura fattura italiana:
//   imponibile (compenso)
//   + cassa            = imponibile * cassa%        (contributo previdenziale/cassa, opzionale)
//   base IVA           = imponibile + cassa
//   + IVA              = base IVA * iva%
//   - ritenuta         = imponibile * ritenuta%     (ritenuta d'acconto sul COMPENSO)
//   = Totale documento = imponibile + cassa + IVA
//   = Netto a pagare   = Totale documento - ritenuta
//
// Note di coerenza fiscale:
// - La ritenuta d'acconto si calcola sull'imponibile (compenso), non sull'IVA.
// - L'IVA si calcola sulla base imponibile maggiorata dell'eventuale contributo cassa.
// - Regime forfettario: impostare iva% = 0 e ritenuta% = 0 (nessuna rivalsa IVA ne' ritenuta).

export interface AmountInput {
  imponibile_cents?: number | null
  cassa_percentuale?: number | null
  iva_percentuale?: number | null
  ritenuta_percentuale?: number | null
}

export interface ComputedAmounts {
  imponibile_cents: number
  cassa_percentuale: number
  cassa_cents: number
  iva_percentuale: number
  iva_cents: number
  ritenuta_percentuale: number
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

export function computeAmounts(input: AmountInput): ComputedAmounts {
  const imponibile = toInt(input.imponibile_cents)
  const cassaPerc = toPerc(input.cassa_percentuale)
  const ivaPerc = toPerc(input.iva_percentuale)
  const ritenutaPerc = toPerc(input.ritenuta_percentuale)

  const cassa = Math.round((imponibile * cassaPerc) / 100)
  const baseIva = imponibile + cassa
  const iva = Math.round((baseIva * ivaPerc) / 100)
  const ritenuta = Math.round((imponibile * ritenutaPerc) / 100)
  const totale = imponibile + cassa + iva
  const netto = totale - ritenuta

  return {
    imponibile_cents: imponibile,
    cassa_percentuale: cassaPerc,
    cassa_cents: cassa,
    iva_percentuale: ivaPerc,
    iva_cents: iva,
    ritenuta_percentuale: ritenutaPerc,
    ritenuta_cents: ritenuta,
    totale_cents: totale,
    netto_cents: netto,
  }
}
