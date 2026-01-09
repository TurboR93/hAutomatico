import { motion } from 'framer-motion'

const BASE_URL = import.meta.env.BASE_URL

const Missione = () => {
  return (
    <section className="bg-[#FDF07A] text-black py-20 relative" style={{ marginTop: '-1px' }}>
      <div className="container mx-auto px-6">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left - Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src={`${BASE_URL}imgs/d53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_administrator_in_the_cen_8ugfg51cmh3dbucrj7k3_0.png`}
              alt="3D Network Illustration"
              className="w-full h-auto"
            />
          </div>

          {/* Right - Text */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase text-[#D03F29] mb-6">
              MISSIONE
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-black">
              La nostra missione è aiutare le aziende a semplificare integrando
              soluzioni di intelligenza, anche artificiale, nei loro flussi di lavoro.
              D'altronde cosa ha di umano ripetere sempre le stesse operazioni?
              Progettiamo e implementiamo modelli agenti AI che automatizzano attività
              ripetitive, supportano le decisioni strategiche. Crediamo in un'adozione
              etica e responsabile dell'AI, in grado di generare vantaggi competitivi
              non indifferenti.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Missione

