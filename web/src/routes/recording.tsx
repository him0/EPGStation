import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/recording')({
  component: () => <PagePlaceholder title="録画中" />,
})
