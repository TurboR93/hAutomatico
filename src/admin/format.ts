// Helper di formattazione: valuta in euro, date, conversioni centesimi <-> euro.

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

// Centesimi (interi) -> '€ 1.234,56'
export function formatEuro(cents: number | null | undefined): string {
  return eur.format((Number(cents) || 0) / 100)
}

// Stringa euro digitata dall'utente ('1.234,56' o '1234.56') -> centesimi interi.
export function euroToCents(value: string): number {
  if (!value) return 0
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '') // togli i punti delle migliaia
    .replace(',', '.')
  const n = parseFloat(normalized)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

// Centesimi -> stringa per input ('1234.56' senza simbolo, comodo da editare).
export function centsToInput(cents: number | null | undefined): string {
  const n = Number(cents) || 0
  if (n === 0) return ''
  return (n / 100).toFixed(2)
}

// ISO 'YYYY-MM-DD' -> 'GG/MM/AAAA'
export function formatData(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

// 'YYYY-MM' -> 'gen 2026'
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
export function formatMese(ym: string): string {
  const [y, m] = ym.split('-')
  const idx = parseInt(m, 10) - 1
  if (idx < 0 || idx > 11) return ym
  return `${MESI[idx]} ${y}`
}

// Data odierna in ISO 'YYYY-MM-DD' (per i default dei form).
export function oggiISO(): string {
  return new Date().toISOString().slice(0, 10)
}
