import { AvatarStack, type AvatarItem } from '../Avatar/Avatar'
import { Badge, type BadgeTone } from '../Badge/Badge'
import './TaskCard.css'

export type TaskCardProps = {
  title: string
  /** Preformatted date label, e.g. "23 Dec, 2022". */
  date: string
  /** Machine-readable date for the `<time>` element, e.g. "2022-12-23". */
  dateTime?: string
  coverSrc: string
  coverAlt?: string
  members?: AvatarItem[]
  status?: string
  statusTone?: BadgeTone
  className?: string
}

export function TaskCard({
  title,
  date,
  dateTime,
  coverSrc,
  coverAlt = '',
  members = [],
  status,
  statusTone,
  className,
}: TaskCardProps) {
  const hasFooter = members.length > 0 || Boolean(status)

  return (
    <article className={['ds-task-card', className].filter(Boolean).join(' ')}>
      <img className="ds-task-card__cover" src={coverSrc} alt={coverAlt} />

      <div className="ds-task-card__body">
        <h3 className="ds-task-card__title">{title}</h3>
        <time className="ds-task-card__date" dateTime={dateTime}>
          {date}
        </time>
      </div>

      {hasFooter && (
        <div className="ds-task-card__footer">
          <AvatarStack items={members} label="Assignees" />
          {status && <Badge tone={statusTone}>{status}</Badge>}
        </div>
      )}
    </article>
  )
}
