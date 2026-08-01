import type { ReactNode } from 'react'
import './Badge.css'

export type BadgeTone = 'red' | 'blue'

export type BadgeProps = {
  children: ReactNode
  /** Subtle colour treatment. Maps to the Figma `Property 1` variant. */
  tone?: BadgeTone
  className?: string
}

export function Badge({ children, tone = 'red', className }: BadgeProps) {
  return (
    <span
      className={['ds-badge', `ds-badge--${tone}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
