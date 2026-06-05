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
  PanelLeft,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { useAppStore } from '@/stores'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

// ── Component ───────────────────────────────────────────────────────────────

export function AppHeader() {
  const { activeModule, setActiveModule, setCommandPaletteOpen } = useAppStore()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const moduleLabel = MODULE_LABELS[activeModule] ?? 'Dashboard'

  return (
    <header className="flex h-12 items-center gap-2 glass-toolbar border-b border-border/40 px-4 shrink-0 z-20">
      {/* Sidebar trigger */}
      <SidebarTrigger className="-ml-1 size-8 rounded-lg" />
      <Separator orientation="vertical" className="mr-1 h-4 opacity-50" />

      {/* Breadcrumb — macOS style title */}
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[13px] font-medium text-foreground">
              {moduleLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search trigger — macOS Spotlight style */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'hidden md:flex h-7 w-56 items-center justify-start gap-2 rounded-lg bg-muted/40 border-border/30 text-muted-foreground text-[12px]',
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

      <div className="flex items-center gap-0.5">
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

        {/* Theme toggle — macOS style */}
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
      </div>
    </header>
  )
}
