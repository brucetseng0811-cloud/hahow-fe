import './Avatar.css'

export type AvatarPlaceholderTone = 'blue' | 'red'

export type AvatarItem =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'placeholder'; initials: string; tone?: AvatarPlaceholderTone }

export type AvatarProps = {
  item: AvatarItem
  className?: string
}

export function Avatar({ item, className }: AvatarProps) {
  if (item.type === 'image') {
    return (
      <span className={['ds-avatar', className].filter(Boolean).join(' ')}>
        <img src={item.src} alt={item.alt ?? ''} />
      </span>
    )
  }

  const tone = item.tone ?? 'blue'

  return (
    <span
      className={[
        'ds-avatar',
        'ds-avatar--placeholder',
        `ds-avatar--${tone}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!item.initials || undefined}
    >
      {item.initials}
    </span>
  )
}

export type AvatarStackProps = {
  items: AvatarItem[]
  /** Accessible name for the group, e.g. "Assignees". */
  label?: string
  className?: string
}

export function AvatarStack({ items, label, className }: AvatarStackProps) {
  return (
    <span
      className={['ds-avatar-stack', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    >
      {items.map((item, index) => (
        // Positional keys: the stack is a fixed, ordered list and the same
        // person/image may legitimately appear twice.
        <Avatar key={index} item={item} />
      ))}
    </span>
  )
}
