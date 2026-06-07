import { CircleDot, CircleOff, TriangleAlert } from 'lucide-react'

import type { ScheduleProgramItem } from '@/api/generated/model'
import { cn } from '@/lib/utils'
import { genreColor, hexAlpha, primaryGenre } from './genre'
import { formatHM } from './time'
import type { ReserveType } from './use-reserve-map'

type Props = {
  program: ScheduleProgramItem
  left: number
  width: number
  reserve?: ReserveType
  onSelect: (program: ScheduleProgramItem) => void
}

const reserveRing: Record<ReserveType, string> = {
  reserve: 'ring-2 ring-red-500',
  conflict: 'ring-2 ring-amber-500',
  skip: '',
  overlap: '',
}

function ReserveBadge({ type }: { type: ReserveType }) {
  if (type === 'reserve')
    return <CircleDot className="size-3.5 shrink-0 text-red-500" aria-label="予約" />
  if (type === 'conflict')
    return <TriangleAlert className="size-3.5 shrink-0 text-amber-500" aria-label="競合" />
  if (type === 'skip' || type === 'overlap')
    return <CircleOff className="text-muted-foreground size-3.5 shrink-0" aria-label="除外" />
  return null
}

export function ProgramCell({ program, left, width, reserve, onSelect }: Props) {
  const genre = primaryGenre(program)
  const color = genreColor(genre)
  const dimmed = reserve === 'skip' || reserve === 'overlap'

  return (
    <button
      type="button"
      onClick={() => onSelect(program)}
      style={{
        left,
        width: Math.max(width, 2),
        backgroundColor: hexAlpha(color, 0.1),
        borderLeftColor: color,
      }}
      className={cn(
        'absolute top-0 z-10 flex h-full flex-col overflow-hidden border border-l-4 border-border/60 px-1.5 py-1 text-left transition-colors',
        'hover:bg-accent hover:z-20 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-ring',
        reserve && reserveRing[reserve],
        dimmed && 'opacity-55',
      )}
    >
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
          {formatHM(program.startAt)}
        </span>
        {reserve && <ReserveBadge type={reserve} />}
      </div>
      <div
        className={cn(
          'mt-0.5 line-clamp-2 text-[11px] leading-tight font-semibold',
          reserve === 'overlap' && 'line-through',
        )}
      >
        {program.name}
      </div>
      {width > 140 && program.description && (
        <div className="text-muted-foreground mt-0.5 line-clamp-2 text-[10px] leading-tight">
          {program.description}
        </div>
      )}
    </button>
  )
}
