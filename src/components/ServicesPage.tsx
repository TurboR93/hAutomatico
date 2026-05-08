import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import Services from './Services'

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero giallo: contesto + spazio per la navbar */}
      <section className="bg-[#FDF07A] pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-black uppercase text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            I Nostri Servizi
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Soluzioni di automazione e AI pensate per aziende reali.
            Scegli quella giusta per te.
          </motion.p>
        </div>
      </section>

      <Services />

      <Footer />
    </div>
  )
}

export default ServicesPage
