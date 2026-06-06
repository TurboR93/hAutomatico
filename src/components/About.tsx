import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import WavyDivider from './WavyDivider'
import {
  GeometricField,
  RevealText,
  Reveal,
  Counter,
  MagneticButton,
  AccentLine,
  DrawnPath,
  PALETTE,
} from './motion'

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

// TODO: sostituire con numeri reali
const stats = [
  { to: 120, suffix: '+', label: 'Processi automatizzati' },
  { to: 40, suffix: '+', label: 'Aziende servite' },
  { to: 65, suffix: '%', label: 'Tempo medio risparmiato' },
]

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

        {/* Geometrie "quantum" */}
        <GeometricField variant="on-dark" density="high" parallax seed={0} />

        <div className="container mx-auto px-6 relative z-10">
          {/* Hero intro */}
          <div className="mb-24">
            <RevealText
              as="h1"
              className="text-5xl md:text-7xl font-black uppercase text-[#D03F29] mb-4"
            >
              Chi Siamo
            </RevealText>
            <AccentLine color={PALETTE.red} width={150} className="mb-6" />
            <Reveal delay={0.15}>
              <p className="text-xl md:text-2xl leading-relaxed max-w-3xl text-white/90">
                La <span className="text-[#FDF07A] font-bold">"h"</span> di hAutomatico
                richiama la costante di Planck, il simbolo della più piccola delle quantità.
                Non è solo un nome: è il nostro metodo.
              </p>
            </Reveal>
          </div>

          {/* Il Metodo */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal y={50}>
              <RevealText
                as="h2"
                className="text-4xl md:text-5xl font-black uppercase text-[#D03F29] mb-4"
              >
                Il Metodo
              </RevealText>
              <AccentLine color={PALETTE.red} width={120} className="mb-6" />
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
            </Reveal>

            <Reveal y={50} delay={0.1}>
              <motion.div
                className="relative overflow-hidden rounded-3xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`${BASE_URL}imgs/architettura-software-aziendale.webp`}
                  alt="Architettura software aziendale"
                  className="w-full h-auto"
                />
              </motion.div>
            </Reveal>
          </div>

          {/* Connettore decorativo "quanto" */}
          <div className="flex justify-center my-12" aria-hidden="true">
            <DrawnPath
              d="M20,2 C8,18 32,30 20,46 C8,62 32,74 20,90"
              viewBox="0 0 40 92"
              stroke="rgba(253, 240, 122, 0.4)"
              strokeWidth={2}
              duration={1.4}
              className="h-20 w-10"
            />
          </div>

          {/* Striscia statistiche */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/10 pt-12">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.12} className="text-center sm:text-left">
                <div className="text-5xl md:text-6xl font-black text-[#FDF07A] mb-2">
                  <Counter to={stat.to} suffix={stat.suffix} />
                </div>
                <p className="text-sm uppercase tracking-wider text-white/60">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider nero → giallo */}
      <WavyDivider fromColor="#000000" toColor="#FDF07A" animate drawCrest crestColor="rgba(208,63,41,0.4)" />

      {/* Valori Section */}
      <section className="bg-[#FDF07A] text-black py-20 relative overflow-hidden" style={{ marginTop: '-1px' }}>
        <GeometricField variant="on-yellow" density="medium" seed={4} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-12 flex flex-col items-center">
            <RevealText
              as="h2"
              className="text-4xl md:text-5xl font-black uppercase text-[#D03F29] text-center"
            >
              I Nostri Valori
            </RevealText>
            <AccentLine color={PALETTE.red} width={120} className="mt-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.1}>
                <motion.div
                  className="bg-black/5 rounded-2xl p-6 h-full"
                  whileHover={{ y: -6, backgroundColor: 'rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <h3 className="text-xl font-black uppercase text-[#D03F29] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-black/80">{value.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider giallo → rosso */}
      <WavyDivider fromColor="#FDF07A" toColor="#D03F29" animate />

      {/* Dove Operiamo Section */}
      <section className="bg-[#D03F29] text-white py-20 relative overflow-hidden" style={{ marginTop: '-1px' }}>
        <GeometricField variant="on-red" density="medium" parallax seed={8} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal x={-40}>
              <motion.div
                className="relative overflow-hidden rounded-3xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`${BASE_URL}imgs/trasformazione-digitale-aziendale.webp`}
                  alt="Trasformazione digitale aziendale"
                  className="w-full h-auto"
                />
              </motion.div>
            </Reveal>

            <Reveal x={40} delay={0.1}>
              <RevealText as="h2" className="text-4xl md:text-5xl font-black uppercase mb-4">
                Dove Operiamo
              </RevealText>
              <AccentLine color={PALETTE.yellow} width={120} className="mb-6" />
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
              <MagneticButton strength={0.35}>
                <Link
                  to="/#servizi"
                  className="inline-flex items-center gap-2 bg-[#FDF07A] text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
                >
                  Scopri i nostri servizi
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
