import type { Schedule, ScheduleProgramItem } from '@/api/generated/model'
import { Badge } from '@/components/ui/badge'
import { genreColor, genreName, primaryGenre } from '@/features/guide/genre'
import { formatHM } from '@/features/guide/time'

import { LiveThumbnail } from './live-thumbnail'

function progressRatio(p: ScheduleProgramItem, now: number): number {
  const span = p.endAt - p.startAt
  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (now - p.startAt) / span))
}

type Props = {
  schedule: Schedule
  now: number
  onSelect: (program: ScheduleProgramItem, channelName: string) => void
}

export function OnairCard({ schedule, now, onSelect }: Props) {
  const program = schedule.programs[0]
  const channel = schedule.channel
  if (typeof program === 'undefined') return null

  const genre = primaryGenre(program)
  const ratio = progressRatio(program, now)

  return (
    <div
      className="bg-card hover:border-primary/40 flex cursor-pointer flex-col overflow-hidden rounded-lg border transition-colors"
      onClick={() => onSelect(program, channel.name)}
    >
      <LiveThumbnail channelId={channel.id} genre={genre} />

      <div className="flex min-w-0 flex-col gap-1.5 p-3">
        <div className="flex min-w-0 items-center gap-2">
          {channel.hasLogoData && (
            <img
              src={`/api/channels/${channel.id}/logo`}
              alt=""
              className="h-4 w-7 shrink-0 object-contain"
            />
          )}
          <span className="text-muted-foreground truncate text-xs">{channel.name}</span>
        </div>

        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">{program.name}</h3>

        <div className="text-muted-foreground text-xs tabular-nums">
          {formatHM(program.startAt)} 〜 {formatHM(program.endAt)}
        </div>

        <div className="bg-secondary h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        {genre !== undefined && (
          <div>
            <Badge
              style={{ backgroundColor: genreColor(genre) }}
              className="text-[10px] text-white"
            >
              {genreName(genre)}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
