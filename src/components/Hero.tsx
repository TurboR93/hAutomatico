import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { services } from '../data/services'

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null)

  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Text 1: "RIVOLUZIONIAMO" - fades in immediately and stays
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])
  const text1Y = useTransform(scrollYProgress, [0, 0.1], [30, 0])

  // Text 2: "LA TECNOLOGIA" - fades in after text 1 and stays
  const text2Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
  const text2Y = useTransform(scrollYProgress, [0.2, 0.4], [30, 0])

  // Text 3: "AL TUO SERVIZIO" - fades in last and stays
  const text3Opacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])
  const text3Y = useTransform(scrollYProgress, [0.5, 0.7], [30, 0])

  // Background parallax and scale
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1.04])

  // Service images opacity based on scroll
  const img1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.5], [0, 0.6, 0.6, 0.3])
  const img2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55, 0.7], [0, 0.6, 0.6, 0.3])
  const img3Opacity = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.9], [0, 0.6, 0.6, 0.4])
  const img4Opacity = useTransform(scrollYProgress, [0.55, 0.7, 0.85, 1], [0, 0.5, 0.5, 0.5])

  // Random positions for service images
  const serviceImagePositions = [
    { left: '5%', top: '15%', size: 180, rotate: -12 },
    { right: '8%', top: '25%', size: 160, rotate: 8 },
    { left: '10%', bottom: '20%', size: 150, rotate: -5 },
    { right: '5%', bottom: '15%', size: 170, rotate: 10 },
  ]

  // Animated geometric shapes
  const shapes = [
    // Large hexagons
    { type: 'hexagon', x: 15, y: 20, size: 120, delay: 0, duration: 8 },
    { type: 'hexagon', x: 85, y: 15, size: 100, delay: 2, duration: 10 },
    { type: 'hexagon', x: 50, y: 80, size: 140, delay: 1, duration: 9 },
    // Circles
    { type: 'circle', x: 30, y: 60, size: 80, delay: 0.5, duration: 7 },
    { type: 'circle', x: 70, y: 40, size: 60, delay: 1.5, duration: 8 },
    { type: 'circle', x: 20, y: 85, size: 50, delay: 2.5, duration: 6 },
    { type: 'circle', x: 80, y: 75, size: 70, delay: 0, duration: 9 },
    // Triangles
    { type: 'triangle', x: 45, y: 25, size: 90, delay: 1, duration: 11 },
    { type: 'triangle', x: 60, y: 70, size: 70, delay: 2, duration: 8 },
    { type: 'triangle', x: 10, y: 50, size: 60, delay: 0.5, duration: 10 },
    // Squares (rotated)
    { type: 'square', x: 75, y: 25, size: 50, delay: 1.5, duration: 12 },
    { type: 'square', x: 25, y: 40, size: 40, delay: 0, duration: 9 },
    { type: 'square', x: 90, y: 55, size: 55, delay: 2, duration: 7 },
    // Small accent shapes
    { type: 'circle', x: 5, y: 30, size: 30, delay: 0, duration: 5 },
    { type: 'hexagon', x: 95, y: 90, size: 45, delay: 1, duration: 6 },
    { type: 'triangle', x: 35, y: 90, size: 35, delay: 2, duration: 7 },
  ]

  const renderShape = (shape: typeof shapes[0], index: number) => {
    const baseStyle = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: shape.size,
      height: shape.size,
    }

    const animationProps = {
      animate: {
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -10, 5, 0],
        rotate: [0, 5, -5, 3, 0],
        scale: [1, 1.05, 0.95, 1.02, 1],
      },
      transition: {
        duration: shape.duration,
        delay: shape.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }

    switch (shape.type) {
      case 'hexagon':
        return (
          <motion.div
            key={index}
            className="absolute"
            style={baseStyle}
            {...animationProps}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,2 95,25 95,75 50,98 5,75 5,25"
                fill="none"
                stroke="rgba(45, 45, 45, 0.6)"
                strokeWidth="1.5"
              />
              <polygon
                points="50,15 80,32 80,68 50,85 20,68 20,32"
                fill="rgba(30, 30, 30, 0.3)"
                stroke="rgba(80, 80, 80, 0.4)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        )
      case 'circle':
        return (
          <motion.div
            key={index}
            className="absolute"
            style={baseStyle}
            {...animationProps}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(50, 50, 50, 0.5)"
                strokeWidth="1.5"
                strokeDasharray="10 5"
              />
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="rgba(25, 25, 25, 0.25)"
                stroke="rgba(70, 70, 70, 0.3)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        )
      case 'triangle':
        return (
          <motion.div
            key={index}
            className="absolute"
            style={baseStyle}
            {...animationProps}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,5 95,90 5,90"
                fill="none"
                stroke="rgba(55, 55, 55, 0.5)"
                strokeWidth="1.5"
              />
              <polygon
                points="50,25 75,75 25,75"
                fill="rgba(35, 35, 35, 0.2)"
                stroke="rgba(75, 75, 75, 0.3)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        )
      case 'square':
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ ...baseStyle, transform: 'rotate(45deg)' }}
            {...animationProps}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect
                x="10"
                y="10"
                width="80"
                height="80"
                fill="none"
                stroke="rgba(60, 60, 60, 0.4)"
                strokeWidth="1.5"
              />
              <rect
                x="25"
                y="25"
                width="50"
                height="50"
                fill="rgba(40, 40, 40, 0.2)"
                stroke="rgba(80, 80, 80, 0.3)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <section
      ref={containerRef}
      className="bg-black relative"
      style={{ height: '280vh' }}
    >
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
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 30%, #1f1f1f 70%, #0f0f0f 100%)'
            }}
          />

          {/* Animated grid lines */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Geometric shapes */}
          <div className="absolute inset-0">
            {shapes.map((shape, index) => renderShape(shape, index))}
          </div>

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
                animate={{
                  y: [0, -15, 0, 10, 0],
                  x: [0, 8, -8, 5, 0],
                }}
                transition={{
                  duration: 8 + index * 2,
                  delay: index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
            animate={{
              x: [0, 50, -30, 20, 0],
              y: [0, -30, 40, -20, 0],
              scale: [1, 1.2, 0.9, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(80,80,80,0.25) 0%, transparent 70%)',
              right: '15%',
              bottom: '20%',
            }}
            animate={{
              x: [0, -40, 30, -15, 0],
              y: [0, 20, -35, 25, 0],
              scale: [1, 0.9, 1.15, 0.95, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${15 + ((i * 13) % 70)}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + (i % 3),
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Text Overlay Container - Stacked text lines */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none px-6">
          <div className="flex flex-col items-center gap-0">
            {/* Text 1: RIVOLUZIONIAMO */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#FDF07A] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] leading-tight text-center"
              style={{
                opacity: text1Opacity,
                y: text1Y,
              }}
            >
              RIVOLUZIONIAMO
            </motion.h1>

            {/* Text 2: LA TECNOLOGIA */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#FDF07A] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] leading-tight text-center"
              style={{
                opacity: text2Opacity,
                y: text2Y,
              }}
            >
              LA TECNOLOGIA
            </motion.h1>

            {/* Text 3: AL TUO SERVIZIO */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#FDF07A] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] leading-tight text-center"
              style={{
                opacity: text3Opacity,
                y: text3Y,
              }}
            >
              AL TUO SERVIZIO
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
      >
        <span className="text-sm font-medium text-[#FDF07A] uppercase tracking-widest">Scorri</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-[#FDF07A] flex items-start justify-center p-1"
          initial={{ opacity: 0.8 }}
        >
          <motion.div
            className="w-1.5 h-3 bg-[#FDF07A] rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Wavy irregular bottom border transitioning to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden" style={{ marginBottom: '-1px' }}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full"
          style={{ display: 'block' }}
        >
          <path
            d="M0,40 C100,80 200,10 350,50 C500,90 550,20 700,60 C850,100 950,30 1050,70 C1150,110 1200,40 1200,40 L1200,120 L0,120 Z"
            fill="#000000"
          />
          <path
            d="M0,60 C80,90 180,30 300,65 C420,100 520,40 650,75 C780,110 880,50 1000,80 C1120,110 1200,60 1200,60 L1200,120 L0,120 Z"
            fill="#000000"
            opacity="0.7"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero





