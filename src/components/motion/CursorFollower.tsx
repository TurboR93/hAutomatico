import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label'

/**
 * Subtle custom cursor: a precise dot plus a softly trailing ring that grows
 * over interactive elements. Desktop / fine-pointer only and disabled under
 * reduced motion. The native cursor is intentionally left visible.
 */
const CursorFollower = () => {
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery('(pointer: fine)')
  const enabled = !reduce && finePointer

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 })

  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const move = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      setHovering(!!target?.closest(INTERACTIVE))
    }
    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.removeEventListener('mouseleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D03F29]"
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            opacity: visible ? (hovering ? 0.9 : 0.5) : 0,
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 22 }}
        />
      </motion.div>

      {/* Precise dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x, y }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D03F29]"
          animate={{ width: hovering ? 5 : 7, height: hovering ? 5 : 7, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  )
}

export default CursorFollower
