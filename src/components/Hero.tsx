import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { services } from '../data/services'
import WavyDivider from './WavyDivider'
import { GeometricField, DrawnPath } from './motion'

const BASE_URL = import.meta.env.BASE_URL

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Logo intro: starts fully visible, moves up and fades out
  const logoOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0])
  const logoY = useTransform(scrollYProgress, [0, 0.15], [0, -150])
  const logoScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8])

  // Text lines fade in sequentially as you scroll
  const text1Opacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1])
  const text1Y = useTransform(scrollYProgress, [0.12, 0.22], [30, 0])
  const text2Opacity = useTransform(scrollYProgress, [0.28, 0.42], [0, 1])
  const text2Y = useTransform(scrollYProgress, [0.28, 0.42], [30, 0])
  const text3Opacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1])
  const text3Y = useTransform(scrollYProgress, [0.5, 0.65], [30, 0])

  // Background parallax and scale
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1.04])

  // Service images opacity based on scroll (delayed to appear after logo transition)
  const img1Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.55], [0, 0.6, 0.6, 0.3])
  const img2Opacity = useTransform(scrollYProgress, [0.3, 0.42, 0.55, 0.7], [0, 0.6, 0.6, 0.3])
  const img3Opacity = useTransform(scrollYProgress, [0.48, 0.6, 0.75, 0.88], [0, 0.6, 0.6, 0.4])
  const img4Opacity = useTransform(scrollYProgress, [0.58, 0.7, 0.85, 1], [0, 0.5, 0.5, 0.5])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  // Random positions for service images
  const serviceImagePositions = [
    { left: '5%', top: '15%', size: 180, rotate: -12 },
    { right: '8%', top: '25%', size: 160, rotate: 8 },
    { left: '10%', bottom: '20%', size: 150, rotate: -5 },
    { right: '5%', bottom: '15%', size: 170, rotate: 10 },
  ]

  return (
    <section ref={containerRef} className="bg-black relative" style={{ height: '280vh' }}>
      {/* Single semantic H1 for SEO (the animated lines below are presentational) */}
      <h1 className="sr-only">
        hAutomatico — rivoluzioniamo la tecnologia al tuo servizio: software gestionali e
        automazione aziendale su misura
      </h1>

      {/* Fixed container that stays in view while scrolling, then releases */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Geometric Background - Full Width */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ scale: bgScale, y: bgY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Dark gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 30%, #1f1f1f 70%, #0f0f0f 100%)',
            }}
          />

          {/* Animated grid lines */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={reduce ? undefined : { backgroundPosition: ['0px 0px', '50px 50px'] }}
            transition={reduce ? undefined : { duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Geometric "quantum" field (palette-aware) */}
          <GeometricField variant="on-dark" density="high" seed={1} />

          {/* Service images appearing during scroll */}
          {services.slice(0, 4).map((service, index) => {
            const pos = serviceImagePositions[index]
            const opacityValues = [img1Opacity, img2Opacity, img3Opacity, img4Opacity]
            return (
              <motion.div
                key={service.id}
                className="absolute rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  ...pos,
                  width: pos.size,
                  height: pos.size,
                  opacity: opacityValues[index],
                  rotate: pos.rotate,
                }}
                animate={reduce ? undefined : { y: [0, -15, 0, 10, 0], x: [0, 8, -8, 5, 0] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 8 + index * 2, delay: index * 0.5, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Logo overlay on first image */}
                {index === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={`${BASE_URL}logohAutomatico.png`}
                      alt="hAutomatico Logo"
                      className="w-3/4 h-3/4 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* Glowing orbs */}
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(100,100,100,0.3) 0%, transparent 70%)',
              left: '20%',
              top: '30%',
            }}
            animate={reduce ? undefined : { x: [0, 50, -30, 20, 0], y: [0, -30, 40, -20, 0], scale: [1, 1.2, 0.9, 1.1, 1] }}
            transition={reduce ? undefined : { duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(80,80,80,0.25) 0%, transparent 70%)',
              right: '15%',
              bottom: '20%',
            }}
            animate={reduce ? undefined : { x: [0, -40, 30, -15, 0], y: [0, 20, -35, 25, 0], scale: [1, 0.9, 1.15, 0.95, 1] }}
            transition={reduce ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* Floating particles */}
          {!reduce &&
            [...Array(10)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{ left: `${10 + i * 8}%`, top: `${15 + ((i * 13) % 70)}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 3 + (i % 3), delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
        </motion.div>

        {/* Logo Intro - First thing visible, scrolls up and fades */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ opacity: logoOpacity, y: logoY, scale: logoScale }}
        >
          <div className="relative w-[105vw] max-w-3xl h-[105vw] max-h-[80vh] flex items-center justify-center">
            {/* Drawn quantum rings behind the logo */}
            <DrawnPath
              d="M50,3 A47,47 0 1 1 49.9,3"
              viewBox="0 0 100 100"
              stroke="rgba(253, 240, 122, 0.30)"
              strokeWidth={0.4}
              duration={2.2}
              className="absolute h-[112%] w-[112%]"
            />
            <DrawnPath
              d="M50,12 A38,38 0 1 1 49.9,12"
              viewBox="0 0 100 100"
              stroke="rgba(208, 63, 41, 0.30)"
              strokeWidth={0.5}
              duration={1.8}
              delay={0.2}
              className="absolute h-[92%] w-[92%]"
            />
            <img
              src={`${BASE_URL}logohAutomatico.png`}
              alt="hAutomatico Logo"
              className="relative w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.1)' }}
            />
          </div>
        </motion.div>

        {/* Text Overlay Container - Stacked text lines */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none px-6">
          <div className="flex flex-col items-center gap-0">
            <motion.p
              aria-hidden="true"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#FDF07A] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] leading-tight text-center"
              style={{ opacity: text1Opacity, y: text1Y }}
            >
              RIVOLUZIONIAMO
            </motion.p>
            <motion.p
              aria-hidden="true"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#FDF07A] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] leading-tight text-center"
              style={{ opacity: text2Opacity, y: text2Y }}
            >
              LA TECNOLOGIA
            </motion.p>
            <motion.p
              aria-hidden="true"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#FDF07A] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] leading-tight text-center"
              style={{ opacity: text3Opacity, y: text3Y }}
            >
              AL TUO SERVIZIO
            </motion.p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: scrollHintOpacity }}
      >
        <span className="text-sm font-medium text-[#FDF07A] uppercase tracking-widest">Scorri</span>
        <div className="w-6 h-10 rounded-full border-2 border-[#FDF07A] flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-3 bg-[#FDF07A] rounded-full"
            animate={reduce ? undefined : { y: [0, 12, 0] }}
            transition={reduce ? undefined : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Wavy irregular bottom border transitioning to next section */}
      <WavyDivider orientation="bottom" fromColor="#000000" toColor="#000000" />
    </section>
  )
}

export default Hero
