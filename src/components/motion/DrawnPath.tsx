import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { EASE } from './motionConfig'

interface DrawnPathProps {
  d: string
  viewBox?: string
  stroke?: string
  strokeWidth?: number
  fill?: string
  className?: string
  style?: CSSProperties
  duration?: number
  delay?: number
  once?: boolean
}

/**
 * An SVG path that "draws itself" on scroll-into-view via Framer Motion's
 * pathLength. The signature digitalthinker-style stroke animation.
 */
export const DrawnPath = ({
  d,
  viewBox = '0 0 100 100',
  stroke = 'currentColor',
  strokeWidth = 1.5,
  fill = 'none',
  className,
  style,
  duration = 1.4,
  delay = 0,
  once = true,
}: DrawnPathProps) => {
  const reduce = useReducedMotion()
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
        initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once }}
        transition={{
          pathLength: { duration, ease: EASE, delay },
          opacity: { duration: 0.25, delay },
        }}
      />
    </svg>
  )
}

interface AccentLineProps {
  color?: string
  width?: number
  delay?: number
  className?: string
}

/**
 * The short "tratto" that draws in underneath a heading. Slightly irregular
 * so it reads as a confident hand stroke rather than a flat rule.
 */
export const AccentLine = ({
  color = '#D03F29',
  width = 104,
  delay = 0.1,
  className = '',
}: AccentLineProps) => (
  <span className={`block ${className}`} style={{ width }} aria-hidden="true">
    <DrawnPath
      d="M2,10 C26,3 50,16 74,7 C84,3.5 92,8 98,6"
      viewBox="0 0 100 16"
      stroke={color}
      strokeWidth={3.5}
      duration={0.9}
      delay={delay}
      className="block w-full h-auto"
    />
  </span>
)

export default DrawnPath
