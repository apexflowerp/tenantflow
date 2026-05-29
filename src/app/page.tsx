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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
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
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
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
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10',
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
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    stats: [
      { label: 'Monthly Revenue', value: '$42,800' },
      { label: 'Pending', value: '$8,550' },
      { label: 'Overdue', value: '$2,100' },
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
  communications: {
    id: 'communications',
    label: 'Communications',
    description: 'Messages, emails, and tenant communication',
    icon: MessageSquare,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
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
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-500/10',
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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    stats: [
      { label: 'Total Devices', value: '5' },
      { label: 'Active', value: '3' },
      { label: 'Blocked', value: '1' },
      { label: 'Active Sessions', value: '5' },
    ],
  },
  audit: {
    id: 'audit',
    label: 'Audit Trail',
    description: 'Track all system activities and security events',
    icon: ScrollText,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
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
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-500/10',
  },
}

// ── Module Placeholder ──────────────────────────────────────────────────────

function ModulePlaceholder({ moduleId }: { moduleId: string }) {
  const config = MODULES[moduleId] ?? MODULES.dashboard
  const Icon = config.icon

  return (
    <motion.div
      key={moduleId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Module header */}
      <div className="flex items-start gap-4">
        <div className={`flex size-12 items-center justify-center rounded-xl ${config.bgColor}`}>
          <Icon className={`size-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {config.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Badge variant="secondary" className="hidden sm:flex gap-1 text-xs">
          <Activity className="size-3" />
          Live
        </Badge>
      </div>

      {/* Stats cards */}
      {config.stats && config.stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {config.stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  {stat.trend && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
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
                className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
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
      <Card className="border-border/50 shadow-sm">
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
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
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
  // Use real DashboardPage for the dashboard module
  if (moduleId === 'dashboard') {
    return (
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <DashboardPage />
      </motion.div>
    )
  }

  // Use PropertiesPage for the properties module
  if (moduleId === 'properties') {
    return (
      <motion.div
        key="properties"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <PropertiesPage />
      </motion.div>
    )
  }

  // Use TenantsPage for the tenants module
  if (moduleId === 'tenants') {
    return (
      <motion.div
        key="tenants"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <TenantsPage />
      </motion.div>
    )
  }

  // Use LeasesPage for the leases module
  if (moduleId === 'leases') {
    return (
      <motion.div
        key="leases"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <LeasesPage />
      </motion.div>
    )
  }

  // Use MaintenancePage for the maintenance module
  if (moduleId === 'maintenance') {
    return (
      <motion.div
        key="maintenance"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <MaintenancePage />
      </motion.div>
    )
  }

  // Use BillingPage for the billing module
  if (moduleId === 'billing') {
    return (
      <motion.div
        key="billing"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <BillingPage />
      </motion.div>
    )
  }

  // Use AnalyticsPage for the analytics module
  if (moduleId === 'analytics') {
    return (
      <motion.div
        key="analytics"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <AnalyticsPage />
      </motion.div>
    )
  }

  // Use AiCopilotPage for the copilot module
  if (moduleId === 'copilot') {
    return (
      <motion.div
        key="copilot"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <AiCopilotPage />
      </motion.div>
    )
  }

  // Use CommunicationsPage for the communications module
  if (moduleId === 'communications') {
    return (
      <motion.div
        key="communications"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <CommunicationsPage />
      </motion.div>
    )
  }

  // Use SettingsPage for the settings module
  if (moduleId === 'settings') {
    return (
      <motion.div
        key="settings"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <SettingsPage />
      </motion.div>
    )
  }

  // Use DocumentsPage for the documents module
  if (moduleId === 'documents') {
    return (
      <motion.div
        key="documents"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <DocumentsPage />
      </motion.div>
    )
  }

  // Use ReportsPage for the reports module
  if (moduleId === 'reports') {
    return (
      <motion.div
        key="reports"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <ReportsPage />
      </motion.div>
    )
  }

  // Use OwnerPage for the owner module
  if (moduleId === 'owner') {
    return (
      <motion.div
        key="owner"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <OwnerPage />
      </motion.div>
    )
  }

  // Use DevicesPage for the devices module
  if (moduleId === 'devices') {
    return (
      <motion.div
        key="devices"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <DevicesPage />
      </motion.div>
    )
  }

  // Use AuditPage for the audit module
  if (moduleId === 'audit') {
    return (
      <motion.div
        key="audit"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <AuditPage />
      </motion.div>
    )
  }

  return <ModulePlaceholder moduleId={moduleId} />
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

          {/* User info + logout in header area */}
          {isAuthenticated && currentUser && (
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 md:px-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <span>{currentUser.name}</span>
                <span className="text-xs text-muted-foreground/50">·</span>
                <span className="text-xs text-muted-foreground/70">{currentUser.email}</span>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </button>
            </div>
          )}

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <AnimatePresence mode="wait">
                <ModuleContent key={activeModule} moduleId={activeModule} />
              </AnimatePresence>
            </div>
          </div>
        </SidebarInset>

        <CommandPalette />
      </SidebarProvider>
    </AuthGate>
  )
}
