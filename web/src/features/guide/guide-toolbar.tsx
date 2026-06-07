import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { addDays, formatDateLabel, todayStr, weekdayLabel } from './time'

export type GuideType = 'all' | 'GR' | 'BS' | 'CS' | 'SKY'

const types: { value: GuideType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'GR', label: 'GR' },
  { value: 'BS', label: 'BS' },
  { value: 'CS', label: 'CS' },
  { value: 'SKY', label: 'SKY' },
]

// 今日〜1週間後(8日分)の選択肢。トリガー/項目ともに短縮表記。
function dateOptions(): { value: string; label: string }[] {
  const today = todayStr()
  return Array.from({ length: 8 }, (_, i) => {
    const value = addDays(today, i)
    const label =
      i === 0
        ? `今日(${weekdayLabel(value)})`
        : i === 1
          ? `明日(${weekdayLabel(value)})`
          : formatDateLabel(value)
    return { value, label }
  })
}

type Props = {
  type: GuideType
  date: string
  onChangeType: (type: GuideType) => void
  onChangeDate: (date: string) => void
  onNow: () => void
}

export function GuideToolbar({ type, date, onChangeType, onChangeDate, onNow }: Props) {
  const options = dateOptions()

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

      <Button variant="outline" size="sm" onClick={onNow} className="shrink-0">
        放送中
      </Button>

      {/* 日付 */}
      <Select value={date} onValueChange={onChangeDate}>
        <SelectTrigger className="w-30 shrink-0 tabular-nums">
          <SelectValue placeholder="日付" />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value} className="tabular-nums">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
