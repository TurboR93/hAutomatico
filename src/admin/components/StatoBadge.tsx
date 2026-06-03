import { STATO_LABEL } from '../types'

const COLORS: Record<string, string> = {
  // conclusi / positivi
  incassato: 'bg-emerald-100 text-emerald-800',
  pagata: 'bg-emerald-100 text-emerald-800',
  versata: 'bg-emerald-100 text-emerald-800',
  completato: 'bg-emerald-100 text-emerald-800',
  fatturato: 'bg-emerald-100 text-emerald-800',
  // in sospeso
  emessa: 'bg-amber-100 text-amber-800',
  da_fare: 'bg-amber-100 text-amber-800',
  da_pagare: 'bg-amber-100 text-amber-800',
  da_versare: 'bg-amber-100 text-amber-800',
  firmato: 'bg-sky-100 text-sky-800',
  in_corso: 'bg-sky-100 text-sky-800',
}

function colorOf(stato: string | null): string {
  if (!stato) return 'bg-neutral-100 text-neutral-600'
  return COLORS[stato] || 'bg-neutral-100 text-neutral-700'
}

interface StatoBadgeProps {
  stato: string | null
  options?: string[]
  onChange?: (stato: string) => void
}

const StatoBadge = ({ stato, options, onChange }: StatoBadgeProps) => {
  const cls = colorOf(stato)

  if (options && onChange) {
    return (
      <select
        value={stato || ''}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/20 ${cls}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {STATO_LABEL[o] || o}
          </option>
        ))}
      </select>
    )
  }

  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>
      {stato ? STATO_LABEL[stato] || stato : '—'}
    </span>
  )
}

export default StatoBadge
