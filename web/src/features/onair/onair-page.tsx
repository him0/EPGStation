import { useState } from 'react'

import { useGetSchedulesBroadcasting } from '@/api/generated/endpoints'
import type { ScheduleProgramItem } from '@/api/generated/model'
import type { GuideType } from '@/features/guide/guide-toolbar'
import {
  ProgramDetailSheet,
  type SelectedProgram,
} from '@/features/guide/program-detail-sheet'
import { isAudioVideoService } from '@/features/guide/time'

import { OnairCard } from './onair-card'
import { OnairToolbar } from './onair-toolbar'
import { useNow } from './use-now'

type Props = {
  type: GuideType
  onChangeType: (type: GuideType) => void
}

export function OnairPage({ type, onChangeType }: Props) {
  const [selected, setSelected] = useState<SelectedProgram | null>(null)

  const query = useGetSchedulesBroadcasting(
    { isHalfWidth: true },
    { query: { refetchInterval: 60 * 1000 } },
  )

  const now = useNow()

  const schedules =
    query.data?.status === 200
      ? query.data.data
          .filter(s => isAudioVideoService(s.channel.type))
          .filter(s => type === 'all' || s.channel.channelType === type)
      : []

  const handleSelect = (program: ScheduleProgramItem, channelName: string) => {
    setSelected({ program, channelName })
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
      <OnairToolbar
        type={type}
        onChangeType={onChangeType}
        onRefresh={() => query.refetch()}
        isFetching={query.isFetching}
      />

      <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
        {query.isLoading ? (
          <div className="text-muted-foreground p-6 text-sm">読み込み中...</div>
        ) : query.isError ? (
          <div className="text-destructive p-6 text-sm">放映中の番組取得に失敗しました</div>
        ) : schedules.length === 0 ? (
          <div className="text-muted-foreground p-6 text-sm">放映中の番組がありません</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3 xl:grid-cols-4">
            {schedules.map(s => (
              <OnairCard
                key={s.channel.id}
                schedule={s}
                now={now}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>

      <ProgramDetailSheet selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
