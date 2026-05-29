'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Monitor,
  CheckCircle,
  ShieldOff,
  Wifi,
  Plus,
  Key,
  Search,
  Copy,
  MoreHorizontal,
  Eye,
  Ban,
  Unlock,
  Power,
  Trash2,
  Laptop,
  Tablet,
  Smartphone,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  Globe,
  AlertTriangle,
} from 'lucide-react'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { RegisterDeviceDialog } from './register-device-dialog'
import { GenerateKeyDialog } from './generate-key-dialog'
import { DeviceDetail } from './device-detail'

// ── Types ────────────────────────────────────────────────────────────────────

interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string | null
}

interface SessionInfo {
  id: string
  userId: string
  deviceId: string | null
  token: string
  ipAddress: string | null
  userAgent: string | null
  isActive: boolean
  expiresAt: string
  createdAt: string
  user?: UserInfo
  device?: { id: string; deviceName: string; serialKey: string; deviceType: string } | null
}

interface LicenseKeyInfo {
  id: string
  key: string
  type: string
  plan: string
  maxDevices: number
  maxUsers: number
  status: string
  activatedAt: string | null
  expiresAt: string | null
  clientId: string
  deviceId: string | null
  createdAt: string
  client?: { id: string; companyName: string; contactName: string; email: string } | null
  device?: { id: string; deviceName: string; serialKey: string } | null
}

interface DeviceInfo {
  id: string
  serialKey: string
  deviceName: string | null
  deviceType: string
  os: string | null
  browser: string | null
  ipAddress: string | null
  macAddress: string | null
  status: string
  activatedAt: string | null
  lastSeenAt: string | null
  workspaceId: string
  userId: string | null
  createdAt: string
  updatedAt: string
  user?: UserInfo | null
  sessions?: SessionInfo[]
  licenseKeys?: LicenseKeyInfo[]
}

interface DeviceStats {
  total: number
  active: number
  blocked: number
  pending: number
  deactivated: number
  activeSessions: number
}

// ── Activity Log Types ────────────────────────────────────────────────────────

interface ActivityLogEntry {
  id: string
  type: string
  action: string
  description: string
  timestamp: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function maskKey(key: string): string {
  if (key.length <= 8) return key
  return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4)
}

function maskSerialKey(key: string): string {
  const parts = key.split('-')
  if (parts.length > 1) {
    return parts[0] + '-' + '••••' + '-' + parts[parts.length - 1]
  }
  return key.substring(0, 4) + '••••' + key.substring(key.length - 4)
}

function getDeviceIcon(type: string) {
  switch (type) {
    case 'desktop': return Monitor
    case 'laptop': return Laptop
    case 'tablet': return Tablet
    case 'mobile': return Smartphone
    default: return Monitor
  }
}

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' },
    active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' },
    blocked: { label: 'Blocked', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800' },
    deactivated: { label: 'Deactivated', className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/40 dark:text-gray-400 dark:border-gray-800' },
  }
  const c = config[status] || config.pending
  return <Badge variant="outline" className={cn('text-xs font-medium', c.className)}>{c.label}</Badge>
}

function getLicenseStatusBadge(status: string) {
  const config: Record<string, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' },
    activated: { label: 'Activated', className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800' },
    expired: { label: 'Expired', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' },
    revoked: { label: 'Revoked', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800' },
  }
  const c = config[status] || config.available
  return <Badge variant="outline" className={cn('text-xs font-medium', c.className)}>{c.label}</Badge>
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${label} copied to clipboard`)
  }).catch(() => {
    toast.error('Failed to copy')
  })
}

// ── Stats Card ────────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, iconColor, iconBg, index = 0 }: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            </div>
            <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', iconBg)}>
              <Icon className={cn('size-6', iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function DevicesPage() {
  // State
  const [devices, setDevices] = React.useState<DeviceInfo[]>([])
  const [sessions, setSessions] = React.useState<SessionInfo[]>([])
  const [licenseKeys, setLicenseKeys] = React.useState<LicenseKeyInfo[]>([])
  const [stats, setStats] = React.useState<DeviceStats>({ total: 0, active: 0, blocked: 0, pending: 0, deactivated: 0, activeSessions: 0 })
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('devices')

  // Filters
  const [deviceSearch, setDeviceSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [sessionFilter, setSessionFilter] = React.useState('all')

  // Dialogs
  const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false)
  const [generateKeyDialogOpen, setGenerateKeyDialogOpen] = React.useState(false)
  const [selectedDevice, setSelectedDevice] = React.useState<DeviceInfo | null>(null)
  const [deviceDetailOpen, setDeviceDetailOpen] = React.useState(false)
  const [confirmAction, setConfirmAction] = React.useState<{ type: string; id: string; name: string } | null>(null)

  // Key reveal state
  const [revealedKeys, setRevealedKeys] = React.useState<Set<string>>(new Set())

  // Expanded device rows
  const [expandedDevices, setExpandedDevices] = React.useState<Set<string>>(new Set())

  // Fetch data
  const fetchDevices = React.useCallback(async () => {
    try {
      const res = await fetch('/api/devices')
      if (res.ok) {
        const data = await res.json()
        setDevices(data.devices || [])
        setStats(data.stats || { total: 0, active: 0, blocked: 0, pending: 0, deactivated: 0, activeSessions: 0 })
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err)
    }
  }, [])

  const fetchSessions = React.useCallback(async () => {
    try {
      const res = await fetch('/api/devices/sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    }
  }, [])

  const fetchLicenseKeys = React.useCallback(async () => {
    try {
      const res = await fetch('/api/devices/license-keys')
      if (res.ok) {
        const data = await res.json()
        setLicenseKeys(data.licenseKeys || [])
      }
    } catch (err) {
      console.error('Failed to fetch license keys:', err)
    }
  }, [])

  const fetchAll = React.useCallback(async () => {
    setIsLoading(true)
    await Promise.all([fetchDevices(), fetchSessions(), fetchLicenseKeys()])
    setIsLoading(false)
  }, [fetchDevices, fetchSessions, fetchLicenseKeys])

  React.useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Actions
  const handleDeviceAction = async (action: string, deviceId: string) => {
    const statusMap: Record<string, string> = {
      block: 'blocked',
      unblock: 'active',
      deactivate: 'deactivated',
      activate: 'active',
    }
    const newStatus = statusMap[action]
    if (!newStatus) return

    try {
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        toast.success(`Device ${action}ed successfully`)
        fetchDevices()
        fetchSessions()
      } else {
        toast.error(`Failed to ${action} device`)
      }
    } catch {
      toast.error(`Failed to ${action} device`)
    }
    setConfirmAction(null)
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch('/api/devices/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      if (res.ok) {
        toast.success('Session revoked')
        fetchSessions()
        fetchDevices()
      }
    } catch {
      toast.error('Failed to revoke session')
    }
  }

  const handleRevokeAllSessions = async () => {
    try {
      const res = await fetch('/api/devices/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revokeAll: true }),
      })
      if (res.ok) {
        const data = await res.json()
        toast.success(`Revoked ${data.count} sessions`)
        fetchSessions()
        fetchDevices()
      }
    } catch {
      toast.error('Failed to revoke sessions')
    }
    setConfirmAction(null)
  }

  const handleRevokeLicenseKey = async (keyId: string) => {
    try {
      const res = await fetch(`/api/devices/license-keys`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: keyId, status: 'revoked' }),
      })
      if (res.ok) {
        toast.success('License key revoked')
        fetchLicenseKeys()
      } else {
        toast.error('Failed to revoke license key')
      }
    } catch {
      toast.error('Failed to revoke license key')
    }
    setConfirmAction(null)
  }

  // Toggle key reveal
  const toggleKeyReveal = (keyId: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev)
      if (next.has(keyId)) next.delete(keyId)
      else next.add(keyId)
      return next
    })
  }

  // Toggle device row expansion
  const toggleDeviceExpansion = (deviceId: string) => {
    setExpandedDevices(prev => {
      const next = new Set(prev)
      if (next.has(deviceId)) next.delete(deviceId)
      else next.add(deviceId)
      return next
    })
  }

  // Filtered devices
  const filteredDevices = React.useMemo(() => {
    return devices.filter(d => {
      const matchSearch = !deviceSearch ||
        d.deviceName?.toLowerCase().includes(deviceSearch.toLowerCase()) ||
        d.serialKey.toLowerCase().includes(deviceSearch.toLowerCase()) ||
        d.user?.name.toLowerCase().includes(deviceSearch.toLowerCase()) ||
        d.ipAddress?.includes(deviceSearch)
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      const matchType = typeFilter === 'all' || d.deviceType === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [devices, deviceSearch, statusFilter, typeFilter])

  // Filtered sessions
  const filteredSessions = React.useMemo(() => {
    return sessions.filter(s => {
      if (sessionFilter === 'active') return s.isActive
      if (sessionFilter === 'expired') return !s.isActive
      return true
    })
  }, [sessions, sessionFilter])

  // Activity log from data
  const activityLog: ActivityLogEntry[] = React.useMemo(() => {
    const entries: ActivityLogEntry[] = []

    devices.forEach(d => {
      if (d.activatedAt) {
        entries.push({
          id: `act-${d.id}-activated`,
          type: 'device',
          action: 'Device Activated',
          description: `${d.deviceName || 'Unknown device'} (${d.serialKey}) was activated`,
          timestamp: d.activatedAt,
          icon: CheckCircle,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        })
      }
      if (d.status === 'blocked') {
        entries.push({
          id: `act-${d.id}-blocked`,
          type: 'device',
          action: 'Device Blocked',
          description: `${d.deviceName || 'Unknown device'} (${d.serialKey}) was blocked`,
          timestamp: d.updatedAt,
          icon: ShieldOff,
          iconColor: 'text-red-600 dark:text-red-400',
        })
      }
      if (d.status === 'pending') {
        entries.push({
          id: `act-${d.id}-pending`,
          type: 'device',
          action: 'Device Registered',
          description: `${d.deviceName || 'Unknown device'} (${d.serialKey}) is pending activation`,
          timestamp: d.createdAt,
          icon: Clock,
          iconColor: 'text-amber-600 dark:text-amber-400',
        })
      }
    })

    sessions.forEach(s => {
      if (s.isActive) {
        entries.push({
          id: `act-ses-${s.id}`,
          type: 'session',
          action: 'Session Created',
          description: `Active session for ${s.user?.name || 'Unknown'} from ${s.ipAddress || 'N/A'}`,
          timestamp: s.createdAt,
          icon: Wifi,
          iconColor: 'text-sky-600 dark:text-sky-400',
        })
      }
    })

    licenseKeys.forEach(k => {
      if (k.status === 'activated') {
        entries.push({
          id: `act-key-${k.id}-activated`,
          type: 'license',
          action: 'License Activated',
          description: `${k.type} license key activated for ${k.client?.companyName || 'Unknown'}`,
          timestamp: k.activatedAt || k.createdAt,
          icon: Key,
          iconColor: 'text-sky-600 dark:text-sky-400',
        })
      }
      if (k.status === 'revoked') {
        entries.push({
          id: `act-key-${k.id}-revoked`,
          type: 'license',
          action: 'License Revoked',
          description: `${k.type} license key was revoked`,
          timestamp: k.updatedAt || k.createdAt,
          icon: AlertTriangle,
          iconColor: 'text-red-600 dark:text-red-400',
        })
      }
    })

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [devices, sessions, licenseKeys])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <Shield className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Device Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track devices, manage serial keys, and control sessions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setGenerateKeyDialogOpen(true)}>
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Generate License Key</span>
            <span className="sm:hidden">Key</span>
          </Button>
          <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setRegisterDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Register Device</span>
            <span className="sm:hidden">Register</span>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="size-12 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard title="Total Devices" value={stats.total} icon={Monitor} iconColor="text-emerald-600 dark:text-emerald-400" iconBg="bg-emerald-50 dark:bg-emerald-950/40" index={0} />
            <StatCard title="Active Devices" value={stats.active} icon={CheckCircle} iconColor="text-green-600 dark:text-green-400" iconBg="bg-green-50 dark:bg-green-950/40" index={1} />
            <StatCard title="Blocked Devices" value={stats.blocked} icon={ShieldOff} iconColor="text-red-600 dark:text-red-400" iconBg="bg-red-50 dark:bg-red-950/40" index={2} />
            <StatCard title="Active Sessions" value={stats.activeSessions} icon={Wifi} iconColor="text-sky-600 dark:text-sky-400" iconBg="bg-sky-50 dark:bg-sky-950/40" index={3} />
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="devices" className="gap-2">
            <Monitor className="size-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="license-keys" className="gap-2">
            <Key className="size-4" />
            License Keys
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Wifi className="size-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Clock className="size-4" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* ── Devices Tab ── */}
        <TabsContent value="devices" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search devices by name, serial key, user, IP..."
                className="pl-9"
                value={deviceSearch}
                onChange={(e) => setDeviceSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Devices Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Serial Key</TableHead>
                      <TableHead>Device Name</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden lg:table-cell">OS / Browser</TableHead>
                      <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Assigned User</TableHead>
                      <TableHead className="hidden xl:table-cell">Last Seen</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 10 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Monitor className="size-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No devices found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDevices.map((device) => {
                        const DeviceIcon = getDeviceIcon(device.deviceType)
                        const isExpanded = expandedDevices.has(device.id)
                        return (
                          <React.Fragment key={device.id}>
                            <TableRow
                              className="cursor-pointer hover:bg-muted/30 transition-colors"
                              onClick={() => toggleDeviceExpansion(device.id)}
                            >
                              <TableCell>
                                {isExpanded ? (
                                  <ChevronUp className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                                    {maskSerialKey(device.serialKey)}
                                  </code>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(device.serialKey, 'Serial key') }}
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                  >
                                    <Copy className="size-3 text-muted-foreground" />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <DeviceIcon className="size-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{device.deviceName || 'Unnamed'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge variant="secondary" className="text-xs capitalize">{device.deviceType}</Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                                {device.os && <span>{device.os}</span>}
                                {device.browser && <span className="text-muted-foreground/60"> · {device.browser}</span>}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-xs font-mono text-muted-foreground">
                                {device.ipAddress || '—'}
                              </TableCell>
                              <TableCell>{getStatusBadge(device.status)}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm">
                                {device.user ? (
                                  <span className="text-muted-foreground">{device.user.name}</span>
                                ) : (
                                  <span className="text-muted-foreground/50">Unassigned</span>
                                )}
                              </TableCell>
                              <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                                {device.lastSeenAt
                                  ? formatDistanceToNow(parseISO(device.lastSeenAt), { addSuffix: true })
                                  : 'Never'}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="size-8">
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedDevice(device); setDeviceDetailOpen(true) }}>
                                      <Eye className="size-4 mr-2" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {device.status === 'active' && (
                                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'block', id: device.id, name: device.deviceName || 'Device' }) }} className="text-red-600 dark:text-red-400">
                                        <Ban className="size-4 mr-2" /> Block Device
                                      </DropdownMenuItem>
                                    )}
                                    {device.status === 'blocked' && (
                                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeviceAction('unblock', device.id) }}>
                                        <Unlock className="size-4 mr-2" /> Unblock Device
                                      </DropdownMenuItem>
                                    )}
                                    {(device.status === 'active' || device.status === 'blocked') && (
                                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'deactivate', id: device.id, name: device.deviceName || 'Device' }) }} className="text-red-600 dark:text-red-400">
                                        <Power className="size-4 mr-2" /> Deactivate
                                      </DropdownMenuItem>
                                    )}
                                    {device.status === 'pending' && (
                                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeviceAction('activate', device.id) }}>
                                        <CheckCircle className="size-4 mr-2" /> Activate
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'revoke-sessions', id: device.id, name: device.deviceName || 'Device' }) }}>
                                      <Trash2 className="size-4 mr-2" /> Revoke Sessions
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                            {/* Expanded Row */}
                            {isExpanded && (
                              <TableRow className="bg-muted/20 hover:bg-muted/20">
                                <TableCell colSpan={10} className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="space-y-2">
                                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Hardware Info</p>
                                      <div className="space-y-1">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Serial Key</span>
                                          <code className="text-xs font-mono">{device.serialKey}</code>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">MAC Address</span>
                                          <code className="text-xs font-mono">{device.macAddress || 'N/A'}</code>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">IP Address</span>
                                          <code className="text-xs font-mono">{device.ipAddress || 'N/A'}</code>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Activated</span>
                                          <span>{device.activatedAt ? format(parseISO(device.activatedAt), 'MMM d, yyyy') : 'Not activated'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Session History</p>
                                      {device.sessions && device.sessions.length > 0 ? (
                                        <div className="space-y-1">
                                          {device.sessions.slice(0, 3).map(s => (
                                            <div key={s.id} className="flex items-center gap-2 text-xs">
                                              <div className={cn('size-2 rounded-full', s.isActive ? 'bg-emerald-500' : 'bg-gray-400')} />
                                              <span className="text-muted-foreground">{s.ipAddress || 'N/A'}</span>
                                              <span className="text-muted-foreground/50">{formatDistanceToNow(parseISO(s.createdAt), { addSuffix: true })}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground/50">No sessions</p>
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">License Keys</p>
                                      {device.licenseKeys && device.licenseKeys.length > 0 ? (
                                        <div className="space-y-1">
                                          {device.licenseKeys.map(k => (
                                            <div key={k.id} className="flex items-center gap-2 text-xs">
                                              <Key className="size-3 text-muted-foreground" />
                                              <code className="font-mono">{maskKey(k.key)}</code>
                                              {getLicenseStatusBadge(k.status)}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground/50">No license keys</p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── License Keys Tab ── */}
        <TabsContent value="license-keys" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setGenerateKeyDialogOpen(true)}>
              <Plus className="size-4" />
              Generate Key
            </Button>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Key</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Plan</TableHead>
                      <TableHead className="hidden lg:table-cell">Max Devices</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Assigned Client</TableHead>
                      <TableHead className="hidden lg:table-cell">Assigned Device</TableHead>
                      <TableHead className="hidden xl:table-cell">Expires</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 9 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : licenseKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Key className="size-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No license keys found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      licenseKeys.map((lk) => {
                        const isRevealed = revealedKeys.has(lk.id)
                        return (
                          <TableRow key={lk.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                                  {isRevealed ? lk.key : maskKey(lk.key)}
                                </code>
                                <button
                                  onClick={() => toggleKeyReveal(lk.id)}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  title={isRevealed ? 'Hide key' : 'Reveal key'}
                                >
                                  {isRevealed ? <X className="size-3 text-muted-foreground" /> : <Eye className="size-3 text-muted-foreground" />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(lk.key, 'License key')}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                >
                                  <Copy className="size-3 text-muted-foreground" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs capitalize">{lk.type}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell capitalize text-sm">{lk.plan}</TableCell>
                            <TableCell className="hidden lg:table-cell text-sm">{lk.maxDevices}</TableCell>
                            <TableCell>{getLicenseStatusBadge(lk.status)}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {lk.client?.companyName || '—'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {lk.device?.deviceName || '—'}
                            </TableCell>
                            <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                              {lk.expiresAt ? format(parseISO(lk.expiresAt), 'MMM d, yyyy') : 'Never'}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => copyToClipboard(lk.key, 'License key')}>
                                    <Copy className="size-4 mr-2" /> Copy Key
                                  </DropdownMenuItem>
                                  {(lk.status === 'activated' || lk.status === 'available') && (
                                    <DropdownMenuItem onClick={() => setConfirmAction({ type: 'revoke-key', id: lk.id, name: lk.key })} className="text-red-600 dark:text-red-400">
                                      <Ban className="size-4 mr-2" /> Revoke Key
                                    </DropdownMenuItem>
                                  )}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Sessions Tab ── */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => setConfirmAction({ type: 'revoke-all-sessions', id: '', name: 'all sessions' })}>
              <Trash2 className="size-4" />
              Revoke All Sessions
            </Button>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>User</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead className="hidden md:table-cell">IP Address</TableHead>
                      <TableHead className="hidden lg:table-cell">User Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Started</TableHead>
                      <TableHead className="hidden xl:table-cell">Expires</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Wifi className="size-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">No sessions found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((session) => (
                        <TableRow key={session.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <div className={cn('size-2 rounded-full', session.isActive ? 'bg-emerald-500' : 'bg-gray-400')} />
                              {session.user?.name || 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {session.device?.deviceName || '—'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs font-mono text-muted-foreground">
                            {session.ipAddress || '—'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground truncate max-w-[200px]">
                            {session.userAgent ? session.userAgent.substring(0, 50) + '...' : '—'}
                          </TableCell>
                          <TableCell>
                            {session.isActive ? (
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/40 dark:text-gray-400 dark:border-gray-800">Expired</Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {formatDistanceToNow(parseISO(session.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                            {format(parseISO(session.expiresAt), 'MMM d, HH:mm')}
                          </TableCell>
                          <TableCell>
                            {session.isActive && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleRevokeSession(session.id)}>
                                Revoke
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Activity Log Tab ── */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Device Activity Log</CardTitle>
              <CardDescription>Timeline of device-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-1">
                  {activityLog.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Clock className="size-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">No activity recorded</p>
                    </div>
                  ) : (
                    activityLog.map((entry) => {
                      const EntryIcon = entry.icon
                      return (
                        <div key={entry.id} className="flex items-start gap-3 py-3 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 mt-0.5">
                            <EntryIcon className={cn('size-4', entry.iconColor)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{entry.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                            {formatDistanceToNow(parseISO(entry.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Register Device Dialog */}
      <RegisterDeviceDialog
        open={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        onSuccess={() => { fetchDevices(); fetchSessions() }}
      />

      {/* Generate Key Dialog */}
      <GenerateKeyDialog
        open={generateKeyDialogOpen}
        onOpenChange={setGenerateKeyDialogOpen}
        onSuccess={() => fetchLicenseKeys()}
      />

      {/* Device Detail Dialog */}
      <Dialog open={deviceDetailOpen} onOpenChange={setDeviceDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDevice && (
            <DeviceDetail
              device={selectedDevice}
              onAction={(action) => {
                if (action === 'block' || action === 'unblock' || action === 'deactivate' || action === 'activate') {
                  handleDeviceAction(action, selectedDevice.id)
                  setDeviceDetailOpen(false)
                }
              }}
              onRevokeSessions={(deviceId) => {
                fetch('/api/devices/sessions', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ revokeAll: true, deviceId }),
                }).then(() => {
                  toast.success('All sessions revoked for this device')
                  fetchSessions()
                  fetchDevices()
                })
              }}
              onRefresh={fetchDevices}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'block' && `Are you sure you want to block "${confirmAction.name}"? This will revoke all active sessions for this device.`}
              {confirmAction?.type === 'deactivate' && `Are you sure you want to deactivate "${confirmAction.name}"? This device will no longer be able to connect.`}
              {confirmAction?.type === 'revoke-sessions' && `Are you sure you want to revoke all sessions for "${confirmAction.name}"? Users will be logged out immediately.`}
              {confirmAction?.type === 'revoke-all-sessions' && 'Are you sure you want to revoke ALL active sessions? All users will be logged out immediately.'}
              {confirmAction?.type === 'revoke-key' && `Are you sure you want to revoke license key "${confirmAction.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                (confirmAction?.type === 'block' || confirmAction?.type === 'deactivate' || confirmAction?.type === 'revoke-key') && 'bg-red-600 hover:bg-red-700 text-white',
                confirmAction?.type === 'revoke-all-sessions' && 'bg-red-600 hover:bg-red-700 text-white',
              )}
              onClick={() => {
                if (!confirmAction) return
                if (confirmAction.type === 'block' || confirmAction.type === 'deactivate') {
                  handleDeviceAction(confirmAction.type, confirmAction.id)
                } else if (confirmAction.type === 'revoke-sessions') {
                  fetch('/api/devices/sessions', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ revokeAll: true, deviceId: confirmAction.id }),
                  }).then(() => {
                    toast.success('All sessions revoked')
                    fetchSessions()
                    fetchDevices()
                  })
                  setConfirmAction(null)
                } else if (confirmAction.type === 'revoke-all-sessions') {
                  handleRevokeAllSessions()
                } else if (confirmAction.type === 'revoke-key') {
                  handleRevokeLicenseKey(confirmAction.id)
                }
              }}
            >
              {confirmAction?.type === 'block' && 'Block Device'}
              {confirmAction?.type === 'deactivate' && 'Deactivate Device'}
              {confirmAction?.type === 'revoke-sessions' && 'Revoke Sessions'}
              {confirmAction?.type === 'revoke-all-sessions' && 'Revoke All'}
              {confirmAction?.type === 'revoke-key' && 'Revoke Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
