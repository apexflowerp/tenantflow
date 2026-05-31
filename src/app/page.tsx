'use client'

import dynamic from 'next/dynamic'

// ── Lazy-loaded module components ────────────────────────────────────────────
// Only the login page is eagerly needed; all other modules load on demand
// via the moduleLoader map below to minimize initial compilation memory.
const LoginPage = dynamic(() => import('@/components/auth/login-page').then(m => ({ default: m.LoginPage })), { ssr: false })

// Module loader map — uses string-based dynamic imports that webpack resolves
// lazily. Each key maps to a [module_path, export_name] pair.
// The actual import() only happens when the user navigates to that module.
const moduleRegistry: Record<string, [string, string]> = {
  dashboard: ['@/components/dashboard', 'DashboardPage'],
  properties: ['@/components/properties', 'PropertiesPage'],
  tenants: ['@/components/tenants', 'TenantsPage'],
  leases: ['@/components/leases', 'LeasesPage'],
  maintenance: ['@/components/maintenance', 'MaintenancePage'],
  vendors: ['@/components/vendors', 'VendorsPage'],
  billing: ['@/components/billing', 'BillingPage'],
  marketplace: ['@/components/marketplace', 'MarketplacePage'],
  accounting: ['@/components/accounting', 'AccountingPage'],
  analytics: ['@/components/analytics', 'AnalyticsPage'],
  copilot: ['@/components/ai-copilot', 'AiCopilotPage'],
  communications: ['@/components/communications', 'CommunicationsPage'],
  settings: ['@/components/settings', 'SettingsPage'],
  documents: ['@/components/documents', 'DocumentsPage'],
  reports: ['@/components/reports', 'ReportsPage'],
  owner: ['@/components/owner', 'OwnerPage'],
  owner_reports: ['@/components/owner', 'ReportsPage'],
  devices: ['@/components/devices', 'DevicesPage'],
  inspections: ['@/components/inspections', 'InspectionsPage'],
  insurance: ['@/components/insurance', 'InsurancePage'],
  calendar: ['@/components/calendar', 'CalendarPage'],
  audit: ['@/components/audit', 'AuditPage'],
  screening: ['@/components/screening', 'TenantScreeningPage'],
  compliance: ['@/components/compliance', 'CompliancePage'],
  workflows: ['@/components/workflows', 'WorkflowsPage'],
  portal: ['@/components/portal', 'PortalPage'],
  utilities: ['@/components/utilities', 'UtilitiesPage'],
  parking: ['@/components/parking', 'ParkingPage'],
  amenities: ['@/components/amenities', 'AmenitiesPage'],
  announcements: ['@/components/announcements', 'AnnouncementsPage'],
  surveys: ['@/components/surveys', 'SurveysPage'],
  smart_home: ['@/components/smart-home', 'SmartHomePage'],
  keys: ['@/components/keys', 'KeyManagementPage'],
  renewals: ['@/components/renewals', 'RenewalsPage'],
  late_fees: ['@/components/late-fees', 'LateFeesPage'],
  payment_plans: ['@/components/payment-plans', 'PaymentPlansPage'],
  energy: ['@/components/energy', 'EnergyPage'],
  visitors: ['@/components/visitors', 'VisitorsPage'],
  packages: ['@/components/packages', 'PackagesPage'],
  move_inout: ['@/components/move-inout', 'MoveInOutPage'],
  budget: ['@/components/budget', 'BudgetPage'],
  e_signatures: ['@/components/e-signatures', 'ESignaturesPage'],
  pets: ['@/components/pets', 'PetsPage'],
  disputes: ['@/components/disputes', 'DisputesPage'],
  assets: ['@/components/assets', 'AssetsPage'],
  market_intel: ['@/components/market-intel', 'MarketIntelPage'],
}

async function loadModule(moduleId: string): Promise<React.ComponentType | null> {
  const entry = moduleRegistry[moduleId]
  if (!entry) return null
  const [importPath, exportName] = entry
  try {
    // @ts-expect-error — dynamic string import
    const mod = await import(importPath)
    return mod[exportName] ?? null
  } catch {
    return null
  }
}

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
  Eye,
  Zap,
  X,
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
  UserCheck,
  Package,
  LogIn,
  PiggyBank,
  PenTool,
  PawPrint,
  AlertTriangle,
  Warehouse,
  Leaf,
} from 'lucide-react'

import { useAppStore } from '@/stores'
import { useAuthStore } from '@/stores/auth-store'

// ── Multi-tenant API helper ──────────────────────────────────────────────────
export function buildTenantApiUrl(path: string, clientId: string | null): string {
  if (!clientId) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}clientId=${clientId}`
}

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
    description: 'Enterprise command center with real-time insights',
    icon: LayoutDashboard,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Properties', value: '48', trend: '+3' },
      { label: 'Active Tenants', value: '156', trend: '+8' },
      { label: 'Occupancy Rate', value: '94%', trend: '+5%' },
      { label: 'Monthly Revenue', value: '$142.8K', trend: '+12%' },
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
    description: 'AI-powered insights and performance metrics across your portfolio',
    icon: BarChart3,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Revenue YTD', value: '$1.71M', trend: '+18%' },
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
      { label: 'Reports Generated', value: '48', trend: '+12' },
      { label: 'Invoices Sent', value: '36', trend: '+8' },
      { label: 'Total Revenue', value: '$512.4K', trend: '+22%' },
    ],
  },
  copilot: {
    id: 'copilot',
    label: 'AI Copilot',
    description: 'Your AI-powered rental management assistant',
    icon: Sparkles,
    color: 'text-tahoe-purple',
    bgColor: 'bg-tahoe-purple/10',
  },
  market_intel: {
    id: 'market_intel',
    label: 'Market Intelligence',
    description: 'AI-powered market analysis and comparables',
    icon: TrendingUp,
    color: 'text-tahoe-green',
    bgColor: 'bg-tahoe-green/10',
    stats: [
      { label: 'Avg Rent', value: '$2,450', trend: '+4.2%' },
      { label: 'Market Trend', value: '↑ Rising', trend: '+4.2%' },
      { label: 'Days on Market', value: '18', trend: '-3' },
      { label: 'Comparables', value: '24', trend: '+6' },
    ],
  },
  properties: {
    id: 'properties',
    label: 'Properties',
    description: 'Manage your property portfolio and units',
    icon: Building2,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    stats: [
      { label: 'Total Properties', value: '48', trend: '+3' },
      { label: 'Total Units', value: '312' },
      { label: 'Occupied', value: '294' },
      { label: 'Vacant', value: '18' },
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
      { label: 'Total Tenants', value: '156' },
      { label: 'Active Leases', value: '142' },
      { label: 'Expiring Soon', value: '8' },
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
      { label: 'Active Leases', value: '142' },
      { label: 'Expiring (30d)', value: '8' },
      { label: 'Expired', value: '2' },
    ],
  },
  screening: {
    id: 'screening',
    label: 'Tenant Screening',
    description: 'Background checks, credit reports & eviction history',
    icon: ShieldCheck,
    color: 'text-tahoe-blue',
    bgColor: 'bg-tahoe-blue/10',
    stats: [
      { label: 'Pending', value: '12' },
      { label: 'Approved', value: '284' },
      { label: 'Flagged', value: '8' },
      { label: 'Completion Rate', value: '94.2%' },
    ],
  },
  renewals: {
    id: 'renewals',
    label: 'Lease Renewals',
    description: 'Track & manage lease renewals',
    icon: Repeat,
    color: 'text-tahoe-purple',
    bgColor: 'bg-tahoe-purple/10',
    stats: [
      { label: 'Upcoming', value: '12' },
      { label: 'Sent', value: '5' },
      { label: 'Accepted', value: '4' },
      { label: 'Expired', value: '3' },
    ],
  },
  move_inout: {
    id: 'move_inout',
    label: 'Move In/Out',
    description: 'Manage tenant transitions with structured checklists',
    icon: LogIn,
    color: 'text-tahoe-purple',
    bgColor: 'bg-tahoe-purple/10',
    stats: [
      { label: 'Upcoming Move-Ins', value: '3' },
      { label: 'Pending Move-Outs', value: '2' },
      { label: 'In Progress', value: '1' },
      { label: 'Completed', value: '7' },
    ],
  },
  e_signatures: {
    id: 'e_signatures',
    label: 'E-Signatures',
    description: 'Track digital signatures and document execution',
    icon: PenTool,
    color: 'text-tahoe-pink',
    bgColor: 'bg-tahoe-pink/10',
    stats: [
      { label: 'Pending', value: '5' },
      { label: 'Completed', value: '42' },
      { label: 'Avg Turnaround', value: '1.8d' },
      { label: 'Expiring Soon', value: '2' },
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
      { label: 'Monthly Revenue', value: '$142.8K' },
      { label: 'Pending', value: '$18.5K' },
      { label: 'Overdue', value: '$4.2K' },
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
      { label: 'Total Revenue', value: '$1.71M' },
      { label: 'Net Income', value: '$1.08M' },
      { label: 'Accounts', value: '24' },
      { label: 'Transactions', value: '856' },
    ],
  },
  budget: {
    id: 'budget',
    label: 'Budget & Forecasting',
    description: 'Plan budgets, track spending, and forecast expenses',
    icon: PiggyBank,
    color: 'text-tahoe-teal',
    bgColor: 'bg-tahoe-teal/10',
    stats: [
      { label: 'Annual Budget', value: '$485K' },
      { label: 'Spent YTD', value: '$312K' },
      { label: 'Remaining', value: '$173K' },
      { label: 'Variance', value: '-3.2%' },
    ],
  },
  late_fees: {
    id: 'late_fees',
    label: 'Late Fees',
    description: 'Late fee configuration & tracking',
    icon: Receipt,
    color: 'text-tahoe-red',
    bgColor: 'bg-tahoe-red/10',
    stats: [
      { label: 'Active Configs', value: '6' },
      { label: 'Collected', value: '$685' },
      { label: 'Outstanding', value: '$405' },
      { label: 'Waived', value: '$120' },
    ],
  },
  payment_plans: {
    id: 'payment_plans',
    label: 'Payment Plans',
    description: 'Payment plans for overdue tenants',
    icon: Wallet,
    color: 'text-tahoe-green',
    bgColor: 'bg-tahoe-green/10',
    stats: [
      { label: 'Active Plans', value: '5' },
      { label: 'Enrolled', value: '12' },
      { label: 'Collection Rate', value: '68%' },
      { label: 'Avg Duration', value: '12 mo' },
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
      { label: 'Active Listings', value: '8' },
      { label: 'Total Applications', value: '24' },
      { label: 'Approval Rate', value: '42%' },
      { label: 'Avg. Days to Fill', value: '14' },
    ],
  },
  maintenance: {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Work orders, tickets, and maintenance scheduling',
    icon: Wrench,
    color: 'text-tahoe-orange',
    bgColor: 'bg-tahoe-orange/10',
    stats: [
      { label: 'Open Tickets', value: '12' },
      { label: 'In Progress', value: '8' },
      { label: 'Resolved', value: '42' },
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
      { label: 'Total Inspections', value: '18' },
      { label: 'Scheduled', value: '4' },
      { label: 'Completed', value: '12' },
      { label: 'Avg Rating', value: '4.3' },
    ],
    quickActions: [
      { label: 'Schedule Inspection', icon: ClipboardCheck },
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
      { label: 'Total Vendors', value: '18' },
      { label: 'Active', value: '15' },
      { label: 'Top Rated', value: '12' },
      { label: 'Total Spent', value: '$185.5K' },
    ],
  },
  assets: {
    id: 'assets',
    label: 'Asset Management',
    description: 'Track property assets, depreciation, and maintenance',
    icon: Warehouse,
    color: 'text-tahoe-blue',
    bgColor: 'bg-tahoe-blue/10',
    stats: [
      { label: 'Total Assets', value: '42' },
      { label: 'Total Value', value: '$285K' },
      { label: 'Depreciated', value: '$48K' },
      { label: 'Maintenance Due', value: '3' },
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
      { label: 'Active Policies', value: '8' },
      { label: 'Total Coverage', value: '$12.5M' },
      { label: 'Annual Premium', value: '$68.3K' },
      { label: 'Expiring Soon', value: '1' },
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
      { label: 'Upcoming Events', value: '12' },
      { label: 'This Week', value: '5' },
      { label: 'Showings', value: '3' },
    ],
  },
  communications: {
    id: 'communications',
    label: 'Communications',
    description: 'Messages, emails, and tenant communication',
    icon: MessageSquare,
    color: 'text-tahoe-teal',
    bgColor: 'bg-tahoe-teal/10',
    stats: [
      { label: 'Unread Messages', value: '8' },
      { label: 'Sent This Week', value: '24' },
    ],
  },
  compliance: {
    id: 'compliance',
    label: 'Compliance',
    description: 'Legal & regulatory compliance tracking',
    icon: Scale,
    color: 'text-tahoe-purple',
    bgColor: 'bg-tahoe-purple/10',
    stats: [
      { label: 'Active Rules', value: '36' },
      { label: 'Compliant', value: '32' },
      { label: 'Violations', value: '4' },
      { label: 'Upcoming Deadlines', value: '8' },
    ],
  },
  workflows: {
    id: 'workflows',
    label: 'Workflows',
    description: 'Automation workflows & triggers',
    icon: Zap,
    color: 'text-tahoe-teal',
    bgColor: 'bg-tahoe-teal/10',
    stats: [
      { label: 'Active', value: '12' },
      { label: 'Automations Run', value: '2.4K' },
      { label: 'Avg Response', value: '1.8s' },
      { label: 'Error Rate', value: '0.2%' },
    ],
  },
  energy: {
    id: 'energy',
    label: 'Energy Management',
    description: 'Monitor energy consumption, costs, and carbon footprint',
    icon: Leaf,
    color: 'text-tahoe-green',
    bgColor: 'bg-tahoe-green/10',
    stats: [
      { label: 'Monthly Cost', value: '$3,842' },
      { label: 'Avg/Unit', value: '$128' },
      { label: 'Carbon Footprint', value: '12.4t' },
      { label: 'Savings', value: '18%' },
    ],
  },
  utilities: {
    id: 'utilities',
    label: 'Utilities',
    description: 'Utility tracking & meter readings',
    icon: Zap,
    color: 'text-tahoe-orange',
    bgColor: 'bg-tahoe-orange/10',
    stats: [
      { label: 'Total Cost', value: '$2,416' },
      { label: 'Avg/Unit', value: '$116' },
      { label: 'Overdue', value: '3' },
    ],
  },
  visitors: {
    id: 'visitors',
    label: 'Visitor Management',
    description: 'Track visitors, check-ins, and access control',
    icon: UserCheck,
    color: 'text-tahoe-blue',
    bgColor: 'bg-tahoe-blue/10',
    stats: [
      { label: "Today's Visitors", value: '8' },
      { label: 'Expected', value: '3' },
      { label: 'Checked In', value: '5' },
      { label: 'Pending', value: '1' },
    ],
  },
  packages: {
    id: 'packages',
    label: 'Package Management',
    description: 'Track deliveries and pickups',
    icon: Package,
    color: 'text-tahoe-orange',
    bgColor: 'bg-tahoe-orange/10',
    stats: [
      { label: 'Pending Pickup', value: '12' },
      { label: 'Delivered Today', value: '8' },
      { label: 'Overdue', value: '3' },
      { label: 'This Month', value: '156' },
    ],
  },
  parking: {
    id: 'parking',
    label: 'Parking',
    description: 'Parking spot management & assignment',
    icon: Car,
    color: 'text-tahoe-blue',
    bgColor: 'bg-tahoe-blue/10',
    stats: [
      { label: 'Total Spots', value: '48' },
      { label: 'Assigned', value: '36' },
      { label: 'Available', value: '8' },
      { label: 'Reserved', value: '4' },
    ],
  },
  amenities: {
    id: 'amenities',
    label: 'Amenities',
    description: 'Amenity booking & management system',
    icon: Waves,
    color: 'text-tahoe-teal',
    bgColor: 'bg-tahoe-teal/10',
    stats: [
      { label: 'Amenities', value: '8' },
      { label: 'Bookings', value: '2,498' },
      { label: 'Utilization', value: '72%' },
      { label: 'Revenue', value: '$14,850' },
    ],
  },
  announcements: {
    id: 'announcements',
    label: 'Announcements',
    description: 'Building announcements & notifications',
    icon: Megaphone,
    color: 'text-tahoe-blue',
    bgColor: 'bg-tahoe-blue/10',
    stats: [
      { label: 'Active', value: '12' },
      { label: 'Total Views', value: '845' },
      { label: 'Acknowledged', value: '82%' },
      { label: 'Expiring', value: '3' },
    ],
  },
  surveys: {
    id: 'surveys',
    label: 'Surveys',
    description: 'Tenant satisfaction & feedback surveys',
    icon: ClipboardList,
    color: 'text-tahoe-orange',
    bgColor: 'bg-tahoe-orange/10',
    stats: [
      { label: 'Active', value: '4' },
      { label: 'Responses', value: '544' },
      { label: 'Avg Score', value: '4.2/5' },
      { label: 'Completion', value: '72%' },
    ],
  },
  pets: {
    id: 'pets',
    label: 'Pet Management',
    description: 'Pet registry, approvals, and policy compliance',
    icon: PawPrint,
    color: 'text-tahoe-orange',
    bgColor: 'bg-tahoe-orange/10',
    stats: [
      { label: 'Registered', value: '18' },
      { label: 'Dogs', value: '12' },
      { label: 'Cats', value: '5' },
      { label: 'Pending', value: '2' },
    ],
  },
  disputes: {
    id: 'disputes',
    label: 'Dispute Resolution',
    description: 'Track and resolve tenant disputes',
    icon: AlertTriangle,
    color: 'text-tahoe-red',
    bgColor: 'bg-tahoe-red/10',
    stats: [
      { label: 'Open', value: '4' },
      { label: 'Under Review', value: '2' },
      { label: 'Resolved', value: '18' },
      { label: 'Avg Resolution', value: '5.2d' },
    ],
  },
  smart_home: {
    id: 'smart_home',
    label: 'Smart Home',
    description: 'IoT & smart device integration',
    icon: HomeIcon,
    color: 'text-tahoe-green',
    bgColor: 'bg-tahoe-green/10',
    stats: [
      { label: 'Devices', value: '24' },
      { label: 'Online', value: '21' },
      { label: 'Alerts', value: '3' },
      { label: 'Energy Saved', value: '22%' },
    ],
  },
  keys: {
    id: 'keys',
    label: 'Key Management',
    description: 'Physical & digital key tracking',
    icon: Key,
    color: 'text-tahoe-blue',
    bgColor: 'bg-tahoe-blue/10',
    stats: [
      { label: 'Total Keys', value: '24' },
      { label: 'Assigned', value: '16' },
      { label: 'Available', value: '6' },
      { label: 'Overdue', value: '2' },
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
      { label: 'Active Clients', value: '8' },
      { label: 'MRR', value: '$4,792' },
      { label: 'Trial Clients', value: '2' },
    ],
  },
  owner_reports: {
    id: 'owner_reports',
    label: 'Owner Reports',
    description: 'Professional business reports with print and export capabilities',
    icon: BarChart3,
    color: 'text-tahoe-purple',
    bgColor: 'bg-tahoe-purple/10',
    stats: [
      { label: 'Report Types', value: '5' },
      { label: 'Total Revenue', value: '$61.2K' },
      { label: 'Utilization', value: '76.2%' },
      { label: 'Churn Rate', value: '4.2%' },
    ],
  },
  portal: {
    id: 'portal',
    label: 'Portal Settings',
    description: 'Tenant & owner portal configuration',
    icon: Globe,
    color: 'text-tahoe-pink',
    bgColor: 'bg-tahoe-pink/10',
    stats: [
      { label: 'Tenant Features', value: '5/6' },
      { label: 'Owner Features', value: '4/6' },
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
      { label: 'Total Devices', value: '12' },
      { label: 'Active', value: '8' },
      { label: 'Blocked', value: '2' },
      { label: 'Active Sessions', value: '10' },
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
      { label: 'Total Documents', value: '48' },
      { label: 'Recent Uploads', value: '6' },
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
      { label: 'Total Events', value: '856' },
      { label: 'Warnings', value: '12' },
      { label: 'Errors', value: '3' },
      { label: 'Critical', value: '1' },
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
            <Card key={stat.label} className="glass-card border-border/40 bg-card/80">
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
                className="tahoe-btn-glass inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
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
      <Card className="glass-card border-border/40">
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
  const [ModuleComponent, setModuleComponent] = React.useState<React.ComponentType | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    loadModule(moduleId).then((comp) => {
      if (!cancelled) {
        setModuleComponent(() => comp)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [moduleId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="size-5 animate-pulse" />
          <span className="text-sm">Loading module...</span>
        </div>
      </div>
    )
  }

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
    setCurrentWorkspace({
      id: 'ws-1',
      name: 'TenantFlow HQ',
      slug: 'tenantflow-hq',
    })

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
      {
        title: 'Package Delivered',
        message: 'Package for Unit 5A delivered to front desk — pending pickup',
        type: 'info',
      },
      {
        title: 'Visitor Checked In',
        message: 'John Smith checked in to visit Unit 12B',
        type: 'success',
      },
    ]

    const timers = demoNotifications.map((n, i) =>
      setTimeout(() => addNotification(n), i * 100)
    )
    return () => timers.forEach(clearTimeout)
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
    const handleLogout = () => {
      logout()
    }
    window.addEventListener('tenantflow:logout', handleLogout)
    return () => window.removeEventListener('tenantflow:logout', handleLogout)
  }, [logout])

  return null
}

// ── View Only Banner ────────────────────────────────────────────────────────

function ViewOnlyBanner() {
  const { isViewOnly, logout } = useAuthStore()
  const [dismissed, setDismissed] = React.useState(false)

  if (!isViewOnly || dismissed) return null

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex items-center justify-center gap-3 px-4 py-2 bg-amber-500/10 border-b border-amber-500/15"
    >
      <div className="flex items-center gap-2 text-[12px]">
        <Eye className="size-3.5 text-amber-600 dark:text-amber-400" />
        <span className="font-medium text-amber-700 dark:text-amber-300">Demo Mode — View Only</span>
        <span className="text-amber-600/60 dark:text-amber-400/50 hidden sm:inline">
          You can browse all features but cannot create, edit, or delete data.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-amber-600/40 hover:text-amber-600/70 transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const { activeModule } = useAppStore()
  const { isAuthenticated, currentUser, isViewOnly, loginMethod, logout } = useAuthStore()

  return (
    <AuthGate>
      <SidebarProvider>
        <AppInitializer />
        <LogoutHandler />
        <AppSidebar />

        <SidebarInset>
          <AppHeader />

          {/* View-only banner */}
          <ViewOnlyBanner />

          {/* User info bar — macOS subtitle bar style */}
          {isAuthenticated && currentUser && (
            <div className="flex items-center justify-between border-b border-border/30 px-5 py-1.5 bg-muted/20">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40">
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                    {currentUser.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <span className="font-medium text-foreground/80">{currentUser.name}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground/60">{currentUser.email}</span>
                {currentUser.clientId && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <Badge className="text-[9px] px-1.5 py-0 h-4 font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15" variant="outline">
                      {currentUser.clientId.slice(0, 8)}…
                    </Badge>
                  </>
                )}
                {isViewOnly && (
                  <Badge className="ml-1 text-[9px] px-1.5 py-0 h-4 font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20" variant="outline">
                    <Eye className="size-2.5 mr-0.5" />
                    VIEW ONLY
                  </Badge>
                )}
                {loginMethod === 'demo' && (
                  <Badge className="text-[9px] px-1.5 py-0 h-4 font-semibold bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:bg-violet-500/20" variant="outline">
                    <Zap className="size-2.5 mr-0.5" />
                    DEMO
                  </Badge>
                )}
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
