'use client'

import * as React from 'react'
import {
  Search,
  Sun,
  Moon,
  Plus,
  Building2,
  Users,
  FileText,
  Wrench,
  Crown,
  LogOut,
  User,
  Settings2,
  CreditCard,
  ChevronDown,
  Zap,
  Eye,
  Shield,
  CircleDot,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { useAppStore } from '@/stores'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { NotificationPanel } from './notification-panel'

// ── Module labels ───────────────────────────────────────────────────────────

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  reports: 'Reports',
  copilot: 'AI Copilot',
  market_intel: 'Market Intel',
  properties: 'Properties',
  tenants: 'Tenants',
  leases: 'Leases',
  screening: 'Screening',
  renewals: 'Renewals',
  move_inout: 'Move In/Out',
  e_signatures: 'E-Signatures',
  billing: 'Billing',
  accounting: 'Accounting',
  budget: 'Budget',
  late_fees: 'Late Fees',
  payment_plans: 'Payment Plans',
  marketplace: 'Marketplace',
  maintenance: 'Maintenance',
  inspections: 'Inspections',
  vendors: 'Vendors',
  assets: 'Assets',
  insurance: 'Insurance',
  calendar: 'Calendar',
  communications: 'Communications',
  compliance: 'Compliance',
  workflows: 'Workflows',
  energy: 'Energy',
  utilities: 'Utilities',
  visitors: 'Visitors',
  packages: 'Packages',
  parking: 'Parking',
  amenities: 'Amenities',
  keys: 'Key Management',
  pets: 'Pets',
  smart_home: 'Smart Home',
  announcements: 'Announcements',
  surveys: 'Surveys',
  disputes: 'Disputes',
  owner: 'Owner Management',
  owner_reports: 'Owner Reports',
  portal: 'Portal',
  devices: 'Device Management',
  documents: 'Documents',
  audit: 'Audit Trail',
  settings: 'Settings',
}

// ── Plan badge config ──────────────────────────────────────────────────────

const PLAN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  starter: { label: 'Starter', color: 'text-tahoe-blue', bg: 'bg-tahoe-blue/10' },
  professional: { label: 'Professional', color: 'text-tahoe-purple', bg: 'bg-tahoe-purple/10' },
  enterprise: { label: 'Enterprise', color: 'text-tahoe-green', bg: 'bg-tahoe-green/10' },
  trial: { label: 'Trial', color: 'text-tahoe-orange', bg: 'bg-tahoe-orange/10' },
}

// ── Client info hook ───────────────────────────────────────────────────────

interface ClientInfo {
  id: string
  companyName: string
  plan: string
  status: string
  billingCycle: string
  monthlyFee: number
  currency: string
  maxProperties: number
  maxUsers: number
  maxDevices: number
  contractEnd: string | null
}

function useClientInfo() {
  const { currentUser } = useAuthStore()
  const [clientInfo, setClientInfo] = React.useState<ClientInfo | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!currentUser?.clientId) {
      setClientInfo(null)
      return
    }
    setLoading(true)
    fetch('/api/owner/client-info')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.client) {
          setClientInfo(data.client)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentUser?.clientId])

  return { clientInfo, loading }
}

// ── Component ───────────────────────────────────────────────────────────────

export function AppHeader() {
  const { activeModule, setActiveModule, setCommandPaletteOpen } = useAppStore()
  const { currentUser, isViewOnly, loginMethod } = useAuthStore()
  const { clientInfo } = useClientInfo()
  const { resolvedTheme, setTheme } = useTheme()

  const moduleLabel = MODULE_LABELS[activeModule] ?? 'Dashboard'
  const planConfig = clientInfo ? (PLAN_CONFIG[clientInfo.plan] ?? PLAN_CONFIG.starter) : null
  const userInitials = currentUser?.name
    ?.split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'TF'

  return (
    <header className="flex h-14 items-center gap-2 glass-toolbar border-b border-border/40 px-4 shrink-0 z-20">
      {/* Sidebar trigger */}
      <SidebarTrigger className="-ml-1 size-8 rounded-lg" />
      <Separator orientation="vertical" className="mr-1 h-4 opacity-50" />

      {/* Breadcrumb — macOS style title */}
      <Breadcrumb className="flex-1 min-w-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[13px] font-medium text-foreground">
              {moduleLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Client & Subscription Info (center) ─────────────────────── */}
      {clientInfo && (
        <div className="hidden lg:flex items-center gap-2 mx-2">
          <button
            onClick={() => setActiveModule('owner')}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 bg-muted/40 hover:bg-muted/60 border border-border/30 transition-colors cursor-pointer"
          >
            <Building2 className="size-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-foreground/80 truncate max-w-[120px]">
              {clientInfo.companyName}
            </span>
            <Badge
              className={cn(
                'text-[9px] px-1.5 py-0 h-4 font-semibold border-0',
                planConfig?.bg,
                planConfig?.color
              )}
            >
              {planConfig?.label ?? clientInfo.plan}
            </Badge>
            {clientInfo.status === 'active' ? (
              <CircleDot className="size-2.5 text-tahoe-green fill-tahoe-green" />
            ) : clientInfo.status === 'suspended' ? (
              <CircleDot className="size-2.5 text-tahoe-red fill-tahoe-red" />
            ) : (
              <CircleDot className="size-2.5 text-tahoe-orange fill-tahoe-orange" />
            )}
          </button>
        </div>
      )}

      {/* ── Right side actions ───────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        {/* Search trigger — macOS Spotlight style */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'hidden md:flex h-7 w-44 items-center justify-start gap-2 rounded-lg bg-muted/40 border-border/30 text-muted-foreground text-[12px]',
            'hover:bg-muted/60 hover:text-foreground transition-colors'
          )}
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="size-3" />
          <span>Search</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-background/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/60">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </Button>

        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden size-8 rounded-lg text-muted-foreground"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="size-3.5" />
        </Button>

        {/* Add New — macOS style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="hidden sm:flex h-7 gap-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-[12px] font-medium shadow-sm"
            >
              <Plus className="size-3" />
              <span>New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('properties')}>
              <Building2 className="size-4" />
              New Property
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('tenants')}>
              <Users className="size-4" />
              New Tenant
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('leases')}>
              <FileText className="size-4" />
              New Lease
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('maintenance')}>
              <Wrench className="size-4" />
              New Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden size-8 rounded-lg text-muted-foreground"
            >
              <Plus className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('properties')}>
              <Building2 className="size-4" />
              New Property
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('tenants')}>
              <Users className="size-4" />
              New Tenant
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('leases')}>
              <FileText className="size-4" />
              New Lease
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => setActiveModule('maintenance')}>
              <Wrench className="size-4" />
              New Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <NotificationPanel />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-[16px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[16px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* ── User Avatar Dropdown ──────────────────────────────────── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-muted/50 transition-colors ml-0.5">
              <Avatar className="size-7 rounded-lg ring-1 ring-border/30">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-400 text-[10px] font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl glass-modal p-0" sideOffset={8}>
            {/* User info header */}
            <div className="flex items-center gap-3 p-3 border-b border-border/30">
              <Avatar className="size-10 rounded-xl ring-1 ring-border/30">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-400 text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {currentUser?.name || 'TenantFlow User'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {currentUser?.email || 'user@tenantflow.io'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge className="text-[9px] px-1.5 py-0 h-4 font-medium bg-primary/10 text-primary border-primary/20" variant="outline">
                    <Shield className="size-2.5 mr-0.5" />
                    {currentUser?.role || 'user'}
                  </Badge>
                  {isViewOnly && (
                    <Badge className="text-[9px] px-1.5 py-0 h-4 font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20" variant="outline">
                      <Eye className="size-2.5 mr-0.5" />
                      VIEW ONLY
                    </Badge>
                  )}
                  {loginMethod === 'demo' && (
                    <Badge className="text-[9px] px-1.5 py-0 h-4 font-semibold bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20" variant="outline">
                      <Zap className="size-2.5 mr-0.5" />
                      DEMO
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Client / Subscription info */}
            {clientInfo && (
              <div className="px-3 py-2.5 border-b border-border/30">
                <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                  Subscription
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    <span className="text-[12px] font-medium text-foreground truncate max-w-[140px]">
                      {clientInfo.companyName}
                    </span>
                  </div>
                  <Badge
                    className={cn(
                      'text-[9px] px-1.5 py-0 h-4 font-semibold border-0',
                      planConfig?.bg,
                      planConfig?.color
                    )}
                  >
                    <Crown className="size-2.5 mr-0.5" />
                    {planConfig?.label ?? clientInfo.plan}
                  </Badge>
                </div>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                    <p className="text-[9px] text-muted-foreground">Properties</p>
                    <p className="text-[11px] font-semibold text-foreground">{clientInfo.maxProperties}</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                    <p className="text-[9px] text-muted-foreground">Users</p>
                    <p className="text-[11px] font-semibold text-foreground">{clientInfo.maxUsers}</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 px-2 py-1.5 text-center">
                    <p className="text-[9px] text-muted-foreground">Devices</p>
                    <p className="text-[11px] font-semibold text-foreground">{clientInfo.maxDevices}</p>
                  </div>
                </div>
                {clientInfo.contractEnd && (
                  <p className="mt-1.5 text-[10px] text-muted-foreground">
                    Renews {new Date(clientInfo.contractEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    <span className="font-medium text-foreground">{clientInfo.currency === 'USD' ? '$' : clientInfo.currency}{clientInfo.monthlyFee}/{clientInfo.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </p>
                )}
              </div>
            )}

            {/* Menu items */}
            <div className="p-1.5">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setActiveModule('settings')}>
                  <User className="size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setActiveModule('settings')}>
                  <Settings2 className="size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {clientInfo && (
                  <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setActiveModule('owner')}>
                    <CreditCard className="size-4" />
                    <span>Billing & Subscription</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive rounded-lg gap-2"
                onClick={() => window.dispatchEvent(new Event('tenantflow:logout'))}
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
