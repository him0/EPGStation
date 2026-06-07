import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/recorded')({
  component: () => <PagePlaceholder title="録画済み" />,
})
