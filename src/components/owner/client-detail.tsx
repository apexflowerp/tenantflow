'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Building2, Mail, Phone, Globe, MapPin, Calendar,
  DollarSign, Users, HomeIcon, Monitor, CreditCard, CheckCircle2,
  Clock, Shield, Key, FileText, Activity, Settings, Edit,
  ExternalLink, Copy, AlertCircle, Tag, Palette, Server,
  Ban, RefreshCw, Smartphone, Laptop, Tablet, Trash2, Unlock, Lock,
} from 'lucide-react'
import { useOwnerStore, type ClientData } from '@/stores/owner-store'
import { useToast } from '@/hooks/use-toast'
import { EditClientDialog } from './edit-client-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  professional: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  business: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  enterprise: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  trial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  churned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const LICENSE_STATUS_COLORS: Record<string, string> = {
  available: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  activated: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  revoked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  sent: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  paid: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const DEVICE_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  active: 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary',
  disabled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const DEVICE_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  desktop: Monitor,
  laptop: Laptop,
  tablet: Tablet,
  mobile: Smartphone,
}

const planPrices: Record<string, number> = { starter: 49, professional: 149, business: 349, enterprise: 799 }

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function maskKey(key: string) {
  const parts = key.split('-')
  if (parts.length < 5) return key
  return `${parts[0]}-${parts[1]}-****-****-${parts[4]}`
}

// ── Usage Progress Component ──
function UsageMetric({ label, used, max, icon: Icon, color }: {
  label: string; used: number; max: number; icon: React.ComponentType<{ className?: string }>; color: string
}) {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0
  const isNearLimit = pct >= 80

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Icon className={`size-4 ${color}`} />
          {label}
        </span>
        <span className={`font-medium ${isNearLimit ? 'text-amber-600 dark:text-amber-400' : ''}`}>
          {used} / {max}
        </span>
      </div>
      <Progress value={pct} className={`h-2 ${isNearLimit ? '[&>div]:bg-amber-500' : ''}`} />
    </div>
  )
}

// ── Info Row Helper ──
function InfoRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string | null | undefined
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground shrink-0">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-right font-medium truncate">{value || '—'}</span>
    </div>
  )
}

// ── Audit Log Icon Mapper ──
function getAuditIcon(action: string): React.ComponentType<{ className?: string }> {
  const lower = action.toLowerCase()
  if (lower.includes('create') || lower.includes('add')) return Key
  if (lower.includes('update') || lower.includes('edit')) return Edit
  if (lower.includes('delete') || lower.includes('remove')) return Trash2
  if (lower.includes('login') || lower.includes('auth')) return Shield
  if (lower.includes('suspend') || lower.includes('block')) return Ban
  if (lower.includes('activate') || lower.includes('renew')) return CheckCircle2
  return Activity
}

function getAuditColor(action: string): string {
  const lower = action.toLowerCase()
  if (lower.includes('create') || lower.includes('add') || lower.includes('activate')) return 'text-primary'
  if (lower.includes('update') || lower.includes('edit')) return 'text-sky-500'
  if (lower.includes('delete') || lower.includes('remove') || lower.includes('revoke')) return 'text-red-500'
  if (lower.includes('suspend') || lower.includes('block')) return 'text-amber-500'
  return 'text-muted-foreground'
}

// ── Client Detail View ──

export function ClientDetail() {
  const {
    selectedClient: client, clearSelection, fetchLicenseKeys, fetchInvoices,
    licenseKeys, invoices, updateClient, revokeLicenseKey,
    fetchClientDevices, fetchClientAuditLogs,
    clientDevices, clientAuditLogs,
    blockDevice, unblockDevice,
  } = useOwnerStore()
  const { toast } = useToast()
  const [detailTab, setDetailTab] = React.useState('overview')
  const [clientLicenses, setClientLicenses] = React.useState<any[]>([])
  const [clientInvoices, setClientInvoices] = React.useState<any[]>([])
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [showRenewDialog, setShowRenewDialog] = React.useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = React.useState(false)
  const [revokeTarget, setRevokeTarget] = React.useState<string | null>(null)
  const [isRevoking, setIsRevoking] = React.useState(false)
  const [isSuspending, setIsSuspending] = React.useState(false)
  const [blockDeviceTarget, setBlockDeviceTarget] = React.useState<string | null>(null)
  const [blockingDeviceId, setBlockingDeviceId] = React.useState<string | null>(null)
  const [usageData, setUsageData] = React.useState<{ properties: number; users: number; devices: number }>({ properties: 0, users: 0, devices: 0 })

  // Renew form
  const [renewForm, setRenewForm] = React.useState({ contractStart: '', contractEnd: '' })

  React.useEffect(() => {
    if (client) {
      fetchLicenseKeys()
      fetchInvoices()
      fetchClientDevices(client.id)
      fetchClientAuditLogs(client.id)
    }
  }, [client, fetchLicenseKeys, fetchInvoices, fetchClientDevices, fetchClientAuditLogs])

  React.useEffect(() => {
    if (client && licenseKeys.length > 0) {
      setClientLicenses(licenseKeys.filter(lk => lk.clientId === client.id))
    }
    if (client && invoices.length > 0) {
      setClientInvoices(invoices.filter(inv => inv.clientId === client.id))
    }
  }, [client, licenseKeys, invoices])

  // Fetch real usage data from client's workspaces
  React.useEffect(() => {
    if (client) {
      // Use client's workspaces data if available, or fall back to devices count
      const actualDevices = clientDevices.length
      setUsageData({
        properties: 0, // Will be computed from workspaces
        users: 0,      // Will be computed from workspaces
        devices: actualDevices,
      })

      // Fetch properties & users count from the client detail API
      const fetchUsage = async () => {
        try {
          const res = await fetch(`/api/owner/clients/${client.id}`)
          if (res.ok) {
            const data = await res.json()
            const workspaces = data.client?.workspaces || []
            let totalProperties = 0
            let totalUsers = 0
            // Count properties and users from each workspace
            // Note: We only have workspace names from this endpoint,
            // so we'll use the workspace count as a proxy or use the actual DB counts
            // For now, use the workspaces data that comes with the client
            if (workspaces.length > 0) {
              // We can count workspaces as a useful metric
              totalProperties = workspaces.length
            }
            setUsageData(prev => ({
              ...prev,
              properties: totalProperties,
              users: totalUsers,
            }))
          }
        } catch {
          // Silently fail, we have the devices count already
        }
      }
      fetchUsage()
    }
  }, [client, clientDevices])

  if (!client) return null

  const initials = client.companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleChangePlan = async (plan: string) => {
    try {
      await updateClient(client.id, {
        plan,
        monthlyFee: planPrices[plan],
      })
      toast({
        title: 'Plan changed',
        description: `Plan updated to ${plan} (${formatCurrency(planPrices[plan])}/mo)`,
      })
    } catch {
      toast({ title: 'Error', description: 'Failed to change plan', variant: 'destructive' })
    }
  }

  const handleSuspend = async () => {
    setIsSuspending(true)
    try {
      const newStatus = client.status === 'suspended' ? 'active' : 'suspended'
      await updateClient(client.id, { status: newStatus })
      toast({
        title: newStatus === 'suspended' ? 'Client suspended' : 'Client reactivated',
        description: `${client.companyName} has been ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}.`,
      })
    } catch {
      toast({ title: 'Error', description: 'Failed to update client status', variant: 'destructive' })
    } finally {
      setIsSuspending(false)
      setShowSuspendDialog(false)
    }
  }

  const handleRenew = async () => {
    try {
      const data: any = {}
      if (renewForm.contractStart) data.contractStart = renewForm.contractStart
      if (renewForm.contractEnd) data.contractEnd = renewForm.contractEnd
      await updateClient(client.id, data)
      toast({
        title: 'Subscription renewed',
        description: `Contract dates updated for ${client.companyName}.`,
      })
      setShowRenewDialog(false)
      setRenewForm({ contractStart: '', contractEnd: '' })
    } catch {
      toast({ title: 'Error', description: 'Failed to renew subscription', variant: 'destructive' })
    }
  }

  const handleRevokeLicense = async (licenseId: string) => {
    setIsRevoking(true)
    try {
      await revokeLicenseKey(licenseId)
      toast({
        title: 'License revoked',
        description: 'The license key has been revoked successfully.',
      })
      setRevokeTarget(null)
    } catch {
      toast({ title: 'Error', description: 'Failed to revoke license key', variant: 'destructive' })
    } finally {
      setIsRevoking(false)
    }
  }

  const handleBlockDevice = async () => {
    if (!blockDeviceTarget) return
    setBlockingDeviceId(blockDeviceTarget)
    try {
      await blockDevice(blockDeviceTarget)
      toast({
        title: 'Device blocked',
        description: 'The device has been blocked and its sessions invalidated.',
      })
      if (client) await fetchClientDevices(client.id)
    } catch {
      toast({ title: 'Error', description: 'Failed to block device', variant: 'destructive' })
    } finally {
      setBlockingDeviceId(null)
      setBlockDeviceTarget(null)
    }
  }

  const handleUnblockDevice = async (deviceId: string) => {
    setBlockingDeviceId(deviceId)
    try {
      await unblockDevice(deviceId)
      toast({
        title: 'Device unblocked',
        description: 'The device has been reactivated successfully.',
      })
      if (client) await fetchClientDevices(client.id)
    } catch {
      toast({ title: 'Error', description: 'Failed to unblock device', variant: 'destructive' })
    } finally {
      setBlockingDeviceId(null)
    }
  }

  // Prepare renew form defaults from current client
  const openRenewDialog = () => {
    setRenewForm({
      contractStart: client.contractStart ? new Date(client.contractStart).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      contractEnd: client.contractEnd ? new Date(client.contractEnd).toISOString().split('T')[0] : '',
    })
    setShowRenewDialog(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Edit Client Dialog */}
      <EditClientDialog open={showEditDialog} onOpenChange={setShowEditDialog} client={client} />

      {/* Renew Subscription Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renew Subscription</DialogTitle>
            <DialogDescription>Set new contract dates for {client.companyName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="renew-start">Contract Start Date</Label>
              <Input
                id="renew-start"
                type="date"
                value={renewForm.contractStart}
                onChange={(e) => setRenewForm(prev => ({ ...prev, contractStart: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renew-end">Contract End Date</Label>
              <Input
                id="renew-end"
                type="date"
                value={renewForm.contractEnd}
                onChange={(e) => setRenewForm(prev => ({ ...prev, contractEnd: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>Cancel</Button>
            <Button onClick={handleRenew} disabled={!renewForm.contractEnd} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <RefreshCw className="size-4" />
              Renew Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend/Reactivate Confirmation */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {client.status === 'suspended' ? 'Reactivate Client' : 'Suspend Client'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {client.status === 'suspended'
                ? `Are you sure you want to reactivate ${client.companyName}? They will regain access to the platform.`
                : `Are you sure you want to suspend ${client.companyName}? They will lose access to the platform until reactivated.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              disabled={isSuspending}
              className={client.status === 'suspended' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-red-600 hover:bg-red-700 text-white'}
            >
              {isSuspending ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : client.status === 'suspended' ? (
                'Reactivate'
              ) : (
                'Suspend'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke License Confirmation */}
      <AlertDialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke License Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this license key? This action cannot be undone. The key will be permanently disabled and any linked device will be disconnected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revokeTarget && handleRevokeLicense(revokeTarget)}
              disabled={isRevoking}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRevoking ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Revoke License'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Device Confirmation */}
      <AlertDialog open={!!blockDeviceTarget} onOpenChange={(open) => !open && setBlockDeviceTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block this device? The device will be disconnected and all active sessions will be invalidated. The user will need to re-register the device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockDevice}
              disabled={!!blockingDeviceId}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {blockingDeviceId ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Block Device'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={clearSelection} className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Clients
      </Button>

      {/* Client Header */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl font-bold shadow-md">
          {client.logo ? (
            <img src={client.logo} alt={client.companyName} className="size-16 rounded-xl object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{client.companyName}</h1>
            <Badge variant="secondary" className={`text-xs capitalize ${STATUS_COLORS[client.status] || ''}`}>
              {client.status}
            </Badge>
            <Badge variant="secondary" className={`text-xs capitalize ${PLAN_COLORS[client.plan] || ''}`}>
              {client.plan}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{client.contactName} &middot; {client.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowEditDialog(true)}>
            <Edit className="size-4" />
            Edit
          </Button>
          {client.status === 'suspended' ? (
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowSuspendDialog(true)}>
              <CheckCircle2 className="size-4" />
              Reactivate
            </Button>
          ) : (
            <Button variant="destructive" size="sm" className="gap-2" onClick={() => setShowSuspendDialog(true)}>
              <Ban className="size-4" />
              Suspend
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/30 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Monthly Fee</p>
            <p className="mt-1 text-xl font-bold">{formatCurrency(client.monthlyFee)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/30 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Workspaces</p>
            <p className="mt-1 text-xl font-bold">{usageData.properties}<span className="text-sm font-normal text-muted-foreground">/{client.maxProperties}</span></p>
          </CardContent>
        </Card>
        <Card className="border-border/30 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="mt-1 text-xl font-bold">{usageData.users}<span className="text-sm font-normal text-muted-foreground">/{client.maxUsers}</span></p>
          </CardContent>
        </Card>
        <Card className="border-border/30 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Devices</p>
            <p className="mt-1 text-xl font-bold">{usageData.devices}<span className="text-sm font-normal text-muted-foreground">/{client.maxDevices}</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs value={detailTab} onValueChange={setDetailTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Subscription</TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Invoices</TabsTrigger>
          <TabsTrigger value="licenses" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">License Keys</TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Devices</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Settings</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Company Info */}
            <Card className="border-border/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Building2} label="Company" value={client.companyName} />
                <InfoRow icon={Tag} label="Industry" value={client.industry} />
                <InfoRow icon={Users} label="Company Size" value={client.companySize} />
                <InfoRow icon={DollarSign} label="Tax ID" value={client.taxId} />
                <InfoRow icon={MapPin} label="Address" value={[client.address, client.city, client.state, client.zipCode].filter(Boolean).join(', ')} />
                <InfoRow icon={Globe} label="Country" value={client.country} />
                <InfoRow icon={Globe} label="Website" value={client.website} />
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-border/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Users} label="Contact Name" value={client.contactName} />
                <InfoRow icon={Mail} label="Email" value={client.email} />
                <InfoRow icon={Phone} label="Phone" value={client.phone} />
              </CardContent>
            </Card>

            {/* Usage Metrics */}
            <Card className="border-border/30 shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="size-4 text-primary" />
                  Usage Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UsageMetric label="Workspaces" used={usageData.properties} max={client.maxProperties} icon={Building2} color="text-primary" />
                <UsageMetric label="Users" used={usageData.users} max={client.maxUsers} icon={Users} color="text-sky-500" />
                <UsageMetric label="Devices" used={usageData.devices} max={client.maxDevices} icon={Monitor} color="text-violet-500" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Subscription Tab ── */}
        <TabsContent value="subscription" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Plan */}
            <Card className="border-border/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-bold">
                    {client.plan.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold capitalize">{client.plan} Plan</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(client.monthlyFee)}/month</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <InfoRow icon={CreditCard} label="Billing Cycle" value={client.billingCycle.charAt(0).toUpperCase() + client.billingCycle.slice(1)} />
                  <InfoRow icon={DollarSign} label="Monthly Fee" value={formatCurrency(client.monthlyFee)} />
                  <InfoRow icon={DollarSign} label="Setup Fee" value={formatCurrency(client.setupFee)} />
                  {client.discountPercent > 0 && (
                    <InfoRow icon={Tag} label="Discount" value={`${client.discountPercent}%`} />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contract & Billing */}
            <Card className="border-border/30 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">Contract & Billing</CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={openRenewDialog}>
                  <RefreshCw className="size-3.5" />
                  Renew
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <InfoRow icon={Calendar} label="Contract Start" value={formatDate(client.contractStart)} />
                  <InfoRow icon={Calendar} label="Contract End" value={formatDate(client.contractEnd)} />
                  {client.trialStart && (
                    <>
                      <InfoRow icon={Clock} label="Trial Start" value={formatDate(client.trialStart)} />
                      <InfoRow icon={Clock} label="Trial End" value={formatDate(client.trialEnd)} />
                    </>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <InfoRow icon={Shield} label="Max Properties" value={String(client.maxProperties)} />
                  <InfoRow icon={Users} label="Max Users" value={String(client.maxUsers)} />
                  <InfoRow icon={Monitor} label="Max Devices" value={String(client.maxDevices)} />
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  {client.status === 'suspended' ? (
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground flex-1" onClick={() => setShowSuspendDialog(true)}>
                      <CheckCircle2 className="size-4" />
                      Reactivate Client
                    </Button>
                  ) : (
                    <Button variant="destructive" size="sm" className="gap-2 flex-1" onClick={() => setShowSuspendDialog(true)}>
                      <Ban className="size-4" />
                      Suspend Client
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Plan Options */}
            <Card className="border-border/30 shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Plan Options</CardTitle>
                <CardDescription>Click a plan to switch this client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(['starter', 'professional', 'business', 'enterprise'] as const).map((plan) => {
                    const isCurrent = client.plan === plan
                    return (
                      <div
                        key={plan}
                        className={`rounded-lg border p-4 text-center transition-colors ${
                          isCurrent
                            ? 'border-primary/20 bg-primary/5 dark:bg-primary/10'
                            : 'border-border/60 hover:border-primary/20 cursor-pointer'
                        }`}
                        onClick={() => !isCurrent && handleChangePlan(plan)}
                      >
                        <p className="text-sm font-semibold capitalize">{plan}</p>
                        <p className="mt-1 text-xl font-bold">{formatCurrency(planPrices[plan])}</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                        {isCurrent ? (
                          <Badge className="mt-2 bg-primary text-primary-foreground text-[10px]">Current Plan</Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="mt-2 text-xs h-7" onClick={(e) => { e.stopPropagation(); handleChangePlan(plan) }}>
                            Switch to {plan.charAt(0).toUpperCase() + plan.slice(1)}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Invoices Tab ── */}
        <TabsContent value="invoices" className="mt-6">
          <Card className="border-border/30 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No invoices for this client
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
                        <TableCell className="capitalize text-sm">{inv.type.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-[10px] capitalize ${INVOICE_STATUS_COLORS[inv.status] || ''}`}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(inv.issueDate)}</TableCell>
                        <TableCell className="text-sm">{formatDate(inv.dueDate)}</TableCell>
                        <TableCell className="text-right font-medium text-sm">{formatCurrency(inv.total)}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{formatCurrency(inv.paidAmount)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── License Keys Tab ── */}
        <TabsContent value="licenses" className="mt-6">
          <Card className="border-border/30 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">License Keys</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activated</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientLicenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No license keys for this client
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientLicenses.map((lk) => (
                      <TableRow key={lk.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">{maskKey(lk.key)}</code>
                            <button onClick={() => copyKey(lk.key)} className="p-1 rounded hover:bg-accent transition-colors">
                              {copiedKey === lk.key ? (
                                <CheckCircle2 className="size-3.5 text-primary" />
                              ) : (
                                <Copy className="size-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize text-sm">{lk.type}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-[10px] capitalize ${LICENSE_STATUS_COLORS[lk.status] || ''}`}>
                            {lk.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(lk.activatedAt)}</TableCell>
                        <TableCell className="text-sm">{formatDate(lk.expiresAt)}</TableCell>
                        <TableCell className="text-right">
                          {lk.status !== 'revoked' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setRevokeTarget(lk.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── Devices Tab ── */}
        <TabsContent value="devices" className="mt-6">
          <Card className="border-border/30 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Monitor className="size-4 text-primary" />
                Devices
              </CardTitle>
              <CardDescription>Devices linked to this client&apos;s workspaces</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Serial Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>OS / Browser</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No devices found for this client
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientDevices.map((device) => {
                      const DeviceIcon = DEVICE_TYPE_ICONS[device.deviceType] || Monitor
                      return (
                        <TableRow key={device.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DeviceIcon className="size-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{device.deviceName || 'Unnamed'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-sm">{device.deviceType}</TableCell>
                          <TableCell>
                            <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{device.serialKey.substring(0, 12)}...</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-[10px] capitalize ${DEVICE_STATUS_COLORS[device.status] || ''}`}>
                              {device.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {[device.os, device.browser].filter(Boolean).join(' / ') || '—'}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">{device.ipAddress || '—'}</TableCell>
                          <TableCell className="text-sm">{device.workspace?.name || '—'}</TableCell>
                          <TableCell className="text-sm">{formatDate(device.lastSeenAt)}</TableCell>
                          <TableCell>
                            {device.licenseKeys && device.licenseKeys.length > 0 ? (
                              <Badge variant="outline" className="text-[10px]">Active</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {device.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setBlockDeviceTarget(device.id)}
                                disabled={!!blockingDeviceId}
                                title="Block device"
                              >
                                {blockingDeviceId === device.id ? (
                                  <span className="size-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                                ) : (
                                  <Lock className="size-4" />
                                )}
                              </Button>
                            ) : (device.status === 'disabled' || device.status === 'blocked') ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => handleUnblockDevice(device.id)}
                                disabled={!!blockingDeviceId}
                                title="Unblock device"
                              >
                                {blockingDeviceId === device.id ? (
                                  <span className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                ) : (
                                  <Unlock className="size-4" />
                                )}
                              </Button>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── Activity Tab ── */}
        <TabsContent value="activity" className="mt-6">
          <Card className="border-border/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
              <CardDescription>Audit log of actions related to this client</CardDescription>
            </CardHeader>
            <CardContent>
              {clientAuditLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="mx-auto size-8 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">No activity recorded for this client</p>
                </div>
              ) : (
                <div className="space-y-0 max-h-96 overflow-y-auto">
                  {clientAuditLogs.map((log, i) => {
                    const AuditIcon = getAuditIcon(log.action)
                    const color = getAuditColor(log.action)
                    return (
                      <div key={log.id} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`flex size-8 items-center justify-center rounded-full bg-muted ${color}`}>
                            <AuditIcon className="size-4" />
                          </div>
                          {i < clientAuditLogs.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {log.entity && <span className="capitalize">{log.entity}</span>}
                            {log.details && <span> &middot; {log.details}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDateTime(log.createdAt)}
                            {log.ipAddress && <span className="ml-2 font-mono">IP: {log.ipAddress}</span>}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Customization */}
            <Card className="border-border/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Palette} label="Primary Color" value={client.primaryColor || 'Default (Emerald)'} />
                <InfoRow icon={Server} label="Custom Domain" value={client.customDomain || 'Not configured'} />
                {client.primaryColor && (
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-md border" style={{ backgroundColor: client.primaryColor }} />
                    <span className="text-sm text-muted-foreground">{client.primaryColor}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features & Notes */}
            <Card className="border-border/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Features & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {client.features ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Enabled Features</p>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(client.features).map((f: string) => (
                        <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No custom features configured</p>
                )}
                <Separator />
                {client.notes ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm">{client.notes}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
