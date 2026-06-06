import { motion, useReducedMotion } from 'framer-motion'

interface MarqueeProps {
  items: string[]
  /** Seconds for one full loop. */
  speed?: number
  direction?: 'left' | 'right'
  className?: string
  /** Tailwind classes for each item (color/size). */
  itemClassName?: string
  separatorColor?: string
}

/**
 * Infinite horizontal keyword strip. Uses a small diamond/plus separator to
 * echo the geometric language. Falls back to a static, scrollable row when
 * motion is reduced.
 */
const Marquee = ({
  items,
  speed = 28,
  direction = 'left',
  className = '',
  itemClassName = '',
  separatorColor = 'currentColor',
}: MarqueeProps) => {
  const reduce = useReducedMotion()
  const sequence = [...items, ...items]

  const Item = ({ label, k }: { label: string; k: number }) => (
    <span key={k} className="flex shrink-0 items-center">
      <span className={`whitespace-nowrap ${itemClassName}`}>{label}</span>
      <svg
        viewBox="0 0 10 10"
        className="mx-6 h-2 w-2 shrink-0"
        aria-hidden="true"
        style={{ color: separatorColor }}
      >
        <path d="M5,0 L10,5 L5,10 L0,5 Z" fill="currentColor" />
      </svg>
    </span>
  )

  if (reduce) {
    return (
      <div className={`flex gap-2 overflow-x-auto ${className}`}>
        {items.map((label, i) => (
          <Item key={i} label={label} k={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="flex w-max"
        style={{ willChange: 'transform' }}
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {sequence.map((label, i) => (
          <Item key={i} label={label} k={i} />
        ))}
      </motion.div>
    </div>
  )
}

export default Marquee
