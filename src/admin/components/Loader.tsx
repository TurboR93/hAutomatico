import { motion } from 'framer-motion'

interface LoaderProps {
  fullScreen?: boolean
  label?: string
}

const Loader = ({ fullScreen = false, label = 'Caricamento…' }: LoaderProps) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-[#FDF07A] border-t-[#D03F29]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <span className="text-sm font-medium text-black/60">{label}</span>
    </div>
  )

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center bg-white">{spinner}</div>
  }
  return <div className="flex items-center justify-center py-16">{spinner}</div>
}

export default Loader
