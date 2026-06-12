import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { services } from '../data/services'
import Header from './Header'
import Footer from './Footer'
import { GeometricField, RevealText, Reveal, MagneticButton, AccentLine, PALETTE } from './motion'
import { useSeo } from '../hooks/useSeo'

const SITE = 'https://www.hautomatico.com'

const ServiceDetail = () => {
    const { serviceId } = useParams<{ serviceId: string }>()
    const service = services.find((s) => s.id === serviceId)

    const serviceUrl = `${SITE}/servizi/${service?.id ?? ''}`

    useSeo(
        service
            ? {
                  title: `${service.title} — hAutomatico`,
                  description: service.shortDescription,
                  path: `/servizi/${service.id}`,
                  image: service.image,
                  jsonLd: [
                      {
                          '@context': 'https://schema.org',
                          '@type': 'Service',
                          name: service.title,
                          description: service.shortDescription,
                          url: serviceUrl,
                          image: `${SITE}${service.image}`,
                          areaServed: 'IT',
                          provider: {
                              '@type': 'Organization',
                              name: 'hAutomatico',
                              url: `${SITE}/`,
                          },
                      },
                      {
                          '@context': 'https://schema.org',
                          '@type': 'BreadcrumbList',
                          itemListElement: [
                              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                              { '@type': 'ListItem', position: 2, name: 'Servizi', item: `${SITE}/servizi` },
                              { '@type': 'ListItem', position: 3, name: service.title, item: serviceUrl },
                          ],
                      },
                  ],
              }
            : {
                  title: 'Servizio non trovato — hAutomatico',
                  description: 'La pagina del servizio richiesto non è disponibile.',
                  path: `/servizi/${serviceId ?? ''}`,
              }
    )

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
            <section className="bg-[#FDF07A] pt-32 pb-20 relative overflow-hidden">
                <GeometricField variant="on-yellow" density="medium" seed={7} />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/servizi"
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
                            <RevealText
                                as="h1"
                                splitBy="word"
                                className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#D03F29] mb-3"
                            >
                                {service.title}
                            </RevealText>
                            <AccentLine color={PALETTE.red} width={130} className="mb-6" />
                            <a
                                href="mailto:info@hautomatico.com"
                                className="inline-flex items-center gap-2 text-xl font-bold uppercase text-[#D03F29] mb-6 hover:gap-4 transition-all"
                            >
                                Scopri di più
                                <ArrowRight size={22} />
                            </a>
                            <p className="text-lg md:text-xl leading-relaxed text-black/80">
                                {service.fullDescription}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-black text-white py-20 relative overflow-hidden">
                <GeometricField variant="on-dark" density="medium" seed={1} />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="mb-12 flex flex-col items-center">
                        <RevealText
                            as="h2"
                            className="text-3xl md:text-4xl font-black uppercase text-[#D03F29] text-center"
                        >
                            Funzionalità Incluse
                        </RevealText>
                        <AccentLine color={PALETTE.red} width={120} className="mt-4" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {service.features.map((feature, index) => (
                            <Reveal key={index} y={20} delay={index * 0.08}>
                                <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 h-full">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#D03F29] rounded-full flex items-center justify-center">
                                        <Check size={20} className="text-white" />
                                    </div>
                                    <p className="text-lg">{feature}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#D03F29] text-white py-20 relative overflow-hidden">
                <GeometricField variant="on-red" density="low" seed={9} />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <RevealText
                        as="h2"
                        className="text-3xl md:text-4xl font-black uppercase mb-6"
                    >
                        {`Interessato a ${service.title}?`}
                    </RevealText>
                    <Reveal delay={0.1}>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Contattaci per una demo gratuita e scopri come possiamo
                            rivoluzionare la tua attività.
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <MagneticButton strength={0.4}>
                            <motion.a
                                href="mailto:info@hautomatico.com"
                                className="inline-block bg-[#FDF07A] text-black font-bold uppercase px-8 py-4 rounded-full hover:scale-105 transition-transform"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Richiedi Demo
                            </motion.a>
                        </MagneticButton>
                    </Reveal>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default ServiceDetail
