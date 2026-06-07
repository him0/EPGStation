import type { ScheduleProgramItem } from '@/api/generated/model'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { genreColor, genreName, primaryGenre } from './genre'
import { formatRange } from './time'
import type { ReserveType } from './use-reserve-map'

export type SelectedProgram = {
  program: ScheduleProgramItem
  channelName: string
  reserve?: ReserveType
}

const reserveLabel: Record<ReserveType, string> = {
  reserve: '予約済み',
  conflict: '競合',
  skip: '除外',
  overlap: '重複',
}

type Props = {
  selected: SelectedProgram | null
  onClose: () => void
}

export function ProgramDetailSheet({ selected, onClose }: Props) {
  const program = selected?.program
  const genre = program ? primaryGenre(program) : undefined

  return (
    <Sheet open={selected !== null} onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {selected && program && (
          <>
            <SheetHeader>
              <div className="text-muted-foreground text-sm">{selected.channelName}</div>
              <SheetTitle className="text-lg">{program.name}</SheetTitle>
              <SheetDescription className="tabular-nums">
                {formatRange(program.startAt, program.endAt)}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {genre !== undefined && (
                  <Badge
                    style={{ backgroundColor: genreColor(genre) }}
                    className="text-white"
                  >
                    {genreName(genre)}
                  </Badge>
                )}
                {program.isFree === false && <Badge variant="secondary">有料</Badge>}
                {selected.reserve && (
                  <Badge variant="outline">{reserveLabel[selected.reserve]}</Badge>
                )}
              </div>

              {program.description && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {program.description}
                </p>
              )}
              {program.extended && (
                <p className="text-muted-foreground border-t pt-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {program.extended}
                </p>
              )}
            </div>

            <SheetFooter>
              <Button disabled title="次フェーズで実装予定">
                予約する(準備中)
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
