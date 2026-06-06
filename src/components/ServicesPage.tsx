import Header from './Header'
import Footer from './Footer'
import Services from './Services'
import { GeometricField, RevealText, Reveal, AccentLine, PALETTE } from './motion'
import { useSeo } from '../hooks/useSeo'
import { services } from '../data/services'

const ServicesPage = () => {
  useSeo({
    title: 'Servizi — Software gestionali e automazione | hAutomatico',
    description:
      'Gestionali, e-commerce, gestione turni, noleggio, ristorazione, sicurezza cantiere e siti web: soluzioni di automazione e AI su misura per la tua azienda.',
    path: '/servizi',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.hautomatico.com/servizi/${s.id}`,
        name: s.title,
      })),
    },
  })
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero giallo: contesto + spazio per la navbar */}
      <section className="bg-[#FDF07A] pt-32 pb-16 relative overflow-hidden">
        <GeometricField variant="on-yellow" density="medium" seed={5} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex flex-col items-center">
            <RevealText
              as="h1"
              className="text-4xl md:text-6xl font-black uppercase text-black mb-4"
            >
              I Nostri Servizi
            </RevealText>
            <AccentLine color={PALETTE.red} width={150} className="mb-6" />
          </div>
          <Reveal delay={0.15}>
            <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
              Soluzioni di automazione e AI pensate per aziende reali.
              Scegli quella giusta per te.
            </p>
          </Reveal>
        </div>
      </section>

      <Services />

      <Footer />
    </div>
  )
}

export default ServicesPage
