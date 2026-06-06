import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from './motionConfig'

interface CounterProps {
  to: number
  from?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * Counts up to `to` once it scrolls into view. Writes to textContent on each
 * frame instead of re-rendering, so it stays smooth. Shows the final value
 * immediately when motion is reduced.
 */
const Counter = ({
  to,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`

    if (reduce) {
      node.textContent = format(to)
      return
    }
    if (!inView) return

    const controls = animate(from, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, to, from, duration, decimals, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {`${prefix}${from.toFixed(decimals)}${suffix}`}
    </span>
  )
}

export default Counter
