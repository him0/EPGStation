import { Construction } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  title: string
  description?: string
}

export function PagePlaceholder({ title, description }: Props) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="size-5" />
            準備中
          </CardTitle>
          <CardDescription>
            このページは React 移行の仮置きです (Phase 0)。
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          今後ここに「{title}」の機能を移植します。
        </CardContent>
      </Card>
    </div>
  )
}
