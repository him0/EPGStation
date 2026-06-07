import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/encode')({
  component: () => <PagePlaceholder title="エンコード" />,
})
