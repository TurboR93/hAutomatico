import { motion, useReducedMotion } from 'framer-motion'

interface WavyDividerProps {
  fromColor: string
  toColor: string
  /** 'top' = sits at the start of the next section (default, like Services/Footer).
   *  'bottom' = absolutely pinned to the bottom of the current (relative) section. */
  orientation?: 'top' | 'bottom'
  /** Gently "breathe" the back wave layer. */
  animate?: boolean
  /** Trace a thin stroke along the wave crest that draws in on scroll. */
  drawCrest?: boolean
  crestColor?: string
  className?: string
}

// Canonical wave shapes (viewBox 0 0 1440 120), kept as constants so every
// divider on the site shares the exact same "sagomato" silhouette.
const PATHS = {
  top: {
    front:
      'M0,80 C120,95 240,40 360,60 C480,80 600,30 720,55 C840,80 960,35 1080,58 C1200,80 1320,45 1440,65 L1440,0 L0,0 Z',
    back:
      'M0,50 C180,75 300,25 480,45 C660,65 780,20 960,40 C1140,60 1300,30 1440,50 L1440,0 L0,0 Z',
    crest:
      'M0,80 C120,95 240,40 360,60 C480,80 600,30 720,55 C840,80 960,35 1080,58 C1200,80 1320,45 1440,65',
  },
  bottom: {
    front:
      'M0,40 C120,25 240,80 360,60 C480,40 600,90 720,65 C840,40 960,85 1080,62 C1200,40 1320,75 1440,55 L1440,120 L0,120 Z',
    back:
      'M0,70 C180,45 300,95 480,75 C660,55 780,100 960,80 C1140,60 1300,90 1440,70 L1440,120 L0,120 Z',
    crest:
      'M0,40 C120,25 240,80 360,60 C480,40 600,90 720,65 C840,40 960,85 1080,62 C1200,40 1320,75 1440,55',
  },
} as const

const WavyDivider = ({
  fromColor,
  toColor,
  orientation = 'top',
  animate = false,
  drawCrest = false,
  crestColor = 'rgba(208, 63, 41, 0.45)',
  className = '',
}: WavyDividerProps) => {
  const reduce = useReducedMotion()
  const paths = PATHS[orientation]
  // Top: the painted wave is the *previous* section color over the next-section
  // background. Bottom: the wave is the *next* section color, overlaying the
  // current section (no background).
  const waveFill = orientation === 'top' ? fromColor : toColor

  const isTop = orientation === 'top'
  const containerClass = isTop
    ? `relative w-full overflow-hidden ${className}`
    : `absolute bottom-0 left-0 right-0 overflow-hidden ${className}`
  const containerStyle = isTop
    ? { height: '120px', marginTop: '-1px', backgroundColor: toColor }
    : { height: '120px', marginBottom: '-1px' }
  const svgClass = isTop
    ? 'absolute top-0 left-0 w-full'
    : 'absolute bottom-0 left-0 w-full h-full'

  return (
    <div className={containerClass} style={containerStyle}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={svgClass}
        style={{ display: 'block', height: isTop ? '100%' : undefined }}
        aria-hidden="true"
      >
        <path d={paths.front} fill={waveFill} />
        <motion.path
          d={paths.back}
          fill={waveFill}
          initial={{ opacity: 0.6 }}
          animate={animate && !reduce ? { opacity: [0.45, 0.7, 0.45] } : undefined}
          transition={animate && !reduce ? { duration: 9, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        {drawCrest && (
          <motion.path
            d={paths.crest}
            fill="none"
            stroke={crestColor}
            strokeWidth={2}
            strokeLinecap="round"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </svg>
    </div>
  )
}

export default WavyDivider
