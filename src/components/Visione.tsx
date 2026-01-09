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
              src={`${BASE_URL}imgs/image_describilng_classic_papers_merging_to_digital_elements_5a10xyxgato608l4dplp_0.png`}
              alt="Matrix Code"
              className="w-full h-auto"
              style={{ scale }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Visione

