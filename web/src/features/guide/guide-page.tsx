import { useState } from 'react'

import { useGetSchedules } from '@/api/generated/endpoints'
import type { ScheduleProgramItem } from '@/api/generated/model'
import { GuideGrid } from './guide-grid'
import { GuideToolbar, type GuideType } from './guide-toolbar'
import { ProgramDetailSheet, type SelectedProgram } from './program-detail-sheet'
import { getGuideRange, isAudioVideoService, todayStr } from './time'
import { useReserveMap } from './use-reserve-map'

// 表示倍率(px/時)は固定
const PX_PER_HOUR = 260

type Props = {
  type: GuideType
  date: string
  onChangeType: (type: GuideType) => void
  onChangeDate: (date: string) => void
}

export function GuidePage({ type, date, onChangeType, onChangeDate }: Props) {
  const [scrollNonce, setScrollNonce] = useState(0)
  const [selected, setSelected] = useState<SelectedProgram | null>(null)

  const { startAt, endAt } = getGuideRange(date)
  const isToday = date === todayStr()

  const schedulesQuery = useGetSchedules({
    startAt,
    endAt,
    isHalfWidth: true,
    GR: type === 'all' || type === 'GR',
    BS: type === 'all' || type === 'BS',
    CS: type === 'all' || type === 'CS',
    SKY: type === 'all' || type === 'SKY',
  })

  const reserveMap = useReserveMap(startAt, endAt)

  const schedules =
    schedulesQuery.data?.status === 200
      ? schedulesQuery.data.data.filter(s => isAudioVideoService(s.channel.type))
      : []

  const handleNow = () => {
    if (!isToday) onChangeDate(todayStr())
    setScrollNonce(n => n + 1)
  }

  const handleSelect = (program: ScheduleProgramItem, channelName: string) => {
    setSelected({ program, channelName, reserve: reserveMap.get(program.id) })
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
      <GuideToolbar
        type={type}
        date={date}
        onChangeType={onChangeType}
        onChangeDate={onChangeDate}
        onNow={handleNow}
      />

      <div className="min-h-0 w-full min-w-0 flex-1">
        {schedulesQuery.isLoading ? (
          <div className="text-muted-foreground p-6 text-sm">読み込み中...</div>
        ) : schedulesQuery.isError ? (
          <div className="text-destructive p-6 text-sm">番組表の取得に失敗しました</div>
        ) : schedules.length === 0 ? (
          <div className="text-muted-foreground p-6 text-sm">番組情報がありません</div>
        ) : (
          <GuideGrid
            schedules={schedules}
            startAt={startAt}
            pxPerHour={PX_PER_HOUR}
            isToday={isToday}
            scrollNonce={scrollNonce}
            reserveMap={reserveMap}
            onSelect={handleSelect}
          />
        )}
      </div>

      <ProgramDetailSheet selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
