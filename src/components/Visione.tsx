import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const BASE_URL = import.meta.env.BASE_URL

const Visione = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <section ref={ref} className="bg-black text-white relative">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left - Text */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase text-[#D03F29] mb-6">
              VISIONE
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              La nostra visione è quella di diventare il punto di riferimento per
              l'adozione dedigitale nel tessuto industriale e commerciale,
              contribuendo a creare un futuro in cui dati, algoritmi e competenza
              umana collaborano in sinergia. Immaginiamo un'economia più intelligente
              e umana, dove ogni azienda innova i processi contemporaneamente alla
              qualità del lavoro.
            </p>
          </div>

          {/* Right - Image with Ken Burns Effect */}
          <motion.div className="relative overflow-hidden rounded-3xl">
            <motion.img
              src={`${BASE_URL}imgs/digitalizzazione-documenti.webp`}
              alt="Digitalizzazione documenti cartacei"
              className="w-full h-auto"
              style={{ scale }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Wavy transition to Missione */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '120px', marginBottom: '-1px' }}>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full"
          style={{ display: 'block' }}
        >
          <path
            d="M0,40 C120,25 240,80 360,60 C480,40 600,90 720,65 C840,40 960,85 1080,62 C1200,40 1320,75 1440,55 L1440,120 L0,120 Z"
            fill="#FDF07A"
          />
          <path
            d="M0,70 C180,45 300,95 480,75 C660,55 780,100 960,80 C1140,60 1300,90 1440,70 L1440,120 L0,120 Z"
            fill="#FDF07A"
            opacity="0.6"
          />
        </svg>
      </div>
    </section>
  )
}

export default Visione

