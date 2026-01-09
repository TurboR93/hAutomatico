import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import WavyDivider from './WavyDivider'
import { services } from '../data/services'

const Services = () => {
  return (
    <section
      id="servizi"
      className="bg-[#D03F29] text-white relative"
      style={{ marginTop: '-1px' }}
    >
      <WavyDivider fromColor="#FDF07A" toColor="#D03F29" />
      <div className="container mx-auto px-6 py-20">
        <motion.h2
          className="text-4xl md:text-5xl font-black uppercase text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          COSA POSSIAMO FARE, PARTIAMO DA...
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 flex flex-col border border-white/10 shadow-lg group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: service.delay }}
              whileHover={{
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
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
              <p className="text-3xl font-bold mb-4 text-[#FDF07A]">
                {service.price}
              </p>
              <p className="text-base leading-relaxed flex-grow mb-6">
                {service.shortDescription}
              </p>

              {/* Link */}
              <Link
                to={`/servizi/${service.id}`}
                className="inline-flex items-center gap-2 text-[#FDF07A] font-bold uppercase hover:gap-4 transition-all"
              >
                Scopri di più
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
