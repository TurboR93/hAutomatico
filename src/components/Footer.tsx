import { motion } from 'framer-motion'
import WavyDivider from './WavyDivider'

const Footer = () => {
  return (
    <footer className="bg-[#FDF07A] text-black relative" style={{ marginTop: '-1px' }}>
      <WavyDivider fromColor="#D03F29" toColor="#FDF07A" />
      <div className="container mx-auto px-4 py-4">
        <motion.div
          className="flex flex-wrap items-start justify-between gap-4 mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Left - Brand Info */}
          <div className="max-w-sm">
            <h3 className="text-base font-black uppercase mb-1">HAUTOMATICO</h3>
            <p className="text-[10px] leading-tight text-black/70">
              La \"h\" di hAutomatico richiama la costante di Planck, rendendo l'automazione
              più efficiente, precisa e misurabile.
            </p>
          </div>

          {/* Middle - Location */}
          <div>
            <h4 className="text-xs font-bold uppercase mb-1">Dove</h4>
            <p className="text-[10px] leading-tight text-black/70">
              Via Cucumero 13, Vittorio Veneto (TV), Italia
            </p>
          </div>

          {/* Right - Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase mb-1">Contatti</h4>
            <a
              href="mailto:info@hautomatico.com"
              className="text-[10px] hover:text-[#D03F29] transition-colors"
            >
              info@hautomatico.com
            </a>
          </div>
        </motion.div>

        {/* Bottom - P. IVA */}
        <motion.div
          className="border-t border-black/10 pt-2 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-[9px] text-black/50">P. IVA : 0435993344w</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer


