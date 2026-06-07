import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

const labels = {
  normal: '予約',
  conflict: '競合',
  overlap: '重複',
} as const

type ReserveType = keyof typeof labels

export const Route = createFileRoute('/reserves')({
  validateSearch: (search: Record<string, unknown>): { type: ReserveType } => {
    const t = search.type
    return { type: t === 'conflict' || t === 'overlap' ? t : 'normal' }
  },
  component: ReservesRoute,
})

function ReservesRoute() {
  const { type } = Route.useSearch()
  return <PagePlaceholder title={labels[type]} description={`予約一覧 (type: ${type})`} />
}
