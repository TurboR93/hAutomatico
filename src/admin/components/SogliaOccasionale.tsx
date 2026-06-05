import { motion } from 'framer-motion'
import { AlertTriangle, Gauge } from 'lucide-react'
import { formatEuro } from '../format'
import { Kpi } from '../types'

// Banner soglia prestazione occasionale (privato senza P.IVA): 5.000 € lordi/anno.
// Conta il LORDO dei compensi con ritenuta dell'anno solare. Il netto è il bonifico
// ricevuto, la ritenuta (20%) la versa il committente come acconto IRPEF.
const SogliaOccasionale = ({ kpi }: { kpi: Kpi }) => {
  const { sogliaCompensi, compensiLordiAnno, compensiNettiAnno, ritenuteAnno, annoFiscale } = kpi
  const soglia = sogliaCompensi || 500000
  const pct = soglia > 0 ? (compensiLordiAnno / soglia) * 100 : 0
  const residuoLordo = Math.max(0, soglia - compensiLordiAnno)
  // Netto ancora incassabile a parità di ritenuta 20% (4.000 netti su 5.000 lordi).
  const residuoNetto = Math.round(residuoLordo * 0.8)
  const over = compensiLordiAnno > soglia

  const barColor = over ? 'bg-[#D03F29]' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
  const accentText = over ? 'text-[#D03F29]' : pct >= 80 ? 'text-amber-600' : 'text-emerald-700'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          <Gauge size={18} className={accentText} />
          <h2 className="font-black">Prestazione occasionale · {annoFiscale}</h2>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black ${accentText}`}>{formatEuro(compensiLordiAnno)}</span>
          <span className="text-sm font-bold text-black/40"> / {formatEuro(soglia)} lordi</span>
        </div>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        {over ? (
          <span className="flex items-center gap-1.5 font-bold text-[#D03F29]">
            <AlertTriangle size={15} />
            Soglia superata di {formatEuro(compensiLordiAnno - soglia)} lordi
          </span>
        ) : (
          <span className="text-black/60">
            Puoi ancora incassare <b className="text-black">{formatEuro(residuoNetto)}</b> netti
            <span className="text-black/40"> ({formatEuro(residuoLordo)} lordi)</span>
          </span>
        )}
        <span className="text-black/40">{Math.round(pct)}% utilizzato</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-black/5 pt-3 text-sm sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-black/40">Netto incassato</div>
          <div className="font-bold">{formatEuro(compensiNettiAnno)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-black/40">Ritenuta trattenuta</div>
          <div className="font-bold">{formatEuro(ritenuteAnno)}</div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-xs uppercase tracking-wide text-black/40">Acconto IRPEF</div>
          <div className="text-xs text-black/50">
            la versa il committente, è un tuo credito d'imposta
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SogliaOccasionale
