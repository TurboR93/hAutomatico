import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from './motionConfig'

interface RevealProps {
  children: ReactNode
  y?: number
  x?: number
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

/**
 * Standard "fade + slide in on scroll" wrapper. Replaces the
 * initial/whileInView/viewport block repeated across the site so reduced-motion
 * is handled in one place. Resolves to fully visible at rest (never stuck
 * hidden) when motion is reduced.
 */
const Reveal = ({
  children,
  y = 40,
  x = 0,
  delay = 0,
  duration = 0.7,
  once = true,
  className,
}: RevealProps) => {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
