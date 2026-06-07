import { createFileRoute } from '@tanstack/react-router'

import { GuidePage } from '@/features/guide/guide-page'
import type { GuideType } from '@/features/guide/guide-toolbar'
import { todayStr } from '@/features/guide/time'

type GuideSearch = {
  type: GuideType
  date: string
}

const validTypes: GuideType[] = ['all', 'GR', 'BS', 'CS', 'SKY']

export const Route = createFileRoute('/guide')({
  validateSearch: (search: Record<string, unknown>): GuideSearch => {
    const type = search.type
    const date = search.date
    return {
      type: validTypes.includes(type as GuideType) ? (type as GuideType) : 'all',
      date:
        typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayStr(),
    }
  },
  component: GuideRoute,
})

function GuideRoute() {
  const { type, date } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <GuidePage
      type={type}
      date={date}
      onChangeType={t => navigate({ search: prev => ({ ...prev, type: t }) })}
      onChangeDate={d => navigate({ search: prev => ({ ...prev, date: d }) })}
    />
  )
}
