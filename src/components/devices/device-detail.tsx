'use client'

import * as React from 'react'
import {
  Shield,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  CheckCircle,
  ShieldOff,
  Power,
  Trash2,
  Wifi,
  Key,
  Globe,
  Clock,
  Unlock,
  Ban,
  Copy,
  MapPin,
} from 'lucide-react'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

interface DeviceDetailProps {
  device: DeviceInfo
  onAction: (action: string) => void
  onRevokeSessions: (deviceId: string) => void
  onRefresh: () => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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
    active: { label: 'Active', className: 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20' },
    blocked: { label: 'Blocked', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800' },
    deactivated: { label: 'Deactivated', className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/40 dark:text-gray-400 dark:border-gray-800' },
  }
  const c = config[status] || config.pending
  return <Badge variant="outline" className={cn('text-xs font-medium', c.className)}>{c.label}</Badge>
}

function getLicenseStatusBadge(status: string) {
  const config: Record<string, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20' },
    activated: { label: 'Activated', className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800' },
    expired: { label: 'Expired', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' },
    revoked: { label: 'Revoked', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800' },
  }
  const c = config[status] || config.available
  return <Badge variant="outline" className={cn('text-xs font-medium', c.className)}>{c.label}</Badge>
}

// ── Component ────────────────────────────────────────────────────────────────

export function DeviceDetail({ device, onAction, onRevokeSessions, onRefresh }: DeviceDetailProps) {
  const deviceIconType = device.deviceType

  const activeSessions = (device.sessions || []).filter(s => s.isActive)
  const expiredSessions = (device.sessions || []).filter(s => !s.isActive)

  // Activity timeline from device data
  const activityTimeline = React.useMemo(() => {
    const entries: Array<{ id: string; action: string; description: string; timestamp: string; icon: React.ComponentType<{ className?: string }>; iconColor: string }> = []

    if (device.createdAt) {
      entries.push({
        id: 'created',
        action: 'Device Registered',
        description: `${device.deviceName || 'Device'} was registered in the system`,
        timestamp: device.createdAt,
        icon: Shield,
        iconColor: 'text-sky-600 dark:text-sky-400',
      })
    }
    if (device.activatedAt) {
      entries.push({
        id: 'activated',
        action: 'Device Activated',
        description: `${device.deviceName || 'Device'} was activated`,
        timestamp: device.activatedAt,
        icon: CheckCircle,
        iconColor: 'text-primary',
      })
    }
    if (device.status === 'blocked') {
      entries.push({
        id: 'blocked',
        action: 'Device Blocked',
        description: `Device access was blocked`,
        timestamp: device.updatedAt,
        icon: ShieldOff,
        iconColor: 'text-red-600 dark:text-red-400',
      })
    }
    if (device.lastSeenAt) {
      entries.push({
        id: 'last-seen',
        action: 'Last Seen',
        description: `Device was last seen online`,
        timestamp: device.lastSeenAt,
        icon: Clock,
        iconColor: 'text-muted-foreground',
      })
    }

    // Add session events
    ;(device.sessions || []).forEach(s => {
      entries.push({
        id: `session-${s.id}`,
        action: s.isActive ? 'Session Active' : 'Session Expired',
        description: `${s.user?.name || 'User'} from ${s.ipAddress || 'N/A'}`,
        timestamp: s.createdAt,
        icon: Wifi,
        iconColor: s.isActive ? 'text-primary' : 'text-gray-500',
      })
    })

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [device])

  return (
    <div className="space-y-6">
      {/* Device Header */}
      <div className="flex items-start gap-4">
        <div className={cn(
          'flex size-14 items-center justify-center rounded-xl',
          device.status === 'active' ? 'bg-primary/5 dark:bg-primary/10' :
          device.status === 'blocked' ? 'bg-red-50 dark:bg-red-950/40' :
          device.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40' :
          'bg-gray-50 dark:bg-gray-950/40'
        )}>
          {deviceIconType === 'desktop' && <Monitor className={cn('size-7', device.status === 'active' ? 'text-primary' : device.status === 'blocked' ? 'text-red-600 dark:text-red-400' : device.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400')} />}
          {deviceIconType === 'laptop' && <Laptop className={cn('size-7', device.status === 'active' ? 'text-primary' : device.status === 'blocked' ? 'text-red-600 dark:text-red-400' : device.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400')} />}
          {deviceIconType === 'tablet' && <Tablet className={cn('size-7', device.status === 'active' ? 'text-primary' : device.status === 'blocked' ? 'text-red-600 dark:text-red-400' : device.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400')} />}
          {deviceIconType === 'mobile' && <Smartphone className={cn('size-7', device.status === 'active' ? 'text-primary' : device.status === 'blocked' ? 'text-red-600 dark:text-red-400' : device.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400')} />}
          {!(deviceIconType === 'desktop' || deviceIconType === 'laptop' || deviceIconType === 'tablet' || deviceIconType === 'mobile') && <Monitor className={cn('size-7', device.status === 'active' ? 'text-primary' : device.status === 'blocked' ? 'text-red-600 dark:text-red-400' : device.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400')} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{device.deviceName || 'Unnamed Device'}</h2>
            {getStatusBadge(device.status)}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{device.serialKey}</span>
            <button onClick={() => { navigator.clipboard.writeText(device.serialKey); toast.success('Serial key copied') }} className="p-1 hover:bg-muted rounded">
              <Copy className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {device.status === 'active' && (
          <Button variant="outline" size="sm" className="gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => onAction('block')}>
            <Ban className="size-4" /> Block
          </Button>
        )}
        {device.status === 'blocked' && (
          <Button variant="outline" size="sm" className="gap-2 text-primary hover:bg-primary/5 dark:hover:bg-primary/10" onClick={() => onAction('unblock')}>
            <Unlock className="size-4" /> Unblock
          </Button>
        )}
        {(device.status === 'active' || device.status === 'blocked') && (
          <Button variant="outline" size="sm" className="gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => onAction('deactivate')}>
            <Power className="size-4" /> Deactivate
          </Button>
        )}
        {device.status === 'pending' && (
          <Button variant="outline" size="sm" className="gap-2 text-primary hover:bg-primary/5 dark:hover:bg-primary/10" onClick={() => onAction('activate')}>
            <CheckCircle className="size-4" /> Activate
          </Button>
        )}
        <Button variant="outline" size="sm" className="gap-2" onClick={() => onRevokeSessions(device.id)}>
          <Trash2 className="size-4" /> Wipe Sessions
        </Button>
        <Button variant="ghost" size="sm" className="gap-2" onClick={onRefresh}>
          <Clock className="size-4" /> Refresh
        </Button>
      </div>

      <Separator />

      {/* Device Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Info */}
        <Card className="border-border/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Monitor className="size-4 text-muted-foreground" />
              Hardware Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Device Type</span>
              <span className="capitalize font-medium">{device.deviceType}</span>
              <span className="text-muted-foreground">Operating System</span>
              <span>{device.os || 'Unknown'}</span>
              <span className="text-muted-foreground">Browser</span>
              <span>{device.browser || 'Unknown'}</span>
              <span className="text-muted-foreground">IP Address</span>
              <span className="font-mono text-xs">{device.ipAddress || 'Unknown'}</span>
              <span className="text-muted-foreground">MAC Address</span>
              <span className="font-mono text-xs">{device.macAddress || 'Unknown'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card className="border-border/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              Connection Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Status</span>
              <span>{getStatusBadge(device.status)}</span>
              <span className="text-muted-foreground">Activated</span>
              <span>{device.activatedAt ? format(parseISO(device.activatedAt), 'MMM d, yyyy HH:mm') : 'Not activated'}</span>
              <span className="text-muted-foreground">Last Seen</span>
              <span>{device.lastSeenAt ? formatDistanceToNow(parseISO(device.lastSeenAt), { addSuffix: true }) : 'Never'}</span>
              <span className="text-muted-foreground">Registered</span>
              <span>{format(parseISO(device.createdAt), 'MMM d, yyyy')}</span>
              <span className="text-muted-foreground">Assigned User</span>
              <span>{device.user?.name || 'Unassigned'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session History */}
      <Card className="border-border/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wifi className="size-4 text-muted-foreground" />
              Session History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{activeSessions.length} active</Badge>
              <Badge variant="outline" className="text-xs">{expiredSessions.length} expired</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(device.sessions || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sessions recorded</p>
          ) : (
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {(device.sessions || []).map(session => (
                  <div key={session.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 text-sm">
                    <div className={cn('size-2 rounded-full shrink-0', session.isActive ? 'bg-primary' : 'bg-gray-400')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.user?.name || 'Unknown'}</span>
                        <span className="text-muted-foreground text-xs">{session.ipAddress || 'N/A'}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{session.userAgent?.substring(0, 60) || 'N/A'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(session.createdAt), { addSuffix: true })}</p>
                      <p className="text-xs text-muted-foreground">
                        Exp: {format(parseISO(session.expiresAt), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* License Keys */}
      {(device.licenseKeys || []).length > 0 && (
        <Card className="border-border/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Key className="size-4 text-muted-foreground" />
              License Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {device.licenseKeys!.map(lk => (
                <div key={lk.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 text-sm">
                  <Key className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs">{lk.key}</code>
                      {getLicenseStatusBadge(lk.status)}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{lk.type} · {lk.plan} plan · {lk.maxDevices} devices</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {lk.expiresAt ? `Exp: ${format(parseISO(lk.expiresAt), 'MMM d, yyyy')}` : 'No expiry'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card className="border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-1">
              {activityTimeline.map(entry => {
                const EntryIcon = entry.icon
                return (
                  <div key={entry.id} className="flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/50 mt-0.5">
                      <EntryIcon className={cn('size-3.5', entry.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                      {formatDistanceToNow(parseISO(entry.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
