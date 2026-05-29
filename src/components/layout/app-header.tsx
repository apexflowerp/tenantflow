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
  copilot: 'AI Copilot',
  properties: 'Properties',
  tenants: 'Tenants',
  leases: 'Leases',
  billing: 'Billing',
  maintenance: 'Maintenance',
  communications: 'Communications',
  documents: 'Documents',
  settings: 'Settings',
}

// ── Component ───────────────────────────────────────────────────────────────

export function AppHeader() {
  const { activeModule, setCommandPaletteOpen } = useAppStore()
  const { theme, setTheme } = useTheme()

  const moduleLabel = MODULE_LABELS[activeModule] ?? 'Dashboard'

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-20">
      {/* Sidebar trigger */}
      <SidebarTrigger className="-ml-1 size-9" />
      <Separator orientation="vertical" className="mr-1 h-5" />

      {/* Breadcrumb */}
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium text-foreground">
              {moduleLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search trigger */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'hidden md:flex h-8 w-64 items-center justify-start gap-2 rounded-lg bg-muted/50 text-muted-foreground',
          'hover:bg-muted hover:text-foreground transition-colors'
        )}
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-3.5" />
        <span className="text-xs">Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile search */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden size-9 rounded-lg text-muted-foreground"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-4" />
      </Button>

      <div className="flex items-center gap-1">
        {/* Add New */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="hidden sm:flex h-8 gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Plus className="size-3.5" />
              <span className="text-xs font-medium">Add New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <Building2 className="size-4" />
              New Property
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Users className="size-4" />
              New Tenant
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileText className="size-4" />
              New Lease
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
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
              className="sm:hidden size-9 rounded-lg text-muted-foreground"
            >
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <Building2 className="size-4" />
              New Property
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Users className="size-4" />
              New Tenant
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileText className="size-4" />
              New Lease
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
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
          className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
