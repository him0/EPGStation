import {
  Link,
  useRouterState,
  type LinkProps,
} from '@tanstack/react-router'
import {
  Calendar,
  CircleDot,
  Clock,
  Film,
  HardDrive,
  LayoutDashboard,
  MonitorPlay,
  RefreshCw,
  Search,
  Settings,
  Tv,
  Tv2,
} from 'lucide-react'
import type { ComponentProps, ComponentType } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

type NavItem = {
  to: LinkProps['to']
  label: string
  icon: ComponentType<{ className?: string }>
  exact?: boolean
  search?: { type: string }
}

// 元の Vue クライアントのナビゲーションと同じ構成
const navItems: NavItem[] = [
  { to: '/', label: 'ダッシュボード', icon: LayoutDashboard, exact: true },
  { to: '/onair', label: '放映中', icon: MonitorPlay },
  { to: '/guide', label: '番組表', icon: Tv2 },
  { to: '/recording', label: '録画中', icon: CircleDot },
  { to: '/recorded', label: '録画済み', icon: Film },
  { to: '/encode', label: 'エンコード', icon: RefreshCw },
  { to: '/reserves', label: '予約', icon: Clock, search: { type: 'normal' } },
  { to: '/reserves', label: '競合', icon: Clock, search: { type: 'conflict' } },
  { to: '/reserves', label: '重複', icon: Clock, search: { type: 'overlap' } },
  { to: '/search', label: '検索', icon: Search },
  { to: '/rule', label: 'ルール', icon: Calendar },
  { to: '/storages', label: 'ストレージ', icon: HardDrive },
  { to: '/settings', label: '設定', icon: Settings },
]

function NavMenuItem({ item }: { item: NavItem }) {
  const { pathname, type } = useRouterState({
    select: s => ({
      pathname: s.location.pathname,
      type: (s.location.search as { type?: string }).type,
    }),
  })

  const isActive = item.search
    ? pathname === item.to && type === item.search.type
    : pathname === item.to

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <Link to={item.to} search={item.search as LinkProps['search']}>
          <item.icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Tv className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EPGStation</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(item => (
              <NavMenuItem key={`${item.to}-${item.label}`} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
