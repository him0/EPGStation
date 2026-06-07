import { useVirtualizer } from '@tanstack/react-virtual'
import { Tv } from 'lucide-react'
import { useEffect, useRef, useState, type UIEvent } from 'react'

import type { Schedule, ScheduleProgramItem } from '@/api/generated/model'
import { ProgramCell } from './program-cell'
import { GUIDE_HOURS, HOUR_MS } from './time'
import type { ReserveType } from './use-reserve-map'

const ROW_HEIGHT = 64
const CHANNEL_WIDTH = 140
const CHANNEL_ICON_WIDTH = 52
const TIME_AXIS_HEIGHT = 36

type Props = {
  schedules: Schedule[]
  startAt: number
  pxPerHour: number
  isToday: boolean
  scrollNonce: number
  reserveMap: Map<number, ReserveType>
  onSelect: (program: ScheduleProgramItem, channelName: string) => void
}

export function GuideGrid({
  schedules,
  startAt,
  pxPerHour,
  isToday,
  scrollNonce,
  reserveMap,
  onSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // 横スクロール中は局カラムをアイコンのみの細い表示にする
  const [compactChannel, setCompactChannel] = useState(false)
  const channelWidth = compactChannel ? CHANNEL_ICON_WIDTH : CHANNEL_WIDTH

  const bodyWidth = GUIDE_HOURS * pxPerHour
  const rowsHeight = schedules.length * ROW_HEIGHT

  const rowVirtualizer = useVirtualizer({
    count: schedules.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  })

  const now = Date.now()
  const nowOffset = ((now - startAt) / HOUR_MS) * pxPerHour
  const showNowLine = isToday && nowOffset >= 0 && nowOffset <= bodyWidth

  useEffect(() => {
    if (!isToday) return
    const el = scrollRef.current
    if (!el) return
    // 現在時刻を左から 1 時間分の位置に置き、1時間前まで見えるようにする
    el.scrollLeft = Math.max(0, nowOffset - pxPerHour)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt, pxPerHour, isToday, scrollNonce])

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setCompactChannel(e.currentTarget.scrollLeft > 8)
  }

  const hours = Array.from({ length: GUIDE_HOURS }, (_, h) =>
    new Date(startAt + h * HOUR_MS).getHours(),
  )

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="bg-background relative h-full overflow-auto"
    >
      <div
        className="relative"
        style={{ width: channelWidth + bodyWidth, height: TIME_AXIS_HEIGHT + rowsHeight }}
      >
        {/* 時間軸ヘッダー(上固定) */}
        <div
          className="bg-background sticky top-0 z-40 flex border-b"
          style={{ height: TIME_AXIS_HEIGHT, width: channelWidth + bodyWidth }}
        >
          {/* コーナー(左上固定) */}
          <div
            className="bg-background sticky left-0 z-10 shrink-0 border-r transition-[width]"
            style={{ width: channelWidth }}
          />
          <div className="relative" style={{ width: bodyWidth }}>
            {hours.map((h, i) => (
              <div
                key={i}
                className="text-muted-foreground absolute top-0 flex h-full items-center border-l pl-1 text-xs tabular-nums"
                style={{ left: i * pxPerHour, width: pxPerHour }}
              >
                {h}時
              </div>
            ))}
          </div>
        </div>

        {/* ボディ行 */}
        <div className="flex" style={{ width: channelWidth + bodyWidth }}>
          {/* 放送局(左固定・縦仮想化) */}
          <div
            className="bg-background sticky left-0 z-30 shrink-0 border-r transition-[width]"
            style={{ width: channelWidth, height: rowsHeight }}
          >
            {rowVirtualizer.getVirtualItems().map(vr => {
              const ch = schedules[vr.index].channel
              return (
                <div
                  key={vr.key}
                  className="absolute right-0 left-0 flex items-center gap-2 overflow-hidden border-b px-2"
                  style={{ top: vr.start, height: ROW_HEIGHT }}
                >
                  {ch.hasLogoData ? (
                    <img
                      src={`/api/channels/${ch.id}/logo`}
                      alt={ch.name}
                      title={ch.name}
                      className="h-7 w-10 shrink-0 rounded object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      title={ch.name}
                      className="bg-muted text-muted-foreground flex h-7 w-10 shrink-0 items-center justify-center rounded"
                    >
                      <Tv className="size-4" />
                    </div>
                  )}
                  {!compactChannel && (
                    <span className="line-clamp-2 text-xs leading-tight font-semibold">
                      {ch.name}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* 番組トラック */}
          <div
            className="relative"
            style={{
              width: bodyWidth,
              height: rowsHeight,
              backgroundImage:
                'linear-gradient(to right, var(--border) 1px, transparent 1px)',
              backgroundSize: `${pxPerHour}px 100%`,
            }}
          >
            {showNowLine && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-red-500"
                style={{ left: nowOffset }}
              >
                <div className="absolute top-0 -left-1 size-2.5 rounded-full bg-red-500" />
              </div>
            )}

            {rowVirtualizer.getVirtualItems().map(vr => {
              const schedule = schedules[vr.index]
              return (
                <div
                  key={vr.key}
                  className="absolute right-0 left-0 border-b"
                  style={{ top: vr.start, height: ROW_HEIGHT }}
                >
                  {schedule.programs.map(program => {
                    const left = ((program.startAt - startAt) / HOUR_MS) * pxPerHour
                    const rawWidth = ((program.endAt - program.startAt) / HOUR_MS) * pxPerHour
                    if (left + rawWidth <= 0 || left >= bodyWidth) return null
                    const clampedLeft = Math.max(left, 0)
                    const width = Math.min(left + rawWidth, bodyWidth) - clampedLeft
                    return (
                      <ProgramCell
                        key={program.id}
                        program={program}
                        left={clampedLeft}
                        width={width}
                        reserve={reserveMap.get(program.id)}
                        onSelect={p => onSelect(p, schedule.channel.name)}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
