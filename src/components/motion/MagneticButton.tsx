import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'

interface MagneticButtonProps {
  children: ReactNode
  strength?: number
  className?: string
}

/**
 * Wraps any interactive element and makes it gently follow the pointer on
 * hover. The wrapper handles the motion, so the child can stay an <a>, a
 * router <Link>, or a <button> unchanged. No-op on touch / reduced motion.
 */
const MagneticButton = ({ children, strength = 0.3, className = '' }: MagneticButtonProps) => {
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery('(pointer: fine)')
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 })
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 })

  const enabled = !reduce && finePointer

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  if (!enabled) {
    return <span className={`inline-block ${className}`}>{children}</span>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default MagneticButton
