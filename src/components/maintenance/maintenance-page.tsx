'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle,
  Wrench,
  Plus,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import { useMaintenanceStore } from '@/stores'
import { getApiUrl } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { MaintenanceTicket } from '@/stores'

import { KanbanBoard } from './kanban-board'
import { TicketDetail } from './ticket-detail'
import { CreateTicketDialog } from './create-ticket-dialog'

// ── Summary card config ──────────────────────────────────────────────────────

interface SummaryCardDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  statusKey: string
}

const SUMMARY_CARDS: SummaryCardDef[] = [
  {
    key: 'open',
    label: 'Open Tickets',
    icon: AlertCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    statusKey: 'open',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: Clock,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-500/10',
    statusKey: 'in_progress',
  },
  {
    key: 'scheduled',
    label: 'Scheduled',
    icon: Calendar,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    statusKey: 'scheduled',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: CheckCircle,
    color: 'text-primary',
    bg: 'bg-primary/10',
    statusKey: 'resolved',
  },
]

// ── Priority display helpers ─────────────────────────────────────────────────

const PRIORITY_BADGE: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  low: { label: 'Low', color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' },
  medium: { label: 'Medium', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' },
  high: { label: 'High', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500' },
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  in_progress: { label: 'In Progress', color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  scheduled: { label: 'Scheduled', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  resolved: { label: 'Resolved', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
}

// ── Sort helpers ─────────────────────────────────────────────────────────────

type SortField = 'title' | 'category' | 'priority' | 'status' | 'createdAt' | 'dueDate'
type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

function sortTickets(tickets: MaintenanceTicket[], field: SortField, dir: SortDir): MaintenanceTicket[] {
  return [...tickets].sort((a, b) => {
    let cmp = 0
    switch (field) {
      case 'title':
        cmp = a.title.localeCompare(b.title)
        break
      case 'category':
        cmp = a.category.localeCompare(b.category)
        break
      case 'priority':
        cmp = (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2)
        break
      case 'status':
        cmp = a.status.localeCompare(b.status)
        break
      case 'createdAt':
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'dueDate':
        cmp = (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - (b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
        break
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

// ── Sort Icon (declared outside render) ─────────────────────────────────────

function SortIcon({ field, currentField, dir }: { field: SortField; currentField: SortField; dir: SortDir }) {
  if (currentField !== field) {
    return <ArrowUpDown className="size-3 text-muted-foreground/40" />
  }
  return dir === 'asc' ? (
    <ChevronUp className="size-3 text-primary" />
  ) : (
    <ChevronDown className="size-3 text-primary" />
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function MaintenancePage() {
  const { tickets, selectedTicket, isLoading, fetchTickets, selectTicket, clearSelection } =
    useMaintenanceStore()
  const { toast } = useToast()

  // View state
  const [viewMode, setViewMode] = React.useState<'kanban' | 'list'>('kanban')
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterCategory, setFilterCategory] = React.useState('all')
  const [filterPriority, setFilterPriority] = React.useState('all')
  const [sortField, setSortField] = React.useState<SortField>('createdAt')
  const [sortDir, setSortDir] = React.useState<SortDir>('desc')

  // Fetch data on mount
  React.useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Summary counts
  const summaryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { open: 0, in_progress: 0, scheduled: 0, resolved: 0 }
    for (const t of tickets) {
      if (counts[t.status] !== undefined) {
        counts[t.status]++
      }
    }
    return counts
  }, [tickets])

  // Filter + sort tickets for list view
  const filteredTickets = React.useMemo(() => {
    let result = tickets

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.property?.name?.toLowerCase().includes(q) ||
          t.tenant?.name?.toLowerCase().includes(q) ||
          t.assignedTo?.toLowerCase().includes(q)
      )
    }

    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory)
    }

    if (filterPriority !== 'all') {
      result = result.filter((t) => t.priority === filterPriority)
    }

    return sortTickets(result, sortField, sortDir)
  }, [tickets, searchQuery, filterCategory, filterPriority, sortField, sortDir])

  // Handle sort toggle
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  // Handle status change in detail view
  async function handleStatusChange(status: string) {
    if (!selectedTicket) return
    try {
      const updateData: Record<string, unknown> = { id: selectedTicket.id, status }
      if (status === 'resolved') {
        updateData.completedAt = new Date().toISOString()
      }
      const response = await fetch(getApiUrl('/api/maintenance'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      if (!response.ok) {
        throw new Error('Failed to update ticket status')
      }
      await fetchTickets()
      // Re-select the ticket to refresh its data
      selectTicket(selectedTicket.id)
      toast({
        title: 'Status Updated',
        description: `Ticket status changed to ${status.replace('_', ' ')}.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update ticket status',
        variant: 'destructive',
      })
    }
  }

  // Handle delete ticket
  async function handleDeleteTicket(ticketId: string) {
    try {
      const response = await fetch(getApiUrl('/api/maintenance'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete ticket')
      }
      await fetchTickets()
      toast({
        title: 'Ticket Deleted',
        description: 'The maintenance ticket has been deleted.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete ticket',
        variant: 'destructive',
      })
    }
  }

  // Format date for table
  function formatShortDate(dateStr: string | null): string {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // ── Detail View ──────────────────────────────────────────────────────────
  if (selectedTicket) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <TicketDetail
            ticket={selectedTicket}
            onBack={clearSelection}
            onStatusChange={handleStatusChange}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Main View ────────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10">
              <Wrench className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Maintenance</h1>
              <p className="text-sm text-muted-foreground">
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTickets()}
              disabled={isLoading}
            >
              <RefreshCw className={`size-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4 mr-1.5" />
              Create Ticket
            </Button>
            <div className="flex items-center rounded-lg border border-border/60 p-0.5">
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode('list')}
              >
                <List className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SUMMARY_CARDS.map((card, i) => {
            const CardIcon = card.icon
            const count = summaryCounts[card.statusKey] ?? 0
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="mojave-card border-border/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                          {isLoading ? (
                            <Skeleton className="h-7 w-8" />
                          ) : (
                            count
                          )}
                        </p>
                      </div>
                      <div className={`flex size-10 items-center justify-center rounded-xl ${card.bg}`}>
                        <CardIcon className={`size-5 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filter bar (for list view) */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[150px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="structural">Structural</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[130px] h-9">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* View Content */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-border/30">
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <Card className="mojave-card border-border/30">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-500/10 mb-4">
                <Wrench className="size-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Maintenance Tickets</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first maintenance ticket to start tracking work orders and requests.
              </p>
              <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="size-4 mr-1.5" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tickets={tickets}
            onTicketClick={(id) => selectTicket(id)}
          />
        ) : (
          /* List / Table View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mojave-card border-border/30 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[80px]">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('title')}
                        >
                          ID <SortIcon field="title" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('title')}
                        >
                          Title <SortIcon field="title" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('category')}
                        >
                          Category <SortIcon field="category" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('priority')}
                        >
                          Priority <SortIcon field="priority" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">Property</TableHead>
                      <TableHead className="hidden xl:table-cell">Tenant</TableHead>
                      <TableHead>
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('status')}
                        >
                          Status <SortIcon field="status" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('createdAt')}
                        >
                          Created <SortIcon field="createdAt" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="w-[40px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                          No tickets match your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => {
                        const priority = PRIORITY_BADGE[ticket.priority] ?? PRIORITY_BADGE.medium
                        const status = STATUS_BADGE[ticket.status] ?? STATUS_BADGE.open
                        return (
                          <TableRow
                            key={ticket.id}
                            className="cursor-pointer hover:bg-muted/40"
                            onClick={() => selectTicket(ticket.id)}
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              #{ticket.id.slice(-6).toUpperCase()}
                            </TableCell>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {ticket.title}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary" className="text-[11px] capitalize">
                                {ticket.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                variant="outline"
                                className={`text-[11px] gap-1 ${priority.bg} ${priority.color} border`}
                              >
                                <span className={`size-1.5 rounded-full ${priority.dot}`} />
                                {priority.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {ticket.property?.name ?? '—'}
                            </TableCell>
                            <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                              {ticket.tenant?.name ?? '—'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[11px] ${status.bg} ${status.color} border`}
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {ticket.assignedTo ?? '—'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {formatShortDate(ticket.createdAt)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => selectTicket(ticket.id)}>
                                    <Eye className="size-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Pencil className="size-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 dark:text-red-400"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteTicket(ticket.id)
                                    }}
                                  >
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Create ticket dialog */}
        <CreateTicketDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </motion.div>
    </AnimatePresence>
  )
}
