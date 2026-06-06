import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import WavyDivider from './WavyDivider'
import { GeometricField, RevealText, Reveal, AccentLine, PALETTE } from './motion'

const BASE_URL = import.meta.env.BASE_URL

const Visione = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const scale = reduce ? 1 : scaleRaw

  return (
    <section ref={ref} className="bg-black text-white relative overflow-hidden">
      {/* Geometrie "quantum" — riusa lo scroll progress della sezione */}
      <GeometricField variant="on-dark" density="medium" parallax progress={scrollYProgress} seed={2} />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <Reveal y={50} className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div>
            <RevealText as="h2" className="text-5xl md:text-6xl font-black uppercase text-[#D03F29] mb-4">
              VISIONE
            </RevealText>
            <AccentLine color={PALETTE.red} width={130} className="mb-6" />
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
        </Reveal>
      </div>

      {/* Wavy transition to Missione */}
      <WavyDivider orientation="bottom" fromColor="#000000" toColor="#FDF07A" animate />
    </section>
  )
}

export default Visione
