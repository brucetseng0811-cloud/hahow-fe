export type IconProps = {
  /** Symbol id inside `public/icons.svg`, e.g. "github-icon". */
  name: string
  className?: string
}

/** Decorative sprite icon. Always hidden from assistive tech. */
export function Icon({ name, className }: IconProps) {
  return (
    <svg className={className} role="presentation" aria-hidden="true">
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}
