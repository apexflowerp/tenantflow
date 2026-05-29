'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Wrench,
  Zap,
  Wind,
  BrickWall,
  Cog,
  GripVertical,
  Clock,
  Calendar,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { MaintenanceTicket } from '@/stores'

// ── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  plumbing: {
    label: 'Plumbing',
    icon: Wrench,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10',
  },
  electrical: {
    label: 'Electrical',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
  },
  hvac: {
    label: 'HVAC',
    icon: Wind,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-500/10',
  },
  structural: {
    label: 'Structural',
    icon: BrickWall,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10',
  },
  general: {
    label: 'General',
    icon: Cog,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-500/10',
  },
}

// ── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-gray-400',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Component ────────────────────────────────────────────────────────────────

interface TicketCardProps {
  ticket: MaintenanceTicket
  index?: number
  onClick?: () => void
}

export function TicketCard({ ticket, index = 0, onClick }: TicketCardProps) {
  const cat = CATEGORY_CONFIG[ticket.category] ?? CATEGORY_CONFIG.general
  const CatIcon = cat.icon
  const priorityDot = PRIORITY_DOT[ticket.priority] ?? PRIORITY_DOT.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Card
        className="cursor-pointer border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md group"
        onClick={onClick}
      >
        <CardContent className="p-3 space-y-2.5">
          {/* Top row: drag handle + priority dot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="size-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
              <span
                className={`inline-block size-2 rounded-full ${priorityDot}`}
                title={PRIORITY_LABEL[ticket.priority] ?? ticket.priority}
              />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {PRIORITY_LABEL[ticket.priority] ?? ticket.priority}
              </span>
            </div>
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 py-0 h-5 gap-1 ${cat.bg} ${cat.color} border-0`}
            >
              <CatIcon className="size-3" />
              {cat.label}
            </Badge>
          </div>

          {/* Title */}
          <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
            {ticket.title}
          </p>

          {/* Property & Tenant */}
          <div className="space-y-1 text-xs text-muted-foreground">
            {ticket.property && (
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{ticket.property.name}</span>
              </div>
            )}
            {ticket.tenant && (
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-violet-500 shrink-0" />
                <span className="truncate">{ticket.tenant.name}</span>
              </div>
            )}
          </div>

          {/* Footer: dates + assigned */}
          <div className="flex items-center justify-between pt-1 border-t border-border/40">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Clock className="size-3" />
                {formatDate(ticket.createdAt)}
              </span>
              {ticket.dueDate && (
                <span className="flex items-center gap-0.5">
                  <Calendar className="size-3" />
                  {formatDate(ticket.dueDate)}
                </span>
              )}
            </div>
            {ticket.assignedTo && (
              <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <User className="size-3" />
                {ticket.assignedTo}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
