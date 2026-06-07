import { createFileRoute } from '@tanstack/react-router'

import type { GuideType } from '@/features/guide/guide-toolbar'
import { OnairPage } from '@/features/onair/onair-page'

type OnairSearch = {
  type: GuideType
}

const validTypes: GuideType[] = ['all', 'GR', 'BS', 'CS', 'SKY']

export const Route = createFileRoute('/onair')({
  validateSearch: (search: Record<string, unknown>): OnairSearch => {
    const type = search.type
    return {
      type: validTypes.includes(type as GuideType) ? (type as GuideType) : 'all',
    }
  },
  component: OnairRoute,
})

function OnairRoute() {
  const { type } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <OnairPage
      type={type}
      onChangeType={t => navigate({ search: prev => ({ ...prev, type: t }) })}
    />
  )
}
