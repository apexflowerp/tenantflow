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
  Scale,
  Globe,
  Car,
  Waves,
  Megaphone,
  ClipboardList,
  Key,
  Repeat,
  Receipt,
  Wallet,
  Zap,
  UserCheck,
  Package,
  LogIn,
  PiggyBank,
  PenTool,
  PawPrint,
  AlertTriangle,
  Warehouse,
  TrendingUp,
  Leaf,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { useAppStore, useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ── Navigation structure ────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color?: string // optional accent color
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
      { id: 'copilot', label: 'AI Copilot', icon: Sparkles, color: 'text-tahoe-purple' },
      { id: 'market_intel', label: 'Market Intel', icon: TrendingUp, color: 'text-tahoe-green' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { id: 'properties', label: 'Properties', icon: Building2 },
      { id: 'tenants', label: 'Tenants', icon: Users },
      { id: 'leases', label: 'Leases', icon: FileText },
      { id: 'screening', label: 'Screening', icon: ShieldCheck, color: 'text-tahoe-blue' },
      { id: 'renewals', label: 'Renewals', icon: Repeat, color: 'text-tahoe-purple' },
      { id: 'move_inout', label: 'Move In/Out', icon: LogIn, color: 'text-tahoe-purple' },
      { id: 'e_signatures', label: 'E-Signatures', icon: PenTool, color: 'text-tahoe-pink' },
    ],
  },
  {
    label: 'FINANCIAL',
    items: [
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'accounting', label: 'Accounting', icon: BookOpen },
      { id: 'budget', label: 'Budget', icon: PiggyBank, color: 'text-tahoe-teal' },
      { id: 'late_fees', label: 'Late Fees', icon: Receipt, color: 'text-tahoe-red' },
      { id: 'payment_plans', label: 'Payment Plans', icon: Wallet, color: 'text-tahoe-green' },
      { id: 'marketplace', label: 'Marketplace', icon: Store },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-tahoe-orange' },
      { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
      { id: 'vendors', label: 'Vendors', icon: Truck },
      { id: 'assets', label: 'Assets', icon: Warehouse, color: 'text-tahoe-blue' },
      { id: 'insurance', label: 'Insurance', icon: ShieldAlert },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      { id: 'communications', label: 'Communications', icon: MessageSquare, color: 'text-tahoe-teal' },
    ],
  },
  {
    label: 'BUILDING',
    items: [
      { id: 'compliance', label: 'Compliance', icon: Scale, color: 'text-tahoe-purple' },
      { id: 'workflows', label: 'Workflows', icon: Zap, color: 'text-tahoe-teal' },
      { id: 'energy', label: 'Energy', icon: Leaf, color: 'text-tahoe-green' },
      { id: 'utilities', label: 'Utilities', icon: Zap, color: 'text-tahoe-orange' },
      { id: 'visitors', label: 'Visitors', icon: UserCheck, color: 'text-tahoe-blue' },
      { id: 'packages', label: 'Packages', icon: Package, color: 'text-tahoe-orange' },
      { id: 'parking', label: 'Parking', icon: Car, color: 'text-tahoe-blue' },
      { id: 'amenities', label: 'Amenities', icon: Waves, color: 'text-tahoe-teal' },
      { id: 'keys', label: 'Key Mgmt', icon: Key, color: 'text-tahoe-blue' },
      { id: 'pets', label: 'Pets', icon: PawPrint, color: 'text-tahoe-orange' },
      { id: 'smart_home', label: 'Smart Home', icon: Building2, color: 'text-tahoe-green' },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { id: 'announcements', label: 'Announcements', icon: Megaphone, color: 'text-tahoe-blue' },
      { id: 'surveys', label: 'Surveys', icon: ClipboardList, color: 'text-tahoe-orange' },
      { id: 'disputes', label: 'Disputes', icon: AlertTriangle, color: 'text-tahoe-red' },
    ],
  },
  {
    label: 'PLATFORM',
    items: [
      { id: 'owner', label: 'Owner Panel', icon: Shield },
      { id: 'owner_reports', label: 'Reports', icon: BarChart3, color: 'text-tahoe-purple' },
      { id: 'portal', label: 'Portal', icon: Globe, color: 'text-tahoe-pink' },
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

// ── Sidebar Toggle Button ────────────────────────────────────────────────────

function SidebarToggleButton() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="px-2 pb-3 pt-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'w-full justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200',
              isCollapsed ? 'h-8 w-8 px-0' : 'h-8 gap-2 px-2'
            )}
          >
            {isCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <>
                <ChevronsLeft className="size-4" />
                <span className="text-[11px] font-medium">Collapse</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" align="center">
            Expand sidebar
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  )
}

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
                  Enterprise Management
                </p>
              </div>
              <ChevronsUpDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl glass-modal">
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
      <SidebarContent className="px-2 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-track]:bg-transparent">
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
                              : item.color
                                ? `${item.color} opacity-70 group-hover/menu-button:opacity-100`
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

      {/* ── Expand / Collapse Toggle ──────────────────────────────────── */}
      <SidebarToggleButton />

      <SidebarRail />
    </Sidebar>
  )
}
