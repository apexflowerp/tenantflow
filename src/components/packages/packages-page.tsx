'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Truck,
  Bell,
  ArrowRight,
  RotateCcw,
  Inbox,
  Box,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

type PackageStatus = 'pending' | 'delivered' | 'picked_up' | 'returned'
type PackageSize = 'small' | 'medium' | 'large' | 'oversized'

interface PackageRecord {
  id: string
  trackingNumber: string
  sender: string
  carrier: string
  size: PackageSize
  status: PackageStatus
  shelfLocation: string
  recipient: string
  property: string
  receivedDate: string
  notes: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const PACKAGES: PackageRecord[] = [
  {
    id: 'PKG-001',
    trackingNumber: '1Z999AA10123456784',
    sender: 'Amazon.com',
    carrier: 'UPS',
    size: 'small',
    status: 'pending',
    shelfLocation: 'A-12',
    recipient: 'Sarah Mitchell',
    property: 'Skyline Tower',
    receivedDate: '2025-06-14',
    notes: 'Fragile — handle with care',
  },
  {
    id: 'PKG-002',
    trackingNumber: '9400111899223100001',
    sender: 'Walmart',
    carrier: 'USPS',
    size: 'medium',
    status: 'delivered',
    shelfLocation: 'B-05',
    recipient: 'James Rodriguez',
    property: 'Harbor View Residences',
    receivedDate: '2025-06-14',
    notes: '',
  },
  {
    id: 'PKG-003',
    trackingNumber: '7489267302974123',
    sender: 'Home Depot',
    carrier: 'FedEx',
    size: 'large',
    status: 'pending',
    shelfLocation: 'C-01',
    recipient: 'Emily Chen',
    property: 'Greenfield Gardens',
    receivedDate: '2025-06-13',
    notes: 'Heavy — use cart',
  },
  {
    id: 'PKG-004',
    trackingNumber: '1Z999BB20234567890',
    sender: 'IKEA',
    carrier: 'UPS',
    size: 'oversized',
    status: 'picked_up',
    shelfLocation: '—',
    recipient: 'Michael Brown',
    property: 'Oakwood Estates',
    receivedDate: '2025-06-12',
    notes: '',
  },
  {
    id: 'PKG-005',
    trackingNumber: '9400111899223198765',
    sender: 'Best Buy',
    carrier: 'USPS',
    size: 'small',
    status: 'returned',
    shelfLocation: '—',
    recipient: 'David Kim',
    property: 'Metro Commercial Hub',
    receivedDate: '2025-06-10',
    notes: 'Return label included',
  },
  {
    id: 'PKG-006',
    trackingNumber: '794644790132',
    sender: 'DHL Express',
    carrier: 'DHL',
    size: 'medium',
    status: 'pending',
    shelfLocation: 'A-08',
    recipient: 'Amanda White',
    property: 'Riverside Lofts',
    receivedDate: '2025-06-14',
    notes: 'Signature required',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status: PackageStatus): string {
  const map: Record<PackageStatus, string> = {
    pending: 'tahoe-badge tahoe-badge-orange',
    delivered: 'tahoe-badge tahoe-badge-blue',
    picked_up: 'tahoe-badge tahoe-badge-green',
    returned: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getStatusIcon(status: PackageStatus) {
  const map: Record<PackageStatus, React.ReactNode> = {
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    delivered: <Inbox className="size-3.5 text-tahoe-blue" />,
    picked_up: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    returned: <RotateCcw className="size-3.5 text-tahoe-red" />,
  }
  return map[status]
}

function getStatusLabel(status: PackageStatus): string {
  const map: Record<PackageStatus, string> = {
    pending: 'Pending Pickup',
    delivered: 'Delivered',
    picked_up: 'Picked Up',
    returned: 'Returned',
  }
  return map[status]
}

function getSizeLabel(size: PackageSize): string {
  const map: Record<PackageSize, string> = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    oversized: 'Oversized',
  }
  return map[size]
}

function getSizeBadgeClass(size: PackageSize): string {
  const map: Record<PackageSize, string> = {
    small: 'tahoe-badge tahoe-badge-teal',
    medium: 'tahoe-badge tahoe-badge-blue',
    large: 'tahoe-badge tahoe-badge-purple',
    oversized: 'tahoe-badge tahoe-badge-orange',
  }
  return map[size]
}

function getCarrierColor(carrier: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    UPS: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange' },
    USPS: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue' },
    FedEx: { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple' },
    DHL: { bg: 'bg-tahoe-red/10', text: 'text-tahoe-red' },
  }
  return map[carrier] || { bg: 'bg-muted/50', text: 'text-muted-foreground' }
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

// ── Main Component ─────────────────────────────────────────────────────────────

export function PackagesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<PackageStatus | 'all'>('all')

  const filteredPackages = PACKAGES.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sender.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const pendingPackages = PACKAGES.filter((p) => p.status === 'pending')

  const stats = [
    {
      title: 'Pending Pickup',
      value: '12',
      subtitle: 'Awaiting tenant collection',
      icon: Clock,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Delivered Today',
      value: '8',
      subtitle: 'Received at front desk',
      icon: Inbox,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Overdue',
      value: '3',
      subtitle: 'Past pickup deadline',
      icon: AlertTriangle,
      iconColor: 'text-tahoe-red',
      iconBg: 'bg-tahoe-red/10',
    },
    {
      title: 'This Month',
      value: '156',
      subtitle: 'Total packages received',
      icon: Package,
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
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-orange/10">
            <Package className="size-6 text-tahoe-orange" />
          </div>
          <div>
            <h1 className="tahoe-title">Package Management</h1>
            <p className="tahoe-caption mt-1">Track deliveries and pickups</p>
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
            Log Package
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Notification Reminders ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-orange/10">
                <Bell className="size-4 text-tahoe-orange" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Pickup Reminders</CardTitle>
                <p className="tahoe-caption mt-0.5">Packages awaiting tenant collection</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {pendingPackages.map((pkg, i) => {
                const carrierColor = getCarrierColor(pkg.carrier)
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl bg-muted/30 p-3 tahoe-transition hover:bg-muted/50"
                  >
                    <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', carrierColor.bg)}>
                      <Truck className={cn('size-3.5', carrierColor.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{pkg.recipient}</p>
                      <p className="text-[11px] text-muted-foreground">From {pkg.sender} · Shelf {pkg.shelfLocation}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-[11px] h-7 shrink-0">
                      <Bell className="size-3" />
                      Notify
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Data Table ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="tahoe-headline">Package Log</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search tracking #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as PackageStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[150px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending Pickup</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="tahoe-overline">Tracking #</TableHead>
                    <TableHead className="tahoe-overline">Sender</TableHead>
                    <TableHead className="tahoe-overline">Carrier</TableHead>
                    <TableHead className="tahoe-overline">Recipient</TableHead>
                    <TableHead className="tahoe-overline">Size</TableHead>
                    <TableHead className="tahoe-overline">Shelf</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredPackages.map((pkg, i) => {
                      const carrierColor = getCarrierColor(pkg.carrier)
                      return (
                        <motion.tr
                          key={pkg.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            pkg.status === 'returned' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <p className="font-mono text-xs text-foreground">{pkg.trackingNumber.slice(0, 12)}…</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <p className="text-sm text-foreground">{pkg.sender}</p>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <div className={cn('flex size-5 items-center justify-center rounded-md', carrierColor.bg)}>
                                <Truck className={cn('size-3', carrierColor.text)} />
                              </div>
                              <span className="text-sm text-foreground">{pkg.carrier}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div>
                              <p className="text-sm font-medium text-foreground">{pkg.recipient}</p>
                              <p className="text-[11px] text-muted-foreground">{pkg.property}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={getSizeBadgeClass(pkg.size)}>{getSizeLabel(pkg.size)}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className="font-mono text-sm text-foreground">{pkg.shelfLocation}</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(pkg.status)}
                              <span className={getStatusBadgeClass(pkg.status)}>{getStatusLabel(pkg.status)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                                <Eye className="size-3.5 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" className="size-7 rounded-lg tahoe-transition">
                                <MoreHorizontal className="size-3.5 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 max-h-[420px] overflow-y-auto">
              <AnimatePresence>
                {filteredPackages.map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="glass-card rounded-2xl p-4 space-y-3 tahoe-transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{pkg.recipient}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{pkg.trackingNumber.slice(0, 14)}…</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(pkg.status)}
                        <span className={getStatusBadgeClass(pkg.status)}>{getStatusLabel(pkg.status)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{pkg.sender}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[11px] text-muted-foreground">{pkg.carrier}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className={getSizeBadgeClass(pkg.size)}>{getSizeLabel(pkg.size)}</span>
                      {pkg.shelfLocation !== '—' && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-[11px] font-mono text-foreground">Shelf {pkg.shelfLocation}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredPackages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-orange/10 mb-4">
                  <Package className="size-8 text-tahoe-orange/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No packages found</h3>
                <p className="tahoe-caption mt-1 max-w-sm">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
