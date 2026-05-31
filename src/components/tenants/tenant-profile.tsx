'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  Shield,
  FileText,
  MessageSquare,
  CreditCard,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  ExternalLink,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Tenant } from '@/stores/tenant-store'

// ── Extended types matching API response ─────────────────────────────────────

interface CurrentLease {
  id: string
  propertyId: string
  unitId: string
  tenantId: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: string
  type: string
  terms: string | null
  workspaceId: string
  createdAt: string
  updatedAt: string
  property: { id: string; name: string }
  unit: { id: string; unitNumber: string; rent: number }
}

interface TenantStats {
  totalPaid: number
  totalOwed: number
  overdueCount: number
  totalPayments: number
  totalTickets: number
  totalMessages: number
}

interface PaymentRecord {
  id: string
  amount: number
  status: string
  dueDate: string
  paidDate: string | null
  type: string
}

interface TenantProfileData {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  type: string
  company: string | null
  idNumber: string | null
  emergencyName: string | null
  emergencyPhone: string | null
  moveInDate: string | null
  moveOutDate: string | null
  status: string
  notes: string | null
  workspaceId: string
  createdAt: string
  updatedAt: string
  currentLease?: CurrentLease | null
  stats?: TenantStats
  payments?: PaymentRecord[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20'
    case 'inactive':
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
    case 'overdue':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
  }
}

function getPaymentStatusIcon(status: string) {
  switch (status) {
    case 'paid':
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />
    case 'overdue':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20'
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'overdue':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
  }
}

function getLeaseStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20'
    case 'expiring':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'expired':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
  }
}

// ── Props ────────────────────────────────────────────────────────────────────

interface TenantProfileProps {
  tenant: TenantProfileData
  onBack: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function TenantProfile({ tenant, onBack }: TenantProfileProps) {
  const formatDate = (date: string | null) => {
    if (!date) return '—'
    try {
      return format(new Date(date), 'MMM d, yyyy')
    } catch {
      return date
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Compute days remaining on lease
  const daysRemaining = tenant.currentLease
    ? Math.max(0, Math.ceil((new Date(tenant.currentLease.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Tenants
      </Button>

      {/* Tenant Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          {tenant.avatar ? (
            <AvatarImage src={tenant.avatar} alt={tenant.name} />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl font-semibold">
            {getInitials(tenant.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight">{tenant.name}</h2>
            <Badge className={`text-xs border capitalize ${getStatusColor(tenant.status)}`}>
              {tenant.status}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {tenant.type === 'individual' ? (
                <User className="mr-1 h-3 w-3" />
              ) : (
                <Building2 className="mr-1 h-3 w-3" />
              )}
              {tenant.type}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {tenant.email}
            </span>
            {tenant.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {tenant.phone}
              </span>
            )}
            {tenant.company && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> {tenant.company}
              </span>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:inline-flex h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm gap-1">
            <User className="h-3.5 w-3.5 hidden sm:block" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="lease" className="text-xs sm:text-sm gap-1">
            <Home className="h-3.5 w-3.5 hidden sm:block" />
            Lease
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm gap-1">
            <CreditCard className="h-3.5 w-3.5 hidden sm:block" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="communications" className="text-xs sm:text-sm gap-1">
            <MessageSquare className="h-3.5 w-3.5 hidden sm:block" />
            Comms
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm gap-1">
            <FileText className="h-3.5 w-3.5 hidden sm:block" />
            Docs
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{tenant.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">{tenant.phone || '—'}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {tenant.type}
                  </Badge>
                </div>
                {tenant.company && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Company</span>
                      <span className="text-sm font-medium">{tenant.company}</span>
                    </div>
                  </>
                )}
                {tenant.idNumber && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ID Number</span>
                      <span className="text-sm font-medium">{tenant.idNumber}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{tenant.emergencyName || '—'}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">{tenant.emergencyPhone || '—'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Move-in / Move-out */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Tenancy Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Move-in Date</span>
                  <span className="text-sm font-medium">{formatDate(tenant.moveInDate)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Move-out Date</span>
                  <span className="text-sm font-medium">{formatDate(tenant.moveOutDate)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium">{formatDate(tenant.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Quick View */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Paid</span>
                  <span className="text-sm font-semibold text-primary">
                    {formatCurrency(tenant.stats?.totalPaid ?? 0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Outstanding</span>
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {formatCurrency(tenant.stats?.totalOwed ?? 0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overdue Payments</span>
                  <Badge className={`text-xs border ${tenant.stats?.overdueCount ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800' : 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/20'}`}>
                    {tenant.stats?.overdueCount ?? 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {tenant.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{tenant.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Lease Tab ───────────────────────────────────────────────────── */}
        <TabsContent value="lease" className="space-y-6">
          {tenant.currentLease ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Lease Details</CardTitle>
                    <Badge className={`text-xs border capitalize ${getLeaseStatusColor(tenant.currentLease.status)}`}>
                      {tenant.currentLease.status}
                    </Badge>
                  </div>
                  <CardDescription>Lease #{tenant.currentLease.id.slice(-8).toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Property</span>
                    <span className="text-sm font-medium">{tenant.currentLease.property.name}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unit</span>
                    <span className="text-sm font-medium">{tenant.currentLease.unit.unitNumber}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lease Type</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {tenant.currentLease.type}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Remaining</span>
                    <Badge variant="outline" className={`text-xs ${daysRemaining !== null && daysRemaining <= 30 ? 'text-amber-600 border-amber-300' : ''}`}>
                      {daysRemaining !== null ? `${daysRemaining} days` : '—'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Lease Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span className="text-sm font-medium">{formatDate(tenant.currentLease.startDate)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span className="text-sm font-medium">{formatDate(tenant.currentLease.endDate)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Rent</span>
                    <span className="text-sm font-semibold">{formatCurrency(tenant.currentLease.monthlyRent)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Security Deposit</span>
                    <span className="text-sm font-medium">{formatCurrency(tenant.currentLease.deposit)}</span>
                  </div>
                  {tenant.currentLease.terms && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Terms</span>
                        <p className="text-sm bg-muted/50 rounded-md p-3 whitespace-pre-wrap">
                          {tenant.currentLease.terms}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Home className="h-10 w-10 mb-3 opacity-50" />
                <p className="font-medium">No Active Lease</p>
                <p className="text-sm">This tenant does not have an active lease.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Payments Tab ────────────────────────────────────────────────── */}
        <TabsContent value="payments" className="space-y-6">
          {/* Payment Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(tenant.stats?.totalPaid ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(tenant.stats?.totalOwed ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Overdue</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {tenant.stats?.overdueCount ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Payments</p>
                <p className="text-lg font-bold">{tenant.stats?.totalPayments ?? 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment History Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-xs font-semibold uppercase">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase">Type</TableHead>
                      <TableHead className="text-xs font-semibold uppercase">Amount</TableHead>
                      <TableHead className="text-xs font-semibold uppercase">Due Date</TableHead>
                      <TableHead className="text-xs font-semibold uppercase">Paid Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenant.payments && tenant.payments.length > 0 ? (
                      tenant.payments.map((payment, i) => (
                        <TableRow key={payment.id} className={i % 2 === 1 ? 'bg-muted/20' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentStatusIcon(payment.status)}
                              <Badge className={`text-xs border capitalize ${getPaymentStatusColor(payment.status)}`}>
                                {payment.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm capitalize">{payment.type}</TableCell>
                          <TableCell className="text-sm font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(payment.dueDate)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(payment.paidDate)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No payment records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Communications Tab ──────────────────────────────────────────── */}
        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Communication Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {(tenant.stats?.totalMessages ?? 0) > 0 ? (
                <div className="space-y-4">
                  {/* Placeholder timeline - in production would fetch real messages */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium">Lease renewal discussion</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Email · Outbound · 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment confirmation</p>
                      <p className="text-xs text-muted-foreground mt-0.5">SMS · Inbound · 5 days ago</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-3 opacity-50" />
                  <p className="font-medium">No Communications</p>
                  <p className="text-sm">No messages have been exchanged with this tenant.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documents Tab ───────────────────────────────────────────────── */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Documents</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Placeholder documents */}
                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Lease Agreement</p>
                    <p className="text-xs text-muted-foreground">PDF · 2.4 MB · Uploaded Jan 15, 2025</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Insurance Certificate</p>
                    <p className="text-xs text-muted-foreground">PDF · 1.1 MB · Uploaded Dec 3, 2024</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Move-in Inspection Report</p>
                    <p className="text-xs text-muted-foreground">PDF · 3.8 MB · Uploaded Nov 20, 2024</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
