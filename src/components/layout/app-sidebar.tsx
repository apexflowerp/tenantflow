'use client'

import * as React from 'react'
import {
  Building2,
  LayoutDashboard,
  BarChart3,
  Sparkles,
  Users,
  FileText,
  CreditCard,
  Wrench,
  MessageSquare,
  FolderOpen,
  Settings,
  ChevronsUpDown,
  LogOut,
  User,
  Settings2,
  FileBarChart,
  Shield,
  ShieldCheck,
  ScrollText,
  Truck,
  ClipboardCheck,
  Store,
  ShieldAlert,
  CalendarDays,
  BookOpen,
} from 'lucide-react'

import { useAppStore } from '@/stores'
import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// ── Navigation structure ────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileBarChart },
      { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { id: 'properties', label: 'Properties', icon: Building2 },
      { id: 'tenants', label: 'Tenants', icon: Users },
      { id: 'leases', label: 'Leases', icon: FileText },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'marketplace', label: 'Marketplace', icon: Store },
      { id: 'accounting', label: 'Accounting', icon: BookOpen },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench },
      { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
      { id: 'vendors', label: 'Vendors', icon: Truck },
      { id: 'insurance', label: 'Insurance', icon: ShieldAlert },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      { id: 'communications', label: 'Communications', icon: MessageSquare },
    ],
  },
  {
    label: 'PLATFORM',
    items: [
      { id: 'owner', label: 'Owner Mgmt', icon: Shield },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'devices', label: 'Devices', icon: ShieldCheck },
      { id: 'documents', label: 'Documents', icon: FolderOpen },
      { id: 'audit', label: 'Audit Trail', icon: ScrollText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

// ── Workspace selector data ─────────────────────────────────────────────────

const WORKSPACES = [
  { id: 'ws-1', name: 'TenantFlow HQ', slug: 'tenantflow-hq' },
  { id: 'ws-2', name: 'Skyline Properties', slug: 'skyline' },
]

// ── Component ───────────────────────────────────────────────────────────────

export function AppSidebar() {
  const { activeModule, setActiveModule, currentWorkspace, setCurrentWorkspace } =
    useAppStore()

  return (
    <Sidebar collapsible="icon" className="border-r-0 glass-sidebar">
      {/* ── Logo & Workspace ─────────────────────────────────────────── */}
      <SidebarHeader className="px-3 pt-3 pb-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent focus-visible:ring-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-600/20">
                <Building2 className="size-4 text-white" />
              </div>
              <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {currentWorkspace?.name ?? 'TenantFlow OS'}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Property Management
                </p>
              </div>
              <ChevronsUpDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl">
            {WORKSPACES.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => setCurrentWorkspace(ws)}
                className={cn(
                  'cursor-pointer rounded-lg',
                  currentWorkspace?.id === ws.id && 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                )}
              >
                <Building2 className="size-4" />
                {ws.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-3 opacity-50" />

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <SidebarContent className="px-2">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/50 uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = activeModule === item.id
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActiveModule(item.id)}
                        tooltip={item.label}
                        className={cn(
                          'transition-all duration-200 rounded-xl',
                          isActive
                            ? 'bg-primary/10 text-primary font-medium shadow-sm shadow-primary/5 hover:bg-primary/15'
                            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'transition-colors duration-200',
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover/menu-button:text-sidebar-foreground'
                          )}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="mx-3 opacity-50" />

      {/* ── User / Footer ────────────────────────────────────────────── */}
      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent rounded-xl"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-400 text-xs font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium text-sidebar-foreground">
                      Jordan Davis
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      jordan@tenantflow.io
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-56 rounded-xl"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer rounded-lg">
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg"
                  onClick={() => setActiveModule('settings')}
                >
                  <Settings2 className="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive rounded-lg"
                  variant="destructive"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
