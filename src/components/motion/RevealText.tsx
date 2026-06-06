import type { ElementType } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { EASE } from './motionConfig'

interface RevealTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  className?: string
  splitBy?: 'line' | 'word'
  stagger?: number
  delay?: number
  duration?: number
  once?: boolean
}

/**
 * Heading / text reveal where each line (or word) rises from behind a clip
 * mask. Transform-only, so it stays cheap. Forwards `className` verbatim so the
 * caller's Tailwind type classes (size, weight, drop-shadow) are preserved.
 *
 * Use "\n" inside `children` to control where the lines break.
 */
const RevealText = ({
  children,
  as = 'h2',
  className = '',
  splitBy = 'line',
  stagger = 0.12,
  delay = 0,
  duration = 0.8,
  once = true,
}: RevealTextProps) => {
  const reduce = useReducedMotion()
  const Tag = (reduce ? as : (motion[as] as ElementType)) as ElementType

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  const lines = children.split('\n')

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const child: Variants = {
    hidden: { y: '115%' },
    show: { y: 0, transition: { duration, ease: EASE } },
  }

  return (
    <Tag className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once }}>
      {lines.map((line, li) =>
        splitBy === 'word' ? (
          <span key={li} className="block">
            {line.split(' ').map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden align-bottom">
                <motion.span variants={child} className="mr-[0.28em] inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        ) : (
          <span key={li} className="block overflow-hidden">
            <motion.span variants={child} className="block">
              {line}
            </motion.span>
          </span>
        )
      )}
    </Tag>
  )
}

export default RevealText
