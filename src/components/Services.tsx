import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import WavyDivider from './WavyDivider'
import { services } from '../data/services'
import { GeometricField, RevealText, Reveal, Marquee } from './motion'

const keywords = [
  'AUTOMAZIONE',
  'INTELLIGENZA ARTIFICIALE',
  'GESTIONALI',
  'E-COMMERCE',
  'TURNI',
  'PRENOTAZIONI',
  'DASHBOARD',
  'EFFICIENZA',
]

const Services = () => {
  return (
    <section
      id="servizi"
      className="bg-[#D03F29] text-white relative overflow-hidden"
      style={{ marginTop: '-1px' }}
    >
      <WavyDivider fromColor="#FDF07A" toColor="#D03F29" />
      <GeometricField variant="on-red" density="medium" seed={3} />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <RevealText
          as="h2"
          splitBy="word"
          className="text-4xl md:text-5xl font-black uppercase text-center mb-10"
        >
          COSA POSSIAMO FARE, PARTIAMO DA...
        </RevealText>

        {/* Striscia keyword scorrevole */}
        <div className="mb-16 border-y border-white/15 py-3">
          <Marquee
            items={keywords}
            speed={32}
            itemClassName="text-lg md:text-xl font-black uppercase text-white/90"
            separatorColor={'rgba(253, 240, 122, 0.9)'}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Reveal key={service.id} y={50} delay={service.delay} className="h-full">
              <motion.div
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="rounded-3xl h-full"
              >
                <Link
                  to={`/servizi/${service.id}`}
                  className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 flex flex-col border border-white/10 shadow-lg group h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDF07A]"
                >
                  {/* Image */}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black uppercase mb-3">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-[#FDF07A]">
                    <span className="block text-sm font-medium uppercase tracking-wider opacity-80">
                      a partire da
                    </span>
                    <span className="text-3xl font-bold">{service.price}</span>
                  </p>
                  <p className="text-base leading-relaxed flex-grow mb-6">
                    {service.shortDescription}
                  </p>

                  {/* CTA visivo */}
                  <span className="inline-flex items-center gap-2 text-[#FDF07A] font-bold uppercase transition-all group-hover:gap-4">
                    Scopri di più
                    <ArrowRight size={20} />
                  </span>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
