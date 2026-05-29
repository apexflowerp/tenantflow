'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Clock, Calendar, CheckCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { TicketCard } from './ticket-card'
import type { MaintenanceTicket } from '@/stores'

// ── Column config ────────────────────────────────────────────────────────────

interface ColumnDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  headerColor: string
  headerBg: string
  columnBg: string
  emptyMessage: string
}

const COLUMNS: ColumnDef[] = [
  {
    key: 'open',
    label: 'Open',
    icon: AlertCircle,
    headerColor: 'text-amber-600 dark:text-amber-400',
    headerBg: 'bg-amber-500/10',
    columnBg: 'bg-amber-500/[0.03] dark:bg-amber-500/[0.04]',
    emptyMessage: 'No open tickets',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: Clock,
    headerColor: 'text-teal-600 dark:text-teal-400',
    headerBg: 'bg-teal-500/10',
    columnBg: 'bg-teal-500/[0.03] dark:bg-teal-500/[0.04]',
    emptyMessage: 'No tickets in progress',
  },
  {
    key: 'scheduled',
    label: 'Scheduled',
    icon: Calendar,
    headerColor: 'text-purple-600 dark:text-purple-400',
    headerBg: 'bg-purple-500/10',
    columnBg: 'bg-purple-500/[0.03] dark:bg-purple-500/[0.04]',
    emptyMessage: 'No scheduled tickets',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: CheckCircle,
    headerColor: 'text-emerald-600 dark:text-emerald-400',
    headerBg: 'bg-emerald-500/10',
    columnBg: 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04]',
    emptyMessage: 'No resolved tickets',
  },
]

// ── Component ────────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  tickets: MaintenanceTicket[]
  onTicketClick: (id: string) => void
}

export function KanbanBoard({ tickets, onTicketClick }: KanbanBoardProps) {
  // Group tickets by status
  const grouped = React.useMemo(() => {
    const map: Record<string, MaintenanceTicket[]> = {}
    for (const col of COLUMNS) {
      map[col.key] = []
    }
    for (const ticket of tickets) {
      const status = ticket.status
      if (map[status]) {
        map[status].push(ticket)
      } else {
        // Fallback: put unknown statuses in 'open'
        map['open'].push(ticket)
      }
    }
    return map
  }, [tickets])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-18rem)] min-h-[400px]">
      {COLUMNS.map((col) => {
        const ColIcon = col.icon
        const colTickets = grouped[col.key] ?? []

        return (
          <motion.div
            key={col.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col rounded-xl border border-border/40 ${col.columnBg}`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className={`flex size-6 items-center justify-center rounded-md ${col.headerBg}`}>
                  <ColIcon className={`size-3.5 ${col.headerColor}`} />
                </div>
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
              </div>
              <Badge variant="secondary" className="text-[11px] h-5 px-1.5">
                {colTickets.length}
              </Badge>
            </div>

            {/* Ticket cards */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {colTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className={`flex size-10 items-center justify-center rounded-full ${col.headerBg} mb-2`}>
                      <ColIcon className={`size-4 ${col.headerColor}`} />
                    </div>
                    <p className="text-xs text-muted-foreground">{col.emptyMessage}</p>
                  </div>
                ) : (
                  colTickets.map((ticket, i) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      index={i}
                      onClick={() => onTicketClick(ticket.id)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )
      })}
    </div>
  )
}
