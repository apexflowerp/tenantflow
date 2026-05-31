'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Building2,
  Users,
  CreditCard,
  Bell,
  Shield,
  Puzzle,
  Key,
  ChevronRight,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Check,
  ExternalLink,
  Globe,
  Upload,
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
  AlertTriangle,
  Clock,
  Lock,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { SettingsSection, SettingsFormRow } from './settings-section'
import { cn } from '@/lib/utils'

// ── Settings Category Config ─────────────────────────────────────────────────

const categories = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'api-keys', label: 'API Keys', icon: Key },
]

// ── Mock Users Data ──────────────────────────────────────────────────────────

const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@tenantflow.io', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus.johnson@tenantflow.io', role: 'Manager', status: 'active', lastLogin: '1 day ago' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@tenantflow.io', role: 'Member', status: 'active', lastLogin: '2 days ago' },
  { id: '4', name: 'David Kim', email: 'david.kim@tenantflow.io', role: 'Member', status: 'active', lastLogin: '3 days ago' },
  { id: '5', name: 'Rachel Patel', email: 'rachel.patel@tenantflow.io', role: 'Member', status: 'active', lastLogin: '1 day ago' },
]

// ── Mock API Keys ────────────────────────────────────────────────────────────

const mockApiKeys = [
  { id: '1', name: 'Production API Key', key: 'tf_live_sk_a1b2c3d4e5f6g7h8i9j0', created: 'Jan 15, 2026', lastUsed: '2 hours ago', permissions: ['read', 'write'] },
  { id: '2', name: 'Development API Key', key: 'tf_test_sk_z9y8x7w6v5u4t3s2r1q0', created: 'Feb 3, 2026', lastUsed: '5 days ago', permissions: ['read'] },
]

// ── Integration Cards ────────────────────────────────────────────────────────

const integrations = [
  { id: 'stripe', name: 'Stripe', description: 'Payment processing', icon: CreditCard, connected: true, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting sync', icon: Globe, connected: false, color: 'text-primary', bg: 'bg-primary/10 dark:bg-primary/20' },
  { id: 'slack', name: 'Slack', description: 'Team notifications', icon: MessageSquare, connected: true, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'google', name: 'Google Workspace', description: 'Calendar & email', icon: Mail, connected: false, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  { id: 'microsoft', name: 'Microsoft 365', description: 'Office integration', icon: Monitor, connected: false, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30' },
  { id: 'twilio', name: 'Twilio', description: 'SMS & voice', icon: Smartphone, connected: false, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
]

// ── Plans ─────────────────────────────────────────────────────────────────────

const plans = [
  { id: 'starter', name: 'Starter', price: '$29', period: '/mo', features: ['Up to 5 properties', '50 units', 'Basic reporting', 'Email support'], current: false },
  { id: 'professional', name: 'Professional', price: '$79', period: '/mo', features: ['Up to 25 properties', '250 units', 'Advanced analytics', 'Priority support', 'AI Copilot'], current: true },
  { id: 'business', name: 'Business', price: '$199', period: '/mo', features: ['Unlimited properties', 'Unlimited units', 'Custom integrations', 'Dedicated support', 'API access', 'SSO'], current: false },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Business', 'Custom SLA', 'On-premise option', 'Training & onboarding', 'Custom contracts'], current: false },
]

// ── Role Colors ──────────────────────────────────────────────────────────────

const roleColors: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Manager: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Member: 'bg-primary/10 text-primary dark:bg-primary/20',
  Viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

// ── General Settings ─────────────────────────────────────────────────────────

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="General Settings" description="Manage your workspace preferences and defaults">
        <div className="space-y-1">
          <SettingsFormRow label="Workspace Name" description="The name of your property management workspace">
            <Input defaultValue="TenantFlow HQ" />
          </SettingsFormRow>
          <SettingsFormRow label="Workspace Logo" description="Upload your company logo (max 2MB)">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/30">
                <Building2 className="size-6 text-muted-foreground/50" />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Upload className="size-3.5" />
                Upload
              </Button>
            </div>
          </SettingsFormRow>
          <SettingsFormRow label="Default Currency" description="Currency used for all financial transactions">
            <Select defaultValue="USD">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFormRow>
          <SettingsFormRow label="Default Timezone" description="Timezone for scheduling and timestamps">
            <Select defaultValue="America/New_York">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFormRow>
          <SettingsFormRow label="Language" description="Preferred language for the interface">
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFormRow>
          <SettingsFormRow label="Date Format" description="How dates are displayed across the platform">
            <Select defaultValue="MM/DD/YYYY">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFormRow>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
          <Check className="size-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

// ── Workspace Settings ───────────────────────────────────────────────────────

function WorkspaceSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Workspace Details" description="Configure your workspace information">
        <div className="space-y-1">
          <SettingsFormRow label="Company Name" description="Legal entity name">
            <Input defaultValue="TenantFlow Inc." />
          </SettingsFormRow>
          <SettingsFormRow label="Industry Type" description="Primary business sector">
            <Select defaultValue="property-management">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property-management">Rental Management</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="commercial">Commercial Leasing</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFormRow>
          <SettingsFormRow label="Company Size" description="Number of employees">
            <Select defaultValue="11-50">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="500+">500+</SelectItem>
              </SelectContent>
            </Select>
          </SettingsFormRow>
        </div>
      </SettingsSection>

      <SettingsSection title="Address" description="Your company's primary address">
        <div className="space-y-1">
          <SettingsFormRow label="Street Address">
            <Input defaultValue="450 Park Avenue" />
          </SettingsFormRow>
          <SettingsFormRow label="City">
            <Input defaultValue="New York" />
          </SettingsFormRow>
          <SettingsFormRow label="State">
            <Input defaultValue="NY" />
          </SettingsFormRow>
          <SettingsFormRow label="Zip Code">
            <Input defaultValue="10022" />
          </SettingsFormRow>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
          <Check className="size-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

// ── Users & Roles Settings ───────────────────────────────────────────────────

function UsersRolesSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Team Members" description="Manage who has access to your workspace">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{mockUsers.length} team members</p>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-3.5" />
            Invite User
          </Button>
        </div>
        <div className="rounded-lg border border-border/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Email</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Last Login</TableHead>
                <TableHead className="text-xs w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[10px] font-medium bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-400">
                          {user.name.split(' ').map(w => w[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn('text-[10px] border-0', roleColors[user.role] || roleColors.Member)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="size-7 p-0">
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsSection>

      <SettingsSection title="Role Definitions" description="Permission levels for workspace access">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: 'Admin', desc: 'Full access to all features and settings', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            { name: 'Manager', desc: 'Manage properties, tenants, and reports', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
            { name: 'Member', desc: 'Standard access to assigned modules', color: 'bg-primary/10 text-primary dark:bg-primary/20' },
            { name: 'Viewer', desc: 'Read-only access to dashboards and reports', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
          ].map((role) => (
            <div
              key={role.name}
              className="rounded-lg border border-border/30 p-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className={cn('text-[10px] border-0', role.color)}>
                  {role.name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{role.desc}</p>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  )
}

// ── Billing Settings ─────────────────────────────────────────────────────────

function BillingSettings() {
  return (
    <div className="space-y-6">
      {/* Current plan */}
      <SettingsSection title="Current Plan" description="Your subscription details">
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Professional</h3>
                <Badge className="bg-primary/10 text-primary dark:bg-primary/20 border-0 text-[10px]">
                  Current Plan
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">$79/month · Renews on Jul 1, 2026</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Manage Plan
            </Button>
          </div>
        </div>
      </SettingsSection>

      {/* Plan comparison */}
      <SettingsSection title="Available Plans" description="Compare plans and upgrade">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'rounded-lg border p-4 transition-colors',
                plan.current
                  ? 'border-primary bg-primary/5'
                  : 'border-border/30 hover:border-primary/30'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{plan.name}</h4>
                {plan.current && (
                  <Badge className="bg-primary/10 text-primary dark:bg-primary/20 border-0 text-[10px]">
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-0.5 mb-3">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-1.5 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="size-3 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? 'outline' : 'default'}
                size="sm"
                className={cn(
                  'w-full text-xs',
                  !plan.current && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Usage stats */}
      <SettingsSection title="Usage" description="Your current resource usage">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Properties', used: 6, limit: 25, unit: '' },
            { label: 'Units', used: 24, limit: 250, unit: '' },
            { label: 'API Calls', used: 12450, limit: 50000, unit: '' },
          ].map((stat) => {
            const pct = Math.min((stat.used / stat.limit) * 100, 100)
            return (
              <div key={stat.label} className="rounded-lg border border-border/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-bold">{stat.used.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">/ {stat.limit.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      pct > 80 ? 'bg-amber-500' : 'bg-primary'
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SettingsSection>

      {/* Payment method */}
      <SettingsSection title="Payment Method" description="How you pay for your subscription">
        <div className="flex items-center gap-4 rounded-lg border border-border/30 p-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
            <CreditCard className="size-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Visa ending in 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/2027</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Update
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}

// ── Notification Settings ────────────────────────────────────────────────────

function NotificationSettings() {
  const [emailNotifs, setEmailNotifs] = React.useState(true)
  const [smsNotifs, setSmsNotifs] = React.useState(false)
  const [pushNotifs, setPushNotifs] = React.useState(true)
  const [inAppNotifs, setInAppNotifs] = React.useState(true)

  const [paymentReminders, setPaymentReminders] = React.useState(true)
  const [leaseRenewals, setLeaseRenewals] = React.useState(true)
  const [maintenanceUpdates, setMaintenanceUpdates] = React.useState(true)
  const [announcements, setAnnouncements] = React.useState(false)

  return (
    <div className="space-y-6">
      <SettingsSection title="Notification Channels" description="Choose how you receive notifications">
        <div className="space-y-1">
          <SettingsFormRow label="Email Notifications" description="Receive notifications via email">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
          </SettingsFormRow>
          <SettingsFormRow label="SMS Alerts" description="Receive critical alerts via text message">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-muted-foreground" />
              <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
            </div>
          </SettingsFormRow>
          <SettingsFormRow label="Push Notifications" description="Browser and mobile push alerts">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-muted-foreground" />
              <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
            </div>
          </SettingsFormRow>
          <SettingsFormRow label="In-App Notifications" description="Show notifications within the app">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-muted-foreground" />
              <Switch checked={inAppNotifs} onCheckedChange={setInAppNotifs} />
            </div>
          </SettingsFormRow>
        </div>
      </SettingsSection>

      <SettingsSection title="Notification Categories" description="Fine-tune which notifications you receive">
        <div className="space-y-1">
          <SettingsFormRow label="Payment Reminders" description="Upcoming and overdue payment alerts">
            <Switch checked={paymentReminders} onCheckedChange={setPaymentReminders} />
          </SettingsFormRow>
          <SettingsFormRow label="Lease Renewals" description="Expiring lease and renewal notifications">
            <Switch checked={leaseRenewals} onCheckedChange={setLeaseRenewals} />
          </SettingsFormRow>
          <SettingsFormRow label="Maintenance Updates" description="Ticket status changes and assignments">
            <Switch checked={maintenanceUpdates} onCheckedChange={setMaintenanceUpdates} />
          </SettingsFormRow>
          <SettingsFormRow label="Announcements" description="Community and property-wide announcements">
            <Switch checked={announcements} onCheckedChange={setAnnouncements} />
          </SettingsFormRow>
        </div>
      </SettingsSection>
    </div>
  )
}

// ── Security Settings ────────────────────────────────────────────────────────

function SecuritySettings() {
  const [twoFactor, setTwoFactor] = React.useState(false)
  const [ipRestrictions, setIpRestrictions] = React.useState(false)

  return (
    <div className="space-y-6">
      <SettingsSection title="Authentication" description="Secure your account access">
        <div className="space-y-1">
          <SettingsFormRow label="Two-Factor Authentication" description="Add an extra layer of security to your account">
            <div className="flex items-center gap-3">
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              {twoFactor && (
                <Badge className="bg-primary/10 text-primary dark:bg-primary/20 border-0 text-[10px]">
                  Enabled
                </Badge>
              )}
            </div>
          </SettingsFormRow>
          <SettingsFormRow label="Change Password" description="Update your account password">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Lock className="size-3.5" />
              Change Password
            </Button>
          </SettingsFormRow>
        </div>
      </SettingsSection>

      <SettingsSection title="Session Management" description="Monitor and control active sessions">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-border/30 p-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="size-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Current Session</p>
              <p className="text-xs text-muted-foreground">Chrome on macOS · New York, US</p>
            </div>
            <Badge className="bg-primary/10 text-primary dark:bg-primary/20 border-0 text-[10px]">
              Active
            </Badge>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/30 p-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted/50">
              <Smartphone className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mobile App</p>
              <p className="text-xs text-muted-foreground">iPhone · Last active 2h ago</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-destructive">
              Revoke
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Password Policy" description="Requirements for user passwords">
        <div className="space-y-2">
          {[
            { label: 'Minimum 8 characters', checked: true },
            { label: 'Require uppercase letters', checked: true },
            { label: 'Require numbers', checked: true },
            { label: 'Require special characters', checked: false },
            { label: 'Password expiry (90 days)', checked: false },
          ].map((policy) => (
            <div key={policy.label} className="flex items-center gap-2">
              <div className={cn(
                'flex size-4 items-center justify-center rounded border',
                policy.checked
                  ? 'bg-primary border-primary'
                  : 'border-border/60'
              )}>
                {policy.checked && <Check className="size-3 text-white" />}
              </div>
              <span className="text-sm text-muted-foreground">{policy.label}</span>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="IP Restrictions" description="Limit access to specific IP addresses">
        <div className="space-y-1">
          <SettingsFormRow label="Enable IP Restrictions" description="Only allow access from approved IP addresses">
            <Switch checked={ipRestrictions} onCheckedChange={setIpRestrictions} />
          </SettingsFormRow>
          {ipRestrictions && (
            <div className="pt-2">
              <div className="flex gap-2">
                <Input placeholder="Enter IP address (e.g., 192.168.1.0/24)" className="text-sm" />
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                  Add
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {['10.0.0.0/8', '192.168.1.0/24'].map((ip) => (
                  <div key={ip} className="flex items-center justify-between rounded-md border border-border/30 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span className="text-sm font-mono">{ip}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="size-7 p-0 text-destructive">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  )
}

// ── Integrations Settings ────────────────────────────────────────────────────

function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Connected Services" description="Manage third-party integrations">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <div
                key={integration.id}
                className="rounded-lg border border-border/30 p-4 hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('flex size-10 items-center justify-center rounded-lg', integration.bg)}>
                    <Icon className={cn('size-5', integration.color)} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-[10px] border-0',
                      integration.connected
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {integration.connected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold">{integration.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                <Button
                  variant={integration.connected ? 'outline' : 'default'}
                  size="sm"
                  className={cn(
                    'mt-3 w-full text-xs',
                    !integration.connected && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            )
          })}
        </div>
      </SettingsSection>
    </div>
  )
}

// ── API Keys Settings ────────────────────────────────────────────────────────

function ApiKeysSettings() {
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(new Set())

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const maskKey = (key: string) => {
    return key.slice(0, 12) + '•••••••••••••••••••'
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  return (
    <div className="space-y-6">
      <SettingsSection title="API Keys" description="Manage your API keys for programmatic access">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{mockApiKeys.length} active keys</p>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-3.5" />
            Generate New Key
          </Button>
        </div>

        <div className="space-y-3">
          {mockApiKeys.map((apiKey) => {
            const isVisible = visibleKeys.has(apiKey.id)
            return (
              <div
                key={apiKey.id}
                className="rounded-lg border border-border/30 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold">{apiKey.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Created {apiKey.created} · Last used {apiKey.lastUsed}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="size-8 p-0 text-destructive">
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <code className="text-xs font-mono flex-1 break-all">
                    {isVisible ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {isVisible ? (
                        <EyeOff className="size-3.5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-3.5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0"
                      onClick={() => copyKey(apiKey.key)}
                    >
                      <Copy className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  {apiKey.permissions.map((perm) => (
                    <Badge
                      key={perm}
                      variant="secondary"
                      className="text-[10px] border-0 bg-primary/10 text-primary dark:bg-primary/20"
                    >
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </SettingsSection>
    </div>
  )
}

// ── Settings Content Renderer ────────────────────────────────────────────────

function SettingsContent({ activeCategory }: { activeCategory: string }) {
  switch (activeCategory) {
    case 'general':
      return <GeneralSettings />
    case 'workspace':
      return <WorkspaceSettings />
    case 'users':
      return <UsersRolesSettings />
    case 'billing':
      return <BillingSettings />
    case 'notifications':
      return <NotificationSettings />
    case 'security':
      return <SecuritySettings />
    case 'integrations':
      return <IntegrationsSettings />
    case 'api-keys':
      return <ApiKeysSettings />
    default:
      return <GeneralSettings />
  }
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeCategory, setActiveCategory] = React.useState('general')
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gray-500/10">
          <Settings className="size-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your workspace and preferences</p>
        </div>
      </div>

      {/* Mobile category selector */}
      <div className="lg:hidden">
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left sidebar - categories */}
        <nav className="hidden lg:flex w-56 shrink-0 flex-col gap-1">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <Icon className={cn('size-4', isActive && 'text-primary')} />
                {cat.label}
              </button>
            )
          })}
        </nav>

        {/* Right panel - settings content */}
        <div className="flex-1 min-w-0">
          <SettingsContent activeCategory={activeCategory} />
        </div>
      </div>
    </motion.div>
  )
}
