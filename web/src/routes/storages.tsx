import { createFileRoute } from '@tanstack/react-router'

import { useGetStorages } from '@/api/generated/endpoints'
import type { StorageItem } from '@/api/generated/model'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/storages')({
  component: StoragesPage,
})

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`
}

function StorageCard({ item }: { item: StorageItem }) {
  const usedRatio = item.total > 0 ? item.used / item.total : 0
  const usedPercent = Math.round(usedRatio * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          {formatBytes(item.available)} 空き / {formatBytes(item.total)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>使用 {formatBytes(item.used)}</span>
          <span>{usedPercent}%</span>
        </div>
      </CardContent>
    </Card>
  )
}

function StoragesPage() {
  const { data, isLoading, error } = useGetStorages()

  const items = data?.status === 200 ? data.data.items : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ストレージ</h1>
        <p className="text-muted-foreground">
          各保存先のディスク使用状況 (GET /api/storages)
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">読み込み中...</p>}

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">取得に失敗しました</CardTitle>
            <CardDescription>{String(error)}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <StorageCard key={item.name} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
