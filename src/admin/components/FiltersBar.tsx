import { Search, X } from 'lucide-react'
import { STATI_PER_TIPO, STATO_LABEL, TIPI, TIPO_LABEL, TipoMovimento } from '../types'

export interface FiltersValues {
  tipo?: string
  stato?: string
  q?: string
  from?: string
  to?: string
}

interface FiltersBarProps {
  values: FiltersValues
  onChange: (patch: FiltersValues) => void
  showTipo?: boolean
  tipiOptions?: TipoMovimento[]
}

const inputCls =
  'rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:border-[#D03F29] focus:outline-none'

const FiltersBar = ({ values, onChange, showTipo = true, tipiOptions = TIPI }: FiltersBarProps) => {
  const statiOptions = values.tipo
    ? STATI_PER_TIPO[values.tipo as TipoMovimento] || []
    : Array.from(new Set(tipiOptions.flatMap((t) => STATI_PER_TIPO[t])))

  const hasFilters = Boolean(values.tipo || values.stato || values.q || values.from || values.to)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
        <input
          type="text"
          value={values.q || ''}
          onChange={(e) => onChange({ ...values, q: e.target.value })}
          placeholder="Cerca cliente, numero…"
          className={`${inputCls} pl-9`}
        />
      </div>

      {showTipo && (
        <select
          value={values.tipo || ''}
          onChange={(e) => onChange({ ...values, tipo: e.target.value, stato: '' })}
          className={inputCls}
        >
          <option value="">Tutti i tipi</option>
          {tipiOptions.map((t) => (
            <option key={t} value={t}>
              {TIPO_LABEL[t]}
            </option>
          ))}
        </select>
      )}

      <select
        value={values.stato || ''}
        onChange={(e) => onChange({ ...values, stato: e.target.value })}
        className={inputCls}
      >
        <option value="">Tutti gli stati</option>
        {statiOptions.map((s) => (
          <option key={s} value={s}>
            {STATO_LABEL[s] || s}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={values.from || ''}
        onChange={(e) => onChange({ ...values, from: e.target.value })}
        className={inputCls}
        title="Dal"
      />
      <input
        type="date"
        value={values.to || ''}
        onChange={(e) => onChange({ ...values, to: e.target.value })}
        className={inputCls}
        title="Al"
      />

      {hasFilters && (
        <button
          onClick={() => onChange({})}
          className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-[#D03F29] hover:bg-[#D03F29]/10"
        >
          <X size={16} />
          Azzera
        </button>
      )}
    </div>
  )
}

export default FiltersBar
