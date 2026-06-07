import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { GuideType } from '@/features/guide/guide-toolbar'
import { cn } from '@/lib/utils'

const types: { value: GuideType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'GR', label: 'GR' },
  { value: 'BS', label: 'BS' },
  { value: 'CS', label: 'CS' },
  { value: 'SKY', label: 'SKY' },
]

type Props = {
  type: GuideType
  onChangeType: (type: GuideType) => void
  onRefresh: () => void
  isFetching: boolean
}

export function OnairToolbar({ type, onChangeType, onRefresh, isFetching }: Props) {
  return (
    <div className="flex w-full min-w-0 shrink-0 flex-nowrap items-center gap-2 overflow-x-auto border-b px-3 py-2 sm:gap-3 sm:px-4">
      <SidebarTrigger className="shrink-0" />

      <Select value={type} onValueChange={v => onChangeType(v as GuideType)}>
        <SelectTrigger className="w-24 shrink-0">
          <SelectValue placeholder="放送波" />
        </SelectTrigger>
        <SelectContent>
          {types.map(t => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isFetching}
        className="shrink-0"
      >
        <RefreshCw className={cn('size-4', isFetching && 'animate-spin')} />
        更新
      </Button>
    </div>
  )
}
