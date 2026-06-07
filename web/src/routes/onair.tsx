import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/onair')({
  component: () => <PagePlaceholder title="放映中" />,
})
