'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  CreditCard,
  Wrench,
  FileText,
  Upload,
  Megaphone,
  TrendingUp,
  Palette,
  Users,
  Building2,
  Save,
  LogIn,
  Heart,
  BarChart3,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalFeature {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  tenantEnabled: boolean
  ownerEnabled: boolean
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL_FEATURES: PortalFeature[] = [
  { id: 'pf-001', name: 'Online Payments', description: 'Allow tenants/owners to make payments online', icon: CreditCard, tenantEnabled: true, ownerEnabled: true },
  { id: 'pf-002', name: 'Maintenance Requests', description: 'Submit and track maintenance tickets', icon: Wrench, tenantEnabled: true, ownerEnabled: false },
  { id: 'pf-003', name: 'Lease Signing', description: 'Digital lease signing and renewal', icon: FileText, tenantEnabled: true, ownerEnabled: true },
  { id: 'pf-004', name: 'Document Upload', description: 'Upload and share important documents', icon: Upload, tenantEnabled: true, ownerEnabled: true },
  { id: 'pf-005', name: 'Announcements', description: 'View and manage building announcements', icon: Megaphone, tenantEnabled: true, ownerEnabled: true },
  { id: 'pf-006', name: 'Rent Tracking', description: 'Track rent payments and payment history', icon: TrendingUp, tenantEnabled: true, ownerEnabled: true },
]

// ── Main Component ────────────────────────────────────────────────────────────

export function PortalPage() {
  const [features, setFeatures] = React.useState(INITIAL_FEATURES)
  const [brandColor, setBrandColor] = React.useState('#0071e3')
  const [welcomeMessage, setWelcomeMessage] = React.useState('Welcome to TenantFlow Portal! Manage your rentals with ease.')

  const toggleFeature = (id: string, portal: 'tenant' | 'owner') => {
    setFeatures(prev => prev.map(f => {
      if (f.id !== id) return f
      return portal === 'tenant' ? { ...f, tenantEnabled: !f.tenantEnabled } : { ...f, ownerEnabled: !f.ownerEnabled }
    }))
  }

  const presetColors = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#5ac8fa', '#ff2d55', '#1d1d1f', '#86868b']

  const stats = [
    { title: 'Active Portal Users', value: '342', subtitle: 'Across all portals', icon: Users, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Login Rate', value: '78%', subtitle: 'Monthly active rate', icon: LogIn, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Feature Adoption', value: '64%', subtitle: 'Avg. across features', icon: BarChart3, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
    { title: 'Satisfaction', value: '4.6/5', subtitle: 'User survey score', icon: Heart, iconColor: 'text-tahoe-pink', iconBg: 'bg-tahoe-pink/10' },
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
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-pink/10">
          <Globe className="size-6 text-tahoe-pink" />
        </div>
        <div>
          <h1 className="tahoe-title">Portal Settings</h1>
          <p className="tahoe-caption mt-1">Configure tenant & owner portal experience</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="glass-card tahoe-hover overflow-hidden rounded-2xl">
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

      {/* Tabs: Tenant Portal / Owner Portal */}
      <Tabs defaultValue="tenant" className="space-y-4">
        <TabsList className="glass-card rounded-2xl p-1 h-auto">
          <TabsTrigger value="tenant" className="rounded-xl data-[state=active]:bg-tahoe-blue data-[state=active]:text-white px-6 py-2.5 text-sm font-medium tahoe-transition">
            <Users className="size-4 mr-2" />
            Tenant Portal
          </TabsTrigger>
          <TabsTrigger value="owner" className="rounded-xl data-[state=active]:bg-tahoe-purple data-[state=active]:text-white px-6 py-2.5 text-sm font-medium tahoe-transition">
            <Building2 className="size-4 mr-2" />
            Owner Portal
          </TabsTrigger>
        </TabsList>

        {/* Tenant Portal */}
        <TabsContent value="tenant">
          <Card className="glass-card overflow-hidden rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-tahoe-blue/10">
                  <Users className="size-5 text-tahoe-blue" />
                </div>
                <div>
                  <CardTitle className="tahoe-headline">Tenant Portal Features</CardTitle>
                  <p className="tahoe-caption mt-0.5">{features.filter(f => f.tenantEnabled).length}/{features.length} features enabled</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {features.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-xl px-4 py-3 tahoe-transition hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary/60">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">{feature.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{feature.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={feature.tenantEnabled}
                        onCheckedChange={() => toggleFeature(feature.id, 'tenant')}
                        className="data-[state=checked]:bg-tahoe-blue"
                      />
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Owner Portal */}
        <TabsContent value="owner">
          <Card className="glass-card overflow-hidden rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-tahoe-purple/10">
                  <Building2 className="size-5 text-tahoe-purple" />
                </div>
                <div>
                  <CardTitle className="tahoe-headline">Owner Portal Features</CardTitle>
                  <p className="tahoe-caption mt-0.5">{features.filter(f => f.ownerEnabled).length}/{features.length} features enabled</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {features.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-xl px-4 py-3 tahoe-transition hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary/60">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">{feature.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{feature.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={feature.ownerEnabled}
                        onCheckedChange={() => toggleFeature(feature.id, 'owner')}
                        className="data-[state=checked]:bg-tahoe-purple"
                      />
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customization */}
      <Card className="glass-card overflow-hidden rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Palette className="size-5 text-tahoe-orange" />
            <CardTitle className="tahoe-headline">Branding & Customization</CardTitle>
          </div>
          <p className="tahoe-caption mt-1">Customize the portal appearance for your tenants</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          {/* Brand Color Picker Placeholder */}
          <div className="space-y-3">
            <label className="tahoe-overline">Brand Accent Color</label>
            <div className="flex flex-wrap items-center gap-2">
              {presetColors.map(color => (
                <button
                  key={color}
                  onClick={() => setBrandColor(color)}
                  className={cn(
                    'size-9 rounded-xl tahoe-hover tahoe-transition',
                    brandColor === color && 'ring-2 ring-offset-2 ring-offset-background'
                  )}
                  style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                />
              ))}
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={e => setBrandColor(e.target.value)}
                  className="size-9 rounded-xl cursor-pointer border-0"
                />
                <span className="text-xs text-muted-foreground font-mono">{brandColor}</span>
              </div>
            </div>
            {/* Color Preview */}
            <div className="flex items-center gap-3 mt-3">
              <div className="h-8 w-full max-w-xs rounded-xl" style={{ backgroundColor: brandColor, opacity: 0.15 }} />
              <span className="text-xs text-muted-foreground">Preview tint</span>
            </div>
          </div>

          <div className="tahoe-divider" />

          {/* Welcome Message */}
          <div className="space-y-2">
            <label className="tahoe-overline">Welcome Message</label>
            <textarea
              value={welcomeMessage}
              onChange={e => setWelcomeMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border-0 bg-secondary/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring tahoe-transition resize-none"
              placeholder="Enter a welcome message for portal users..."
            />
            <p className="text-[11px] text-muted-foreground">{welcomeMessage.length}/500 characters</p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" className="glass-input border-0">Reset</Button>
            <Button className="gap-2 tahoe-btn-primary">
              <Save className="size-3.5" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
