import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/guide')({
  component: () => <PagePlaceholder title="番組表" />,
})
