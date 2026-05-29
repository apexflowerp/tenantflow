'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Wrench,
  Zap,
  Wind,
  BrickWall,
  Cog,
  Building2,
  User,
  Calendar,
  Clock,
  Tag,
  AlertTriangle,
  MessageSquare,
  UserPlus,
  Play,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { MaintenanceTicket } from '@/stores'

// ── Config maps ──────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  plumbing: { label: 'Plumbing', icon: Wrench, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10' },
  electrical: { label: 'Electrical', icon: Zap, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  hvac: { label: 'HVAC', icon: Wind, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
  structural: { label: 'Structural', icon: BrickWall, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
  general: { label: 'General', icon: Cog, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-500/10' },
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: 'Open', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  in_progress: { label: 'In Progress', color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  scheduled: { label: 'Scheduled', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  resolved: { label: 'Resolved', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  low: { label: 'Low', color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' },
  medium: { label: 'Medium', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' },
  high: { label: 'High', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500' },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// ── Placeholder timeline data ────────────────────────────────────────────────

const PLACEHOLDER_TIMELINE = [
  { type: 'created', label: 'Ticket Created', time: '2 days ago', icon: Clock },
  { type: 'assigned', label: 'Assigned to maintenance team', time: '1 day ago', icon: UserPlus },
  { type: 'update', label: 'Status updated to In Progress', time: '18 hours ago', icon: Play },
  { type: 'note', label: 'Note added: "Ordered replacement parts"', time: '6 hours ago', icon: MessageSquare },
]

// ── Component ────────────────────────────────────────────────────────────────

interface TicketDetailProps {
  ticket: MaintenanceTicket
  onBack: () => void
  onStatusChange?: (status: string) => void
}

export function TicketDetail({ ticket, onBack, onStatusChange }: TicketDetailProps) {
  const cat = CATEGORY_CONFIG[ticket.category] ?? CATEGORY_CONFIG.general
  const status = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open
  const priority = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.medium
  const CatIcon = cat.icon

  // Determine available next statuses
  const nextStatuses: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = []
  if (ticket.status === 'open') {
    nextStatuses.push({ key: 'in_progress', label: 'Start Progress', icon: Play })
    nextStatuses.push({ key: 'scheduled', label: 'Schedule', icon: CalendarClock })
  }
  if (ticket.status === 'in_progress') {
    nextStatuses.push({ key: 'scheduled', label: 'Schedule', icon: CalendarClock })
    nextStatuses.push({ key: 'resolved', label: 'Resolve', icon: CheckCircle2 })
  }
  if (ticket.status === 'scheduled') {
    nextStatuses.push({ key: 'in_progress', label: 'Start Progress', icon: Play })
    nextStatuses.push({ key: 'resolved', label: 'Resolve', icon: CheckCircle2 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit -ml-2">
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
              {ticket.title}
            </h1>
            <Badge variant="outline" className={`${status.bg} ${status.color} border text-xs`}>
              {status.label}
            </Badge>
            <Badge variant="outline" className={`${priority.bg} ${priority.color} border text-xs gap-1`}>
              <span className={`size-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="secondary" className={`text-xs gap-1 ${cat.bg} ${cat.color} border-0`}>
              <CatIcon className="size-3" />
              {cat.label}
            </Badge>
            <span className="text-xs text-muted-foreground">#{ticket.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-border/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {ticket.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Activity / Timeline */}
          <Card className="border-border/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {PLACEHOLDER_TIMELINE.map((item, i) => {
                  const TimelineIcon = item.icon
                  const isLast = i === PLACEHOLDER_TIMELINE.length - 1
                  return (
                    <div key={i} className="flex gap-3 pb-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/60">
                          <TimelineIcon className="size-3.5 text-muted-foreground" />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 bg-border/60 my-1" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info grid */}
          <Card className="border-border/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property */}
              <div className="flex items-start gap-3">
                <Building2 className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Property</p>
                  <p className="text-sm font-medium text-foreground">
                    {ticket.property?.name ?? '—'}
                  </p>
                  {ticket.property?.address && (
                    <p className="text-xs text-muted-foreground">{ticket.property.address}</p>
                  )}
                </div>
              </div>

              {/* Tenant */}
              <div className="flex items-start gap-3">
                <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Tenant</p>
                  <p className="text-sm font-medium text-foreground">
                    {ticket.tenant?.name ?? 'Unassigned'}
                  </p>
                  {ticket.tenant?.email && (
                    <p className="text-xs text-muted-foreground">{ticket.tenant.email}</p>
                  )}
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Category */}
              <div className="flex items-start gap-3">
                <Tag className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <Badge variant="secondary" className={`text-xs gap-1 mt-0.5 ${cat.bg} ${cat.color} border-0`}>
                    <CatIcon className="size-3" />
                    {cat.label}
                  </Badge>
                </div>
              </div>

              {/* Assigned to */}
              <div className="flex items-start gap-3">
                <UserPlus className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="text-sm font-medium text-foreground">
                    {ticket.assignedTo ?? 'Unassigned'}
                  </p>
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Created */}
              <div className="flex items-start gap-3">
                <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium text-foreground">{formatDateTime(ticket.createdAt)}</p>
                </div>
              </div>

              {/* Due date */}
              <div className="flex items-start gap-3">
                <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(ticket.dueDate)}</p>
                </div>
              </div>

              {/* Completed */}
              {ticket.completedAt && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-sm font-medium text-foreground">{formatDateTime(ticket.completedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <Card className="border-border/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nextStatuses.map((ns) => {
                const NextIcon = ns.icon
                return (
                  <Button
                    key={ns.key}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    size="sm"
                    onClick={() => onStatusChange?.(ns.key)}
                  >
                    <NextIcon className="size-4" />
                    {ns.label}
                  </Button>
                )
              })}
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <UserPlus className="size-4" />
                Assign
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <MessageSquare className="size-4" />
                Add Note
              </Button>
              {ticket.priority !== 'critical' && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  size="sm"
                >
                  <AlertTriangle className="size-4" />
                  Escalate Priority
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
