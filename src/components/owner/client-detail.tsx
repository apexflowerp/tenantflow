'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Building2, Mail, Phone, Globe, MapPin, Calendar,
  DollarSign, Users, HomeIcon, Monitor, CreditCard, CheckCircle2,
  Clock, Shield, Key, FileText, Activity, Settings, Edit,
  ExternalLink, Copy, AlertCircle, Tag, Palette, Server,
} from 'lucide-react'
import { useOwnerStore, type ClientData } from '@/stores/owner-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

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

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

// ── Client Detail View ──

export function ClientDetail() {
  const { selectedClient: client, clearSelection, fetchLicenseKeys, fetchInvoices, licenseKeys, invoices } = useOwnerStore()
  const [detailTab, setDetailTab] = React.useState('overview')
  const [clientLicenses, setClientLicenses] = React.useState<any[]>([])
  const [clientInvoices, setClientInvoices] = React.useState<any[]>([])
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (client) {
      fetchLicenseKeys()
      fetchInvoices()
    }
  }, [client, fetchLicenseKeys, fetchInvoices])

  React.useEffect(() => {
    if (client && licenseKeys.length > 0) {
      setClientLicenses(licenseKeys.filter(lk => lk.clientId === client.id))
    }
    if (client && invoices.length > 0) {
      setClientInvoices(invoices.filter(inv => inv.clientId === client.id))
    }
  }, [client, licenseKeys, invoices])

  if (!client) return null

  const initials = client.companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  // Simulated usage data (would come from API in real app)
  const usageData = {
    properties: { used: Math.floor(client.maxProperties * 0.6), max: client.maxProperties },
    users: { used: Math.floor(client.maxUsers * 0.5), max: client.maxUsers },
    devices: { used: Math.floor(client.maxDevices * 0.4), max: client.maxDevices },
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Activity timeline from audit logs (simulated)
  const activityItems = [
    { id: 1, action: 'Client created', date: client.createdAt, icon: Building2, color: 'text-primary' },
    { id: 2, action: 'Plan upgraded to ' + client.plan, date: client.updatedAt, icon: ArrowLeft, color: 'text-violet-500' },
    { id: 3, action: 'License key activated', date: client.updatedAt, icon: Key, color: 'text-sky-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
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
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="size-4" />
          Edit
        </Button>
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
            <p className="text-xs text-muted-foreground">Properties</p>
            <p className="mt-1 text-xl font-bold">{usageData.properties.used}<span className="text-sm font-normal text-muted-foreground">/{usageData.properties.max}</span></p>
          </CardContent>
        </Card>
        <Card className="border-border/30 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="mt-1 text-xl font-bold">{usageData.users.used}<span className="text-sm font-normal text-muted-foreground">/{usageData.users.max}</span></p>
          </CardContent>
        </Card>
        <Card className="border-border/30 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Devices</p>
            <p className="mt-1 text-xl font-bold">{usageData.devices.used}<span className="text-sm font-normal text-muted-foreground">/{usageData.devices.max}</span></p>
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
                <UsageMetric label="Properties" used={usageData.properties.used} max={usageData.properties.max} icon={HomeIcon} color="text-primary" />
                <UsageMetric label="Users" used={usageData.users.used} max={usageData.users.max} icon={Users} color="text-sky-500" />
                <UsageMetric label="Devices" used={usageData.devices.used} max={usageData.devices.max} icon={Monitor} color="text-violet-500" />
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
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Contract & Billing</CardTitle>
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
              </CardContent>
            </Card>

            {/* Plan Options */}
            <Card className="border-border/30 shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Plan Options</CardTitle>
                <CardDescription>Available plans for this client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {['starter', 'professional', 'business', 'enterprise'].map((plan) => {
                    const prices: Record<string, number> = { starter: 49, professional: 149, business: 349, enterprise: 799 }
                    const isCurrent = client.plan === plan
                    return (
                      <div
                        key={plan}
                        className={`rounded-lg border p-4 text-center transition-colors ${
                          isCurrent
                            ? 'border-primary/20 bg-primary/5 dark:bg-primary/10'
                            : 'border-border/60 hover:border-primary/20'
                        }`}
                      >
                        <p className="text-sm font-semibold capitalize">{plan}</p>
                        <p className="mt-1 text-xl font-bold">{formatCurrency(prices[plan])}</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                        {isCurrent && (
                          <Badge className="mt-2 bg-primary text-primary-foreground text-[10px]">Current Plan</Badge>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientLicenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                      </TableRow>
                    ))
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
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {activityItems.map((item, i) => {
                  const ItemIcon = item.icon
                  return (
                    <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`flex size-8 items-center justify-center rounded-full bg-muted ${item.color}`}>
                          <ItemIcon className="size-4" />
                        </div>
                        {i < activityItems.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
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
