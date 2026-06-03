import { PuntoMensile } from '../types'
import { formatEuro, formatMese } from '../format'

interface MonthlyChartProps {
  data: PuntoMensile[]
}

const CHART_H = 160

const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const points = data.filter((p) => p.mese).slice(-12)

  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/50">
        Nessun dato sufficiente per il grafico. Registra incassi e spese con una data.
      </div>
    )
  }

  const max = Math.max(1, ...points.flatMap((p) => [p.incassi, p.spese]))

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-black">Incassi vs Spese</h3>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Incassi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#D03F29]" /> Spese
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 overflow-x-auto" style={{ height: CHART_H + 24 }}>
        {points.map((p) => (
          <div key={p.mese} className="flex min-w-[44px] flex-1 flex-col items-center justify-end gap-1">
            <div className="flex w-full items-end justify-center gap-1" style={{ height: CHART_H }}>
              <div
                className="w-1/2 max-w-[18px] rounded-t bg-emerald-500"
                style={{ height: Math.max(2, (p.incassi / max) * CHART_H) }}
                title={`Incassi ${formatMese(p.mese)}: ${formatEuro(p.incassi)}`}
              />
              <div
                className="w-1/2 max-w-[18px] rounded-t bg-[#D03F29]"
                style={{ height: Math.max(2, (p.spese / max) * CHART_H) }}
                title={`Spese ${formatMese(p.mese)}: ${formatEuro(p.spese)}`}
              />
            </div>
            <span className="whitespace-nowrap text-[10px] font-medium text-black/50">
              {formatMese(p.mese)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthlyChart
