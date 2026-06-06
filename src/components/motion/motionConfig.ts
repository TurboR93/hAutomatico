/**
 * Shared tokens for the "Quantum Geometry" motion system.
 * Keeps every primitive consistent and palette-aware while preserving the
 * existing brand colors (#FDF07A yellow, #D03F29 red, black, white).
 */

export type Variant = 'on-dark' | 'on-yellow' | 'on-red'

export const PALETTE = {
  yellow: '#FDF07A',
  red: '#D03F29',
  black: '#000000',
  white: '#FFFFFF',
} as const

/** Expo-out-ish curve — gives reveals and "drawn" strokes a settled finish. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Stroke / accent colors tuned for each section background. Kept subtle so
 *  the decorative geometry reads as atmosphere, never noise. */
export const STROKE: Record<
  Variant,
  { line: string; faint: string; accent: string; dot: string }
> = {
  'on-dark': {
    line: 'rgba(253, 240, 122, 0.20)', // faint yellow on black
    faint: 'rgba(255, 255, 255, 0.09)',
    accent: 'rgba(208, 63, 41, 0.60)', // red
    dot: 'rgba(253, 240, 122, 0.38)',
  },
  'on-yellow': {
    line: 'rgba(0, 0, 0, 0.15)',
    faint: 'rgba(0, 0, 0, 0.07)',
    accent: 'rgba(208, 63, 41, 0.50)',
    dot: 'rgba(208, 63, 41, 0.45)',
  },
  'on-red': {
    line: 'rgba(255, 255, 255, 0.24)',
    faint: 'rgba(255, 255, 255, 0.11)',
    accent: 'rgba(253, 240, 122, 0.72)',
    dot: 'rgba(253, 240, 122, 0.62)',
  },
}

/** Brand accent color to use for the "tratto" under headings, per variant. */
export const ACCENT_FOR: Record<Variant, string> = {
  'on-dark': PALETTE.red,
  'on-yellow': PALETTE.red,
  'on-red': PALETTE.yellow,
}
