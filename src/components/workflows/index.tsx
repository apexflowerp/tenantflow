'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Play,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Download,
  FileText,
  Bell,
  Wrench,
  DollarSign,
  LogIn,
  MoreHorizontal,
  RefreshCw,
  Timer,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

type WorkflowType = 'lease_renewal' | 'rent_reminder' | 'maintenance_auto' | 'late_fee' | 'move_in_out'

interface WorkflowStep {
  name: string
  description: string
}

interface Workflow {
  id: string
  name: string
  type: WorkflowType
  description: string
  trigger: string
  steps: WorkflowStep[]
  stepsCount: number
  active: boolean
  lastRun: string
  runsCount: number
  avgResponseTime: string
  errorRate: number
  successRate: number
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const WORKFLOWS: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Lease Renewal',
    type: 'lease_renewal',
    description: 'Automatically sends renewal notices 60 days before lease expiry, tracks tenant responses, and escalates to property manager if no response within 14 days.',
    trigger: 'Lease expiry in 60 days',
    steps: [
      { name: 'Generate renewal offer', description: 'Create personalized renewal terms based on market rates' },
      { name: 'Send notice to tenant', description: 'Email + portal notification with renewal terms' },
      { name: 'Wait for response', description: '14-day response window with reminders at day 7 and day 12' },
      { name: 'Process response', description: 'Route acceptance to lease generation or flag for follow-up' },
      { name: 'Update lease records', description: 'Auto-update lease dates, rent amounts, and portal access' },
    ],
    stepsCount: 5,
    active: true,
    lastRun: '2 hours ago',
    runsCount: 342,
    avgResponseTime: '1.2s',
    errorRate: 0.3,
    successRate: 98.5,
  },
  {
    id: 'WF-002',
    name: 'Rent Reminder',
    type: 'rent_reminder',
    description: 'Sends automated rent reminders 5 days before due date, on the due date, and 3 days after if payment is missing. Integrates with payment portal for one-click payment.',
    trigger: 'Rent due date approaching',
    steps: [
      { name: '5-day reminder', description: 'Friendly reminder with payment link and amount' },
      { name: 'Due date notification', description: 'Payment due today with direct payment link' },
      { name: '3-day past due alert', description: 'Late notice with late fee warning and payment link' },
    ],
    stepsCount: 3,
    active: true,
    lastRun: '30 minutes ago',
    runsCount: 1280,
    avgResponseTime: '0.8s',
    errorRate: 0.1,
    successRate: 99.7,
  },
  {
    id: 'WF-003',
    name: 'Maintenance Auto-assign',
    type: 'maintenance_auto',
    description: 'Routes incoming maintenance tickets to available contractors based on category, location, and skill set. Auto-escalates urgent tickets and tracks response times.',
    trigger: 'New maintenance ticket created',
    steps: [
      { name: 'Classify ticket', description: 'AI categorizes by urgency, trade type, and location' },
      { name: 'Match contractor', description: 'Find best available contractor by skill, proximity, rating' },
      { name: 'Send assignment', description: 'Notify contractor with ticket details and SLA expectations' },
      { name: 'Track acceptance', description: 'Monitor response and auto-reassign if not accepted in 2hrs' },
    ],
    stepsCount: 4,
    active: true,
    lastRun: '1 hour ago',
    runsCount: 256,
    avgResponseTime: '2.1s',
    errorRate: 1.2,
    successRate: 94.8,
  },
  {
    id: 'WF-004',
    name: 'Late Fee',
    type: 'late_fee',
    description: 'Automatically calculates and applies late fees after the grace period ends. Generates invoices, sends notifications, and tracks fee collection status.',
    trigger: 'Grace period expired',
    steps: [
      { name: 'Calculate late fee', description: 'Apply configured rate (flat or percentage) to outstanding balance' },
      { name: 'Generate invoice', description: 'Create late fee invoice and attach to tenant account' },
      { name: 'Send notification', description: 'Email + portal notification with fee breakdown and payment link' },
    ],
    stepsCount: 3,
    active: true,
    lastRun: '6 hours ago',
    runsCount: 89,
    avgResponseTime: '1.5s',
    errorRate: 0.5,
    successRate: 97.2,
  },
  {
    id: 'WF-005',
    name: 'Move-in/Move-out',
    type: 'move_in_out',
    description: 'Orchestrates the complete move-in and move-out process including key handover scheduling, inspection coordination, deposit tracking, and unit turnover management.',
    trigger: 'Lease start or end date',
    steps: [
      { name: 'Generate checklist', description: 'Create move-in or move-out checklist based on unit type' },
      { name: 'Schedule inspection', description: 'Book pre-move-in or post-move-out inspection with staff' },
      { name: 'Coordinate key handover', description: 'Schedule key pickup/drop-off and update access codes' },
      { name: 'Process deposit', description: 'Calculate security deposit return or charges with itemized list' },
      { name: 'Update unit status', description: 'Mark unit as occupied/vacant and trigger turnover if needed' },
      { name: 'Send welcome/exit package', description: 'Deliver welcome guide or move-out confirmation with details' },
      { name: 'Archive records', description: 'Store all documents, photos, and inspection reports' },
    ],
    stepsCount: 7,
    active: true,
    lastRun: '1 day ago',
    runsCount: 48,
    avgResponseTime: '3.4s',
    errorRate: 2.1,
    successRate: 91.3,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getWorkflowIconStyle(type: WorkflowType): { color: string; bg: string; gradient: string } {
  const map: Record<WorkflowType, { color: string; bg: string; gradient: string }> = {
    lease_renewal: { color: 'text-tahoe-blue', bg: 'bg-tahoe-blue/10', gradient: 'from-tahoe-blue/20 to-tahoe-blue/5' },
    rent_reminder: { color: 'text-tahoe-orange', bg: 'bg-tahoe-orange/10', gradient: 'from-tahoe-orange/20 to-tahoe-orange/5' },
    maintenance_auto: { color: 'text-tahoe-teal', bg: 'bg-tahoe-teal/10', gradient: 'from-tahoe-teal/20 to-tahoe-teal/5' },
    late_fee: { color: 'text-tahoe-red', bg: 'bg-tahoe-red/10', gradient: 'from-tahoe-red/20 to-tahoe-red/5' },
    move_in_out: { color: 'text-tahoe-purple', bg: 'bg-tahoe-purple/10', gradient: 'from-tahoe-purple/20 to-tahoe-purple/5' },
  }
  return map[type]
}

function getTypeLabel(type: WorkflowType): string {
  const map: Record<WorkflowType, string> = {
    lease_renewal: 'Lease Renewal',
    rent_reminder: 'Rent Reminder',
    maintenance_auto: 'Maintenance',
    late_fee: 'Late Fee',
    move_in_out: 'Move In/Out',
  }
  return map[type]
}

// ── Stat Card Component ────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  delay,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="glass-card tahoe-hover rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0">
              <p className="tahoe-overline">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              <p className="tahoe-caption">{subtitle}</p>
            </div>
            <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', iconBg)}>
              <Icon className={cn('size-5', iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Workflow Card Component ────────────────────────────────────────────────────

function WorkflowCard({
  workflow,
  index,
  onToggle,
}: {
  workflow: Workflow
  index: number
  onToggle: (id: string) => void
}) {
  const iconStyle = getWorkflowIconStyle(workflow.type)

  const renderIcon = () => {
    switch (workflow.type) {
      case 'lease_renewal': return <FileText className={cn('size-5', iconStyle.color)} />
      case 'rent_reminder': return <Bell className={cn('size-5', iconStyle.color)} />
      case 'maintenance_auto': return <Wrench className={cn('size-5', iconStyle.color)} />
      case 'late_fee': return <DollarSign className={cn('size-5', iconStyle.color)} />
      case 'move_in_out': return <LogIn className={cn('size-5', iconStyle.color)} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className={cn(
        'glass-card tahoe-hover rounded-2xl overflow-hidden tahoe-transition',
        !workflow.active && 'opacity-50'
      )}>
        <CardContent className="p-5 space-y-4">
          {/* Top Row: Icon + Name + Toggle */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl',
                iconStyle.bg
              )}>
                {renderIcon()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{workflow.name}</p>
                <p className="text-[11px] text-muted-foreground">{getTypeLabel(workflow.type)}</p>
              </div>
            </div>
            <Switch
              checked={workflow.active}
              onCheckedChange={() => onToggle(workflow.id)}
              className="data-[state=checked]:bg-tahoe-green"
            />
          </div>

          {/* Description */}
          <p className="tahoe-caption line-clamp-2">{workflow.description}</p>

          {/* Trigger */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40">
            <Zap className={cn('size-3.5 shrink-0', iconStyle.color)} />
            <span className="text-[11px] text-muted-foreground truncate">
              <span className="font-medium text-foreground/70">Trigger:</span> {workflow.trigger}
            </span>
          </div>

          {/* Steps Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="tahoe-overline">Workflow Steps</span>
              <span className={cn('text-sm font-bold', iconStyle.color)}>
                {workflow.stepsCount}
              </span>
            </div>
            {/* Step progress dots */}
            <div className="flex items-center gap-1">
              {Array.from({ length: workflow.stepsCount }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full tahoe-transition',
                    i === 0 ? 'w-4' : 'flex-1',
                    workflow.active
                      ? cn(i === 0 ? iconStyle.bg : 'bg-muted/60')
                      : 'bg-muted/40'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/30">
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">{workflow.runsCount}</p>
              <p className="text-[10px] text-muted-foreground">Runs</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">{workflow.avgResponseTime}</p>
              <p className="text-[10px] text-muted-foreground">Avg Time</p>
            </div>
            <div className="text-center">
              <p className={cn(
                'text-sm font-bold',
                workflow.errorRate > 1 ? 'text-tahoe-red' : 'text-tahoe-green'
              )}>
                {workflow.errorRate}%
              </p>
              <p className="text-[10px] text-muted-foreground">Errors</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              <span>Last run: {workflow.lastRun}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                <Play className="size-3.5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                <MoreHorizontal className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [workflows, setWorkflows] = React.useState(WORKFLOWS)
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all')

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    )
  }

  const filteredWorkflows = workflows.filter((w) => {
    const matchSearch =
      !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trigger.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && w.active) ||
      (statusFilter === 'inactive' && !w.active)
    return matchSearch && matchStatus
  })

  const activeWorkflows = workflows.filter((w) => w.active).length
  const totalRuns = workflows.reduce((sum, w) => sum + w.runsCount, 0)
  const activeWfs = workflows.filter((w) => w.active)
  const avgResponse =
    activeWfs.length > 0
      ? activeWfs.reduce((sum, w) => sum + parseFloat(w.avgResponseTime), 0) / activeWfs.length
      : 0
  const avgError =
    activeWfs.length > 0
      ? activeWfs.reduce((sum, w) => sum + w.errorRate, 0) / activeWfs.length
      : 0

  const stats = [
    {
      title: 'Active',
      value: String(activeWorkflows),
      subtitle: `of ${workflows.length} total workflows`,
      icon: Zap,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Automations Run',
      value: '1.2K',
      subtitle: 'Total executions this month',
      icon: Play,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Avg Response',
      value: '2.4s',
      subtitle: 'Across active workflows',
      icon: Timer,
      iconColor: 'text-tahoe-purple',
      iconBg: 'bg-tahoe-purple/10',
    },
    {
      title: 'Error Rate',
      value: '0.3%',
      subtitle: 'Last 30 days average',
      icon: AlertTriangle,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-teal/10">
            <Zap className="size-6 text-tahoe-teal" />
          </div>
          <div>
            <h1 className="tahoe-title">Workflows</h1>
            <p className="tahoe-caption mt-1">Automation workflows & triggers</p>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button variant="outline" size="sm" className="gap-2 rounded-xl glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl glass-input border-0">
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary rounded-xl">
            <Plus className="size-3.5" />
            New Workflow
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Search & Filter ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm glass-input border-0 rounded-lg"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as 'all' | 'active' | 'inactive')}
        >
          <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* ── Workflow Cards Grid ────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredWorkflows.map((workflow, i) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              index={i}
              onToggle={toggleWorkflow}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredWorkflows.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-teal/10 mb-4">
            <Zap className="size-8 text-tahoe-teal/40" />
          </div>
          <h3 className="tahoe-headline text-muted-foreground">No workflows found</h3>
          <p className="tahoe-caption mt-1 max-w-sm">
            Try adjusting your search or filter criteria to find what you&apos;re looking for.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
