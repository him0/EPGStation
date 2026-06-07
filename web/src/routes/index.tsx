import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground">
          React + Tailwind + shadcn/ui への移行 (Phase 0)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>セットアップ完了</CardTitle>
          <CardDescription>
            Vite / React / TypeScript / Tailwind v4 / shadcn/ui / TanStack
            Router / TanStack Query / Orval (fetch)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/storages">ストレージ情報を見る</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
