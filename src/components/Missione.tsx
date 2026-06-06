import { GeometricField, RevealText, Reveal, AccentLine, PALETTE } from './motion'

const BASE_URL = import.meta.env.BASE_URL

const Missione = () => {
  return (
    <section className="bg-[#FDF07A] text-black py-20 relative overflow-hidden" style={{ marginTop: '-1px' }}>
      <GeometricField variant="on-yellow" density="low" seed={6} />
      <div className="container mx-auto px-6 relative z-10">
        <Reveal y={50} className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src={`${BASE_URL}imgs/automazione-amministrativa.webp`}
              alt="Automazione amministrativa aziendale"
              className="w-full h-auto"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Right - Text */}
          <div>
            <RevealText as="h2" className="text-5xl md:text-6xl font-black uppercase text-[#D03F29] mb-4">
              MISSIONE
            </RevealText>
            <AccentLine color={PALETTE.red} width={130} className="mb-6" />
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
        </Reveal>
      </div>
    </section>
  )
}

export default Missione
