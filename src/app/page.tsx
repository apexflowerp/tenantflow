'use client'

import { TenantsPage } from '@/components/tenants'
import { PropertiesPage } from '@/components/properties'
import { DashboardPage } from '@/components/dashboard'
import { LeasesPage } from '@/components/leases'
import { MaintenancePage } from '@/components/maintenance'
import { BillingPage } from '@/components/billing'
import { CommunicationsPage } from '@/components/communications'
import { SettingsPage } from '@/components/settings'
import { AnalyticsPage } from '@/components/analytics'
import { AiCopilotPage } from '@/components/ai-copilot'
import { DocumentsPage } from '@/components/documents'
import { ReportsPage } from '@/components/reports'
import { LoginPage } from '@/components/auth/login-page'
import { OwnerPage } from '@/components/owner'
import { DevicesPage } from '@/components/devices'
import { AuditPage } from '@/components/audit'
import { AccountingPage } from '@/components/accounting'
import { InsurancePage } from '@/components/insurance'
import { CalendarPage } from '@/components/calendar'
import { InspectionsPage } from '@/components/inspections'
import { VendorsPage } from '@/components/vendors'
import { MarketplacePage } from '@/components/marketplace'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  Building2,
  Users,
  FileText,
  CreditCard,
  Wrench,
  MessageSquare,
  FolderOpen,
  Settings,
  ArrowRight,
  TrendingUp,
  HomeIcon,
  Activity,
  LogOut,
  FileBarChart,
  Shield,
  ShieldCheck,
  ScrollText,
  Truck,
  ClipboardCheck,
  ShieldAlert,
  CalendarDays,
  Store,
  BookOpen,
} from 'lucide-react'

import { useAppStore } from '@/stores'
import { useAuthStore } from '@/stores/auth-store'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { CommandPalette } from '@/components/layout/command-palette'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ── Module config ───────────────────────────────────────────────────────────

interface ModuleConfig {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  stats?: { label: string; value: string; trend?: string }[]
  quickActions?: { label: string; icon: React.ComponentType<{ className?: string }> }[]
}

const MODULES: Record<string, ModuleConfig> = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Your property management overview at a glance',
    icon: LayoutDashboard,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Properties', value: '6', trend: '+2' },
      { label: 'Active Tenants', value: '15', trend: '+3' },
      { label: 'Occupancy Rate', value: '89%', trend: '+5%' },
      { label: 'Monthly Revenue', value: '$42,800', trend: '+12%' },
    ],
    quickActions: [
      { label: 'View Analytics', icon: BarChart3 },
      { label: 'Open AI Copilot', icon: Sparkles },
      { label: 'Add Property', icon: Building2 },
    ],
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    description: 'Insights and performance metrics across your portfolio',
    icon: BarChart3,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Revenue YTD', value: '$512,400', trend: '+18%' },
      { label: 'Collection Rate', value: '94.2%', trend: '+3%' },
      { label: 'Avg. Lease Value', value: '$2,850', trend: '+8%' },
    ],
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    description: 'Professional invoices, reports, and document generation',
    icon: FileBarChart,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Reports Generated', value: '24' },
      { label: 'Invoices Sent', value: '18' },
      { label: 'Total Revenue', value: '$269.8K' },
    ],
  },
  copilot: {
    id: 'copilot',
    label: 'AI Copilot',
    description: 'Your AI-powered property management assistant',
    icon: Sparkles,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  properties: {
    id: 'properties',
    label: 'Properties',
    description: 'Manage your property portfolio and units',
    icon: Building2,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Properties', value: '6' },
      { label: 'Total Units', value: '24' },
      { label: 'Occupied', value: '21' },
      { label: 'Vacant', value: '3' },
    ],
    quickActions: [
      { label: 'Add Property', icon: Building2 },
      { label: 'View Units', icon: HomeIcon },
    ],
  },
  tenants: {
    id: 'tenants',
    label: 'Tenants',
    description: 'Tenant management and communication',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Tenants', value: '15' },
      { label: 'Active Leases', value: '12' },
      { label: 'Expiring Soon', value: '3' },
    ],
  },
  leases: {
    id: 'leases',
    label: 'Leases',
    description: 'Lease agreements, renewals, and expirations',
    icon: FileText,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Active Leases', value: '12' },
      { label: 'Expiring (30d)', value: '3' },
      { label: 'Expired', value: '1' },
    ],
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    description: 'Payments, invoices, and financial tracking',
    icon: CreditCard,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Monthly Revenue', value: '$42,800' },
      { label: 'Pending', value: '$8,550' },
      { label: 'Overdue', value: '$2,100' },
    ],
  },
  marketplace: {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Listings, applications, and tenant placement',
    icon: Store,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Active Listings', value: '4' },
      { label: 'Total Applications', value: '6' },
      { label: 'Approval Rate', value: '33%' },
      { label: 'Avg. Days to Fill', value: '18' },
    ],
  },
  accounting: {
    id: 'accounting',
    label: 'Accounting',
    description: 'Chart of accounts, general ledger, and financial reporting',
    icon: BookOpen,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Revenue', value: '$524,400' },
      { label: 'Net Income', value: '$358,600' },
      { label: 'Accounts', value: '17' },
      { label: 'Transactions', value: '8' },
    ],
  },
  maintenance: {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Work orders, tickets, and maintenance scheduling',
    icon: Wrench,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    stats: [
      { label: 'Open Tickets', value: '8' },
      { label: 'In Progress', value: '4' },
      { label: 'Resolved', value: '3' },
    ],
  },
  vendors: {
    id: 'vendors',
    label: 'Vendors & Contractors',
    description: 'Manage service providers, contractors, and vendor relationships',
    icon: Truck,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Vendors', value: '6' },
      { label: 'Active', value: '5' },
      { label: 'Top Rated', value: '4' },
      { label: 'Total Spent', value: '$85.5k' },
    ],
  },
  communications: {
    id: 'communications',
    label: 'Communications',
    description: 'Messages, emails, and tenant communication',
    icon: MessageSquare,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
    stats: [
      { label: 'Unread Messages', value: '5' },
      { label: 'Sent This Week', value: '12' },
    ],
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    description: 'File management, templates, and document storage',
    icon: FolderOpen,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Documents', value: '24' },
      { label: 'Recent Uploads', value: '3' },
    ],
  },
  owner: {
    id: 'owner',
    label: 'Owner Management',
    description: 'Manage SaaS clients, licenses, and billing',
    icon: Shield,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Active Clients', value: '3' },
      { label: 'MRR', value: '$1,197' },
      { label: 'Trial Clients', value: '1' },
    ],
  },
  devices: {
    id: 'devices',
    label: 'Device Management',
    description: 'Track devices, manage serial keys, and control sessions',
    icon: ShieldCheck,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Devices', value: '5' },
      { label: 'Active', value: '3' },
      { label: 'Blocked', value: '1' },
      { label: 'Active Sessions', value: '5' },
    ],
  },
  insurance: {
    id: 'insurance',
    label: 'Insurance',
    description: 'Manage policies, coverage, and compliance',
    icon: ShieldAlert,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Active Policies', value: '5' },
      { label: 'Total Coverage', value: '$9.5M' },
      { label: 'Annual Premium', value: '$40.3K' },
      { label: 'Expiring Soon', value: '0' },
    ],
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    description: 'Schedule showings, inspections, and events',
    icon: CalendarDays,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Upcoming Events', value: '8' },
      { label: 'This Week', value: '3' },
      { label: 'Showings', value: '2' },
    ],
  },
  inspections: {
    id: 'inspections',
    label: 'Inspections',
    description: 'Property inspections, checklists, and condition reports',
    icon: ClipboardCheck,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Inspections', value: '6' },
      { label: 'Scheduled', value: '2' },
      { label: 'Completed', value: '3' },
      { label: 'Avg Rating', value: '4.2' },
    ],
    quickActions: [
      { label: 'Schedule Inspection', icon: ClipboardCheck },
    ],
  },
  audit: {
    id: 'audit',
    label: 'Audit Trail',
    description: 'Track all system activities and security events',
    icon: ScrollText,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Events', value: '35' },
      { label: 'Warnings', value: '6' },
      { label: 'Errors', value: '2' },
      { label: 'Critical', value: '2' },
    ],
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    description: 'Configure your workspace and preferences',
    icon: Settings,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
  },
}

// ── Module Placeholder ──────────────────────────────────────────────────────

function ModulePlaceholder({ moduleId }: { moduleId: string }) {
  const config = MODULES[moduleId] ?? MODULES.dashboard
  const Icon = config.icon

  return (
    <motion.div
      key={moduleId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-6"
    >
      {/* Module header */}
      <div className="flex items-start gap-4">
        <div className={`flex size-11 items-center justify-center rounded-xl ${config.bgColor}`}>
          <Icon className={`size-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {config.label}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Badge variant="secondary" className="hidden sm:flex gap-1 text-[10px] font-medium">
          <Activity className="size-3" />
          Live
        </Badge>
      </div>

      {/* Stats cards */}
      {config.stats && config.stats.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {config.stats.map((stat) => (
            <Card key={stat.label} className="mojave-card border-border/40 bg-card/80">
              <CardContent className="p-4">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  {stat.trend && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary">
                      <TrendingUp className="size-3" />
                      {stat.trend}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick actions */}
      {config.quickActions && config.quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {config.quickActions.map((action) => {
            const ActionIcon = action.icon
            return (
              <button
                key={action.label}
                className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
              >
                <ActionIcon className="size-4 text-muted-foreground" />
                {action.label}
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      )}

      {/* Content placeholder */}
      <Card className="mojave-card border-border/40 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className={`flex size-16 items-center justify-center rounded-2xl ${config.bgColor} mb-4`}>
              <Icon className={`size-8 ${config.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {config.label} Module
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              This module is being built. Full functionality including data tables, forms,
              and real-time updates will be available soon.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                Coming Soon
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <Sparkles className="size-3" />
                AI-Enhanced
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Module Renderer ─────────────────────────────────────────────────────────

function ModuleContent({ moduleId }: { moduleId: string }) {
  const moduleMap: Record<string, React.ComponentType> = {
    dashboard: DashboardPage,
    properties: PropertiesPage,
    tenants: TenantsPage,
    leases: LeasesPage,
    maintenance: MaintenancePage,
    vendors: VendorsPage,
    billing: BillingPage,
    marketplace: MarketplacePage,
    accounting: AccountingPage,
    analytics: AnalyticsPage,
    copilot: AiCopilotPage,
    communications: CommunicationsPage,
    settings: SettingsPage,
    documents: DocumentsPage,
    reports: ReportsPage,
    owner: OwnerPage,
    devices: DevicesPage,
    inspections: InspectionsPage,
    insurance: InsurancePage,
    calendar: CalendarPage,
    audit: AuditPage,
  }

  const ModuleComponent = moduleMap[moduleId]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={moduleId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {ModuleComponent ? <ModuleComponent /> : <ModulePlaceholder moduleId={moduleId} />}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────

function AppInitializer() {
  const { addNotification, setCurrentWorkspace } = useAppStore()

  React.useEffect(() => {
    // Set default workspace
    setCurrentWorkspace({
      id: 'ws-1',
      name: 'TenantFlow HQ',
      slug: 'tenantflow-hq',
    })

    // Add demo notifications
    const demoNotifications: Array<{
      title: string
      message: string
      type: 'info' | 'success' | 'warning' | 'error'
    }> = [
      {
        title: 'Lease Expiring Soon',
        message: 'Skyline Tower Unit 4B lease expires in 15 days',
        type: 'warning',
      },
      {
        title: 'Payment Received',
        message: 'Harbor View Residences - Unit 12A rent payment of $2,400 received',
        type: 'success',
      },
      {
        title: 'Maintenance Request',
        message: 'New urgent ticket: HVAC system at Metro Commercial Hub',
        type: 'error',
      },
      {
        title: 'New Tenant Application',
        message: 'Sarah Mitchell applied for Unit 7C at Greenfield Gardens',
        type: 'info',
      },
    ]

    demoNotifications.forEach((n, i) => {
      setTimeout(() => addNotification(n), i * 100)
    })
  }, [addNotification, setCurrentWorkspace])

  return null
}

// ── Auth Gate Component ──────────────────────────────────────────────────────

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hydrate } = useAuthStore()
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    _hydrate()
    setHydrated(true)
  }, [_hydrate])

  // Show nothing while hydrating to prevent flash
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="size-5 animate-pulse" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}

// ── Logout Handler ────────────────────────────────────────────────────────────

function LogoutHandler() {
  const { logout } = useAuthStore()

  React.useEffect(() => {
    // Listen for logout events from the sidebar/user menu
    const handleLogout = () => {
      logout()
    }
    window.addEventListener('tenantflow:logout', handleLogout)
    return () => window.removeEventListener('tenantflow:logout', handleLogout)
  }, [logout])

  return null
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const { activeModule } = useAppStore()
  const { isAuthenticated, currentUser, logout } = useAuthStore()

  return (
    <AuthGate>
      <SidebarProvider>
        <AppInitializer />
        <LogoutHandler />
        <AppSidebar />

        <SidebarInset>
          <AppHeader />

          {/* User info bar — macOS subtitle bar style */}
          {isAuthenticated && currentUser && (
            <div className="flex items-center justify-between border-b border-border/30 px-5 py-1.5 bg-muted/20">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40">
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                    {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-foreground/80">{currentUser.name}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground/60">{currentUser.email}</span>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="size-3" />
                Sign Out
              </button>
            </div>
          )}

          {/* Main content area — macOS content view */}
          <div className="flex-1 overflow-auto">
            <div className="p-5 md:p-6 lg:p-8">
              <ModuleContent key={activeModule} moduleId={activeModule} />
            </div>
          </div>
        </SidebarInset>

        <CommandPalette />
      </SidebarProvider>
    </AuthGate>
  )
}
