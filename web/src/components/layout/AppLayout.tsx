import { Link, Outlet } from '@tanstack/react-router'
import { HardDrive, LayoutDashboard, Tv } from 'lucide-react'
import type { ComponentType } from 'react'

import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}

// Phase 0 のナビ。今後ページ移植に合わせて増やしていく。
const navItems: NavItem[] = [
  { to: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { to: '/storages', label: 'ストレージ', icon: HardDrive },
]

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
        <div className="flex h-14 items-center gap-2 border-b px-5 font-semibold">
          <Tv className="size-5" />
          EPGStation
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              )}
              activeProps={{
                className: 'bg-accent text-accent-foreground',
              }}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="flex h-14 items-center border-b px-6 font-semibold md:hidden">
          <Tv className="mr-2 size-5" />
          EPGStation
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
