import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { STROKE, type Variant } from './motionConfig'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type ShapeType =
  | 'circle'
  | 'ring'
  | 'concentric'
  | 'plus'
  | 'hexagon'
  | 'triangle'
  | 'arc'
  | 'dot'

type ColorRole = 'line' | 'faint' | 'accent' | 'dot'

interface ShapeDef {
  type: ShapeType
  x: number // %
  y: number // %
  size: number // px
  depth: 0 | 1 | 2 // parallax layer
  dur: number // float / spin duration (s)
  delay: number
  color: ColorRole
  spin?: boolean // continuous rotation (rings, hexagons)
}

/**
 * A curated set of simple outlined "quanta". Ordered roughly by prominence so
 * lower densities keep the strongest pieces. `seed` rotates the starting index
 * so different sections show a different slice and never look identical.
 */
const SHAPES: ShapeDef[] = [
  { type: 'ring', x: 8, y: 22, size: 120, depth: 1, dur: 26, delay: 0, color: 'line', spin: true },
  { type: 'plus', x: 90, y: 16, size: 26, depth: 2, dur: 9, delay: 0.5, color: 'accent' },
  { type: 'concentric', x: 82, y: 70, size: 96, depth: 0, dur: 30, delay: 1, color: 'line', spin: true },
  { type: 'dot', x: 20, y: 78, size: 12, depth: 2, dur: 7, delay: 0.2, color: 'dot' },
  { type: 'hexagon', x: 70, y: 30, size: 72, depth: 1, dur: 22, delay: 0.8, color: 'faint', spin: true },
  { type: 'arc', x: 12, y: 55, size: 88, depth: 0, dur: 11, delay: 0.4, color: 'line' },
  { type: 'circle', x: 50, y: 12, size: 40, depth: 2, dur: 10, delay: 1.2, color: 'faint' },
  { type: 'triangle', x: 38, y: 84, size: 60, depth: 1, dur: 13, delay: 0.6, color: 'line', spin: true },
  { type: 'plus', x: 30, y: 38, size: 18, depth: 2, dur: 8, delay: 0.9, color: 'dot' },
  { type: 'dot', x: 94, y: 46, size: 8, depth: 2, dur: 6, delay: 0.3, color: 'accent' },
  { type: 'ring', x: 58, y: 64, size: 54, depth: 1, dur: 24, delay: 0.1, color: 'faint', spin: true },
  { type: 'circle', x: 4, y: 88, size: 30, depth: 0, dur: 12, delay: 1.4, color: 'faint' },
  { type: 'arc', x: 76, y: 90, size: 70, depth: 1, dur: 14, delay: 0.7, color: 'faint' },
  { type: 'dot', x: 46, y: 50, size: 6, depth: 2, dur: 5, delay: 0, color: 'dot' },
]

const DENSITY_COUNT: Record<NonNullable<GeometricFieldProps['density']>, number> = {
  low: 5,
  medium: 9,
  high: 14,
}

interface GeometricFieldProps {
  variant: Variant
  density?: 'low' | 'medium' | 'high'
  parallax?: boolean
  /** Reuse an existing scroll progress (e.g. a section that already calls useScroll). */
  progress?: MotionValue<number>
  seed?: number
  className?: string
}

const renderShapeSvg = (shape: ShapeDef, color: string) => {
  const common = { stroke: color, strokeWidth: 1.5, fill: 'none' as const }
  switch (shape.type) {
    case 'circle':
      return <circle cx={50} cy={50} r={46} {...common} />
    case 'ring':
      return <circle cx={50} cy={50} r={46} {...common} strokeDasharray="4 7" />
    case 'concentric':
      return (
        <>
          <circle cx={50} cy={50} r={46} {...common} />
          <circle cx={50} cy={50} r={28} {...common} strokeDasharray="3 6" />
        </>
      )
    case 'plus':
      return <path d="M50,6 V94 M6,50 H94" {...common} strokeWidth={2.5} strokeLinecap="round" />
    case 'hexagon':
      return <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" {...common} />
    case 'triangle':
      return <polygon points="50,8 92,88 8,88" {...common} />
    case 'arc':
      return <path d="M6,72 A48,48 0 0 1 94,72" {...common} strokeLinecap="round" />
    case 'dot':
      return <circle cx={50} cy={50} r={42} fill={color} />
    default:
      return null
  }
}

/**
 * Decorative, non-interactive layer of slowly drifting / rotating geometric
 * "quanta". Pure transform/opacity animation; honors reduced motion and thins
 * out on small screens.
 */
const GeometricField = ({
  variant,
  density = 'medium',
  parallax = false,
  progress,
  seed = 0,
  className = '',
}: GeometricFieldProps) => {
  const reduce = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const ref = useRef<HTMLDivElement>(null)

  // Always call hooks; only the *use* of the result is conditional.
  const internal = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const source = progress ?? internal.scrollYProgress
  const layer0 = useTransform(source, [0, 1], [30, -30])
  const layer1 = useTransform(source, [0, 1], [60, -60])
  const layer2 = useTransform(source, [0, 1], [90, -90])
  const layers = [layer0, layer1, layer2]

  const colors = STROKE[variant]
  const effectiveDensity = isMobile ? 'low' : density
  const count = DENSITY_COUNT[effectiveDensity]
  const shapes = Array.from({ length: count }, (_, i) => SHAPES[(i + seed) % SHAPES.length])
  const useParallax = parallax && !reduce && !isMobile

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {shapes.map((shape, i) => {
        const color = colors[shape.color]
        // Center on the (x, y) point via negative margins rather than a CSS
        // translate, so it composes with Framer Motion's transform (parallax y).
        const base = {
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: shape.size,
          height: shape.size,
          marginLeft: -shape.size / 2,
          marginTop: -shape.size / 2,
        }

        const svg = (
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            {renderShapeSvg(shape, color)}
          </svg>
        )

        // Reduced motion / mobile-static: render still shapes.
        if (reduce) {
          return (
            <div key={i} className="absolute" style={base}>
              {svg}
            </div>
          )
        }

        const floatAnim = shape.spin
          ? { rotate: [0, 360], y: [0, -10, 0] }
          : { y: [0, -16, 0, 12, 0], x: [0, 9, -7, 4, 0], rotate: [0, 5, -4, 0] }

        const inner = (
          <motion.div
            className="h-full w-full"
            style={{ willChange: 'transform' }}
            animate={floatAnim}
            transition={{
              duration: shape.dur,
              delay: shape.delay,
              repeat: Infinity,
              ease: shape.spin ? 'linear' : 'easeInOut',
            }}
          >
            {svg}
          </motion.div>
        )

        return (
          <motion.div
            key={i}
            className="absolute"
            style={useParallax ? { ...base, y: layers[shape.depth] } : base}
          >
            {inner}
          </motion.div>
        )
      })}
    </div>
  )
}

export default GeometricField
