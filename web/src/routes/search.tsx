import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/search')({
  component: () => <PagePlaceholder title="検索" />,
})
