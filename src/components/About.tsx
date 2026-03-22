import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const BASE_URL = import.meta.env.BASE_URL

const values = [
  {
    title: 'Semplicità',
    description:
      'Ogni processo complesso può essere ridotto al suo "quanto" fondamentale. Partiamo sempre dall\'essenziale.',
  },
  {
    title: 'Misurabilità',
    description:
      'Ciò che non si misura non si migliora. Ogni soluzione che progettiamo è costruita attorno a KPI concreti.',
  },
  {
    title: 'Etica',
    description:
      'L\'intelligenza artificiale è uno strumento potente. La usiamo in modo responsabile, al servizio delle persone.',
  },
  {
    title: 'Concretezza',
    description:
      'Non vendiamo teoria. Costruiamo software che funziona, per aziende reali con problemi reali.',
  },
]

const SectionDivider = ({ fromColor, toColor }: { fromColor: string; toColor: string }) => (
  <div className="relative w-full overflow-hidden" style={{ height: '120px', marginTop: '-1px', backgroundColor: toColor }}>
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className="absolute top-0 left-0 w-full"
      style={{ display: 'block', height: '100%' }}
    >
      <path
        d="M0,80 C120,95 240,40 360,60 C480,80 600,30 720,55 C840,80 960,35 1080,58 C1200,80 1320,45 1440,65 L1440,0 L0,0 Z"
        fill={fromColor}
      />
      <path
        d="M0,50 C180,75 300,25 480,45 C660,65 780,20 960,40 C1140,60 1300,30 1440,50 L1440,0 L0,0 Z"
        fill={fromColor}
        opacity="0.6"
      />
    </svg>
  </div>
)

const About = () => {
  return (
    <>
      {/* Hero + Metodo — unica sezione nera */}
      <section className="bg-black text-white pt-32 pb-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #D03F29 0%, transparent 70%)',
            right: '-5%',
            top: '10%',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, #FDF07A 0%, transparent 70%)',
            left: '-3%',
            bottom: '20%',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto px-6">
          {/* Hero intro */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase text-[#D03F29] mb-6">
              Chi Siamo
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-3xl text-white/90">
              La <span className="text-[#FDF07A] font-bold">"h"</span> di hAutomatico
              richiama la costante di Planck, il simbolo della più piccola delle quantità.
              Non è solo un nome: è il nostro metodo.
            </p>
          </motion.div>

          {/* Il Metodo */}
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-[#D03F29] mb-6">
                Il Metodo
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-6">
                Come la costante di Planck definisce il quanto d'azione più piccolo in
                natura, noi scomponiamo ogni processo aziendale nel suo elemento
                fondamentale. Automatizziamo ciò che è ripetitivo, liberiamo tempo per
                ciò che è creativo.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-white/70">
                Lavoriamo con PMI del Triveneto e non solo, portando soluzioni concrete
                dove spesso si trovano solo promesse. Gestionali, e-commerce, turni,
                prenotazioni — ogni problema ha il suo "quanto" risolutivo.
              </p>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-3xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={`${BASE_URL}imgs/d53d22_ffe974_f7f6f3_bd005b_000000_a_minimal_artistic_image_representing_a_complex_software_archite_l12o91nah3zhota28knw_0.png`}
                alt="Software Architecture"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Divider nero → giallo */}
      <SectionDivider fromColor="#000000" toColor="#FDF07A" />

      {/* Valori Section */}
      <section className="bg-[#FDF07A] text-black py-20 relative" style={{ marginTop: '-1px' }}>
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-black uppercase text-[#D03F29] mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            I Nostri Valori
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-black/5 rounded-2xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                <h3 className="text-xl font-black uppercase text-[#D03F29] mb-3">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-black/80">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider giallo → rosso */}
      <SectionDivider fromColor="#FDF07A" toColor="#D03F29" />

      {/* Dove Operiamo Section */}
      <section className="bg-[#D03F29] text-white py-20 relative" style={{ marginTop: '-1px' }}>
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={`${BASE_URL}imgs/image_describilng_classic_papers_merging_to_digital_elements_p0zf8cekfg5i5ucnpws1_3.png`}
                alt="Digital Transformation"
                className="w-full h-auto"
              />
            </motion.div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
                Dove Operiamo
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-6">
                La nostra sede è a Vittorio Veneto, nel cuore del Triveneto. Operiamo
                con aziende locali e nazionali, con la stessa attenzione artigianale
                che contraddistingue il territorio.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-white/80 mb-8">
                Ogni progetto parte dall'ascolto. Capiamo il problema, lo riduciamo
                alla sua forma essenziale, e costruiamo la soluzione giusta — niente
                di più, niente di meno.
              </p>
              <Link
                to="/#servizi"
                className="inline-flex items-center gap-2 bg-[#FDF07A] text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
              >
                Scopri i nostri servizi
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
