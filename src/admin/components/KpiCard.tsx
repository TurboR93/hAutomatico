import { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { LucideProps } from 'lucide-react'

type Accent = 'yellow' | 'red' | 'dark' | 'green' | 'plain'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  icon?: ComponentType<LucideProps>
  accent?: Accent
  delay?: number
}

const styles: Record<Accent, { card: string; chip: string }> = {
  yellow: { card: 'bg-[#FDF07A] text-black', chip: 'bg-black/10 text-black' },
  red: { card: 'bg-[#D03F29] text-white', chip: 'bg-white/20 text-white' },
  dark: { card: 'bg-black text-white', chip: 'bg-white/15 text-white' },
  green: { card: 'bg-emerald-600 text-white', chip: 'bg-white/20 text-white' },
  plain: { card: 'bg-white text-black border border-black/10', chip: 'bg-black/5 text-black' },
}

const KpiCard = ({ label, value, sub, icon: Icon, accent = 'plain', delay = 0 }: KpiCardProps) => {
  const s = styles[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl p-5 shadow-sm ${s.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-bold uppercase tracking-wide opacity-80">{label}</span>
        {Icon && (
          <span className={`rounded-lg p-1.5 ${s.chip}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-black md:text-3xl">{value}</div>
      {sub && <div className="mt-1 text-xs font-medium opacity-75">{sub}</div>}
    </motion.div>
  )
}

export default KpiCard
