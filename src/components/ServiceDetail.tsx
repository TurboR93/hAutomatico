import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { services } from '../data/services'
import Header from './Header'
import Footer from './Footer'

const ServiceDetail = () => {
    const { serviceId } = useParams<{ serviceId: string }>()
    const service = services.find((s) => s.id === serviceId)

    if (!service) {
        return (
            <div className="min-h-screen bg-[#FDF07A] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-[#D03F29] mb-4">
                        Servizio non trovato
                    </h1>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-black hover:text-[#D03F29] transition-colors font-bold"
                    >
                        <ArrowLeft size={20} />
                        Torna alla home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="bg-[#FDF07A] pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/#servizi"
                            className="inline-flex items-center gap-2 text-black hover:text-[#D03F29] transition-colors font-bold mb-8"
                        >
                            <ArrowLeft size={20} />
                            Torna ai servizi
                        </Link>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left - Image */}
                        <motion.div
                            className="rounded-3xl overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-auto"
                            />
                        </motion.div>

                        {/* Right - Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#D03F29] mb-4">
                                {service.title}
                            </h1>
                            <p className="text-4xl font-bold text-black mb-6">
                                {service.price}
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed text-black/80">
                                {service.fullDescription}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-black text-white py-20">
                <div className="container mx-auto px-6">
                    <motion.h2
                        className="text-3xl md:text-4xl font-black uppercase text-[#D03F29] mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Funzionalità Incluse
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {service.features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-[#D03F29] rounded-full flex items-center justify-center">
                                    <Check size={20} className="text-white" />
                                </div>
                                <p className="text-lg">{feature}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#D03F29] text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-black uppercase mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Interessato a {service.title}?
                    </motion.h2>
                    <motion.p
                        className="text-xl mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Contattaci per una demo gratuita e scopri come possiamo
                        rivoluzionare la tua attività.
                    </motion.p>
                    <motion.a
                        href="mailto:info@hautomatico.com"
                        className="inline-block bg-[#FDF07A] text-black font-bold uppercase px-8 py-4 rounded-full hover:scale-105 transition-transform"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Richiedi Demo
                    </motion.a>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default ServiceDetail
