'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone,
  Eye,
  Bell,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Pin,
  PinOff,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type Priority = 'urgent' | 'high' | 'normal' | 'low'

interface Announcement {
  id: string
  title: string
  message: string
  priority: Priority
  property: string
  date: string
  readCount: number
  totalTenants: number
  isPinned: boolean
  expiresAt: string | null
  author: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'an-001', title: 'Emergency Water Shutdown', message: 'Water will be temporarily shut off on June 18th from 9 AM to 2 PM for emergency pipe repairs. Please store water accordingly.', priority: 'urgent', property: 'Skyline Tower', date: '2025-06-15', readCount: 42, totalTenants: 48, isPinned: true, expiresAt: '2025-06-20', author: 'Property Manager' },
  { id: 'an-002', title: 'Annual Fire Drill Scheduled', message: 'The annual fire drill is scheduled for June 25th at 10 AM. All tenants must participate. Please review evacuation routes.', priority: 'high', property: 'All Properties', date: '2025-06-14', readCount: 85, totalTenants: 120, isPinned: true, expiresAt: '2025-06-26', author: 'Safety Officer' },
  { id: 'an-003', title: 'New Parking Regulations', message: 'Starting July 1st, all parking spots must display valid permits. Visitor parking limited to 4 hours. Violators will be towed.', priority: 'high', property: 'Harbor View Residences', date: '2025-06-12', readCount: 30, totalTenants: 36, isPinned: false, expiresAt: '2025-07-31', author: 'Property Manager' },
  { id: 'an-004', title: 'Pool Season Opening', message: 'The swimming pool is now open for the season! Hours: 6 AM - 10 PM daily. Guest passes available at the front desk.', priority: 'normal', property: 'Greenfield Gardens', date: '2025-06-10', readCount: 22, totalTenants: 28, isPinned: false, expiresAt: null, author: 'Community Manager' },
  { id: 'an-005', title: 'Elevator Maintenance Notice', message: 'Elevator #2 will undergo scheduled maintenance on June 20th. Please use Elevator #1 or the stairs during this time.', priority: 'normal', property: 'Skyline Tower', date: '2025-06-09', readCount: 38, totalTenants: 48, isPinned: false, expiresAt: '2025-06-21', author: 'Maintenance Team' },
  { id: 'an-006', title: 'Community BBQ Event', message: 'Join us for a community BBQ on July 4th at the rooftop terrace! Food, drinks, and fun for all residents. RSVP by June 28th.', priority: 'low', property: 'Metro Commercial Hub', date: '2025-06-08', readCount: 15, totalTenants: 24, isPinned: false, expiresAt: '2025-07-05', author: 'Events Committee' },
  { id: 'an-007', title: 'Rent Payment Reminder', message: 'Monthly rent is due on July 1st. Please ensure payments are made on time to avoid late fees. Online payments available.', priority: 'low', property: 'All Properties', date: '2025-06-07', readCount: 95, totalTenants: 120, isPinned: false, expiresAt: '2025-07-05', author: 'Billing Department' },
  { id: 'an-008', title: 'Package Delivery System Update', message: 'New smart lockers installed in the lobby. You will receive a code via SMS when packages arrive. Old lockers will be removed June 30th.', priority: 'normal', property: 'Oakwood Estates', date: '2025-06-06', readCount: 18, totalTenants: 20, isPinned: false, expiresAt: null, author: 'Property Manager' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPriorityBadge(priority: Priority): string {
  const map: Record<Priority, string> = {
    urgent: 'tahoe-badge tahoe-badge-red',
    high: 'tahoe-badge tahoe-badge-orange',
    normal: 'tahoe-badge tahoe-badge-blue',
    low: 'tahoe-badge tahoe-badge-green',
  }
  return map[priority]
}

function getPriorityIcon(priority: Priority) {
  const map: Record<Priority, React.ReactNode> = {
    urgent: <AlertTriangle className="size-3.5 text-tahoe-red" />,
    high: <Bell className="size-3.5 text-tahoe-orange" />,
    normal: <Megaphone className="size-3.5 text-tahoe-blue" />,
    low: <Clock className="size-3.5 text-tahoe-green" />,
  }
  return map[priority]
}

function getPriorityBorder(priority: Priority): string {
  const map: Record<Priority, string> = {
    urgent: 'border-l-tahoe-red',
    high: 'border-l-tahoe-orange',
    normal: 'border-l-tahoe-blue',
    low: 'border-l-tahoe-green',
  }
  return map[priority]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState(INITIAL_ANNOUNCEMENTS)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | 'all'>('all')

  const activeAnnouncements = announcements.length
  const totalViews = announcements.reduce((sum, a) => sum + a.readCount, 0)
  const acknowledged = announcements.reduce((sum, a) => sum + a.readCount, 0)
  const expiringSoon = announcements.filter(a => {
    if (!a.expiresAt) return false
    const days = Math.ceil((new Date(a.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days <= 7 && days > 0
  }).length

  const togglePin = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a))
  }

  const filteredAnnouncements = announcements.filter(a => {
    const matchSearch = !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPriority = priorityFilter === 'all' || a.priority === priorityFilter
    return matchSearch && matchPriority
  })

  // Sort: pinned first, then by priority
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const stats = [
    { title: 'Active Announcements', value: String(activeAnnouncements), subtitle: 'Currently published', icon: Megaphone, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Total Views', value: totalViews.toLocaleString(), subtitle: 'All announcements', icon: Eye, iconColor: 'text-tahoe-purple', iconBg: 'bg-tahoe-purple/10' },
    { title: 'Acknowledged', value: `${Math.round((acknowledged / (announcements.reduce((s, a) => s + a.totalTenants, 0) || 1)) * 100)}%`, subtitle: 'Read rate', icon: CheckCircle2, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Expiring Soon', value: String(expiringSoon), subtitle: 'Within 7 days', icon: Clock, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-blue/10">
            <Megaphone className="size-6 text-tahoe-blue" />
          </div>
          <div>
            <h1 className="tahoe-title">Announcements</h1>
            <p className="tahoe-caption mt-1">Building announcements & notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="glass-card tahoe-hover overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <p className="tahoe-overline">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                    <p className="tahoe-caption">{stat.subtitle}</p>
                  </div>
                  <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', stat.iconBg)}>
                    <stat.icon className={cn('size-5', stat.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Search announcements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm glass-input border-0" />
        </div>
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
            className="h-9 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Announcement Cards */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {sortedAnnouncements.map((announcement, i) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card className={cn(
                'glass-card overflow-hidden border-l-4',
                getPriorityBorder(announcement.priority),
                announcement.isPinned && 'ring-1 ring-tahoe-blue/20'
              )}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getPriorityIcon(announcement.priority)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                            {announcement.isPinned && (
                              <Pin className="size-3 text-tahoe-blue fill-tahoe-blue" />
                            )}
                          </div>
                          <p className="tahoe-caption mt-1 line-clamp-2">{announcement.message}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePin(announcement.id)}
                          className="shrink-0 h-7 w-7 p-0"
                        >
                          {announcement.isPinned ? (
                            <PinOff className="size-3.5 text-tahoe-blue" />
                          ) : (
                            <Pin className="size-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className={getPriorityBadge(announcement.priority)}>{announcement.priority}</span>
                        <span className="text-muted-foreground">{announcement.property}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{announcement.date}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="size-3" />{announcement.readCount}/{announcement.totalTenants}
                        </span>
                        {announcement.expiresAt && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-tahoe-orange">Expires {announcement.expiresAt}</span>
                          </>
                        )}
                      </div>

                      {/* Read progress */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn('h-full rounded-full tahoe-transition', announcement.readCount / announcement.totalTenants >= 0.8 ? 'bg-tahoe-green' : 'bg-tahoe-blue')}
                            style={{ width: `${(announcement.readCount / announcement.totalTenants) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{Math.round((announcement.readCount / announcement.totalTenants) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedAnnouncements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="size-10 text-muted-foreground/40 mb-3" />
          <p className="tahoe-body text-muted-foreground">No announcements match your filters</p>
        </div>
      )}
    </motion.div>
  )
}
