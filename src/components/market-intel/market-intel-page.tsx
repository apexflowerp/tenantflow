'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Sparkles,
  BarChart3,
  MapPin,
  Home,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Brain,
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

type MarketSource = 'zillow' | 'redfin' | 'mls' | 'other'

interface ComparableUnit {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  pricePerSqft: number
  source: MarketSource
  listedDate: string
  distance: string
  status: 'available' | 'pending' | 'rented'
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const COMPARABLES: ComparableUnit[] = [
  {
    id: 'CMP-001',
    address: '425 Market St, Apt 12B',
    price: 2800,
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    pricePerSqft: 2.55,
    source: 'zillow',
    listedDate: '2025-06-01',
    distance: '0.3 mi',
    status: 'available',
  },
  {
    id: 'CMP-002',
    address: '550 Mission St, Unit 8A',
    price: 2400,
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    pricePerSqft: 2.82,
    source: 'redfin',
    listedDate: '2025-05-28',
    distance: '0.5 mi',
    status: 'pending',
  },
  {
    id: 'CMP-003',
    address: '200 Folsom St, Apt 15C',
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    pricePerSqft: 2.56,
    source: 'mls',
    listedDate: '2025-06-05',
    distance: '0.8 mi',
    status: 'available',
  },
  {
    id: 'CMP-004',
    address: '88 King St, Unit 4D',
    price: 2100,
    bedrooms: 1,
    bathrooms: 1,
    area: 720,
    pricePerSqft: 2.92,
    source: 'zillow',
    listedDate: '2025-05-20',
    distance: '1.2 mi',
    status: 'rented',
  },
  {
    id: 'CMP-005',
    address: '333 Beale St, Apt 7A',
    price: 2650,
    bedrooms: 2,
    bathrooms: 1,
    area: 980,
    pricePerSqft: 2.71,
    source: 'redfin',
    listedDate: '2025-06-10',
    distance: '0.6 mi',
    status: 'available',
  },
  {
    id: 'CMP-006',
    address: '45 Fremont St, Unit 22B',
    price: 3500,
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    pricePerSqft: 2.50,
    source: 'mls',
    listedDate: '2025-06-08',
    distance: '0.4 mi',
    status: 'available',
  },
]

const AI_INSIGHTS = [
  {
    icon: TrendingUp,
    title: 'Rental Market Uptrend',
    description: 'Market rents increased 4.2% YoY in your area. Consider adjusting renewal rates to stay competitive while maximizing revenue.',
    confidence: 92,
    color: 'text-tahoe-green',
    bg: 'bg-tahoe-green/10',
  },
  {
    icon: Target,
    title: 'Price Optimization',
    description: 'Unit 4B at Skyline Tower is priced 8% below market. Increasing to $2,800 would align with comps while maintaining 95% occupancy probability.',
    confidence: 87,
    color: 'text-tahoe-blue',
    bg: 'bg-tahoe-blue/10',
  },
  {
    icon: Zap,
    title: 'Demand Forecast',
    description: 'Seasonal demand peak expected in July-August. List any vacant units now to capture premium rates before the seasonal surge.',
    confidence: 78,
    color: 'text-tahoe-orange',
    bg: 'bg-tahoe-orange/10',
  },
  {
    icon: Brain,
    title: 'Competitor Analysis',
    description: '3 new luxury buildings opening in Q3 within 1-mile radius. Differentiate by emphasizing smart-home features and pet-friendly policies.',
    confidence: 85,
    color: 'text-tahoe-purple',
    bg: 'bg-tahoe-purple/10',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getSourceBadgeClass(source: MarketSource): string {
  const map: Record<MarketSource, string> = {
    zillow: 'tahoe-badge tahoe-badge-blue',
    redfin: 'tahoe-badge tahoe-badge-red',
    mls: 'tahoe-badge tahoe-badge-green',
    other: 'tahoe-badge tahoe-badge-orange',
  }
  return map[source]
}

function getSourceLabel(source: MarketSource): string {
  const map: Record<MarketSource, string> = {
    zillow: 'Zillow',
    redfin: 'Redfin',
    mls: 'MLS',
    other: 'Other',
  }
  return map[source]
}

function getStatusBadgeClass(status: ComparableUnit['status']): string {
  const map: Record<string, string> = {
    available: 'tahoe-badge tahoe-badge-green',
    pending: 'tahoe-badge tahoe-badge-orange',
    rented: 'tahoe-badge tahoe-badge-blue',
  }
  return map[status]
}

function getStatusLabel(status: ComparableUnit['status']): string {
  const map: Record<string, string> = {
    available: 'Available',
    pending: 'Pending',
    rented: 'Rented',
  }
  return map[status]
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

export function MarketIntelPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sourceFilter, setSourceFilter] = React.useState<MarketSource | 'all'>('all')

  const filteredComparables = COMPARABLES.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchSource = sourceFilter === 'all' || c.source === sourceFilter
    return matchSearch && matchSource
  })

  const stats = [
    {
      title: 'Avg Rent',
      value: '$2,450',
      subtitle: 'Market average for area',
      icon: DollarSign,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Market Trend',
      value: '+4.2%',
      subtitle: 'Year-over-year growth',
      icon: TrendingUp,
      iconColor: 'text-tahoe-green',
      iconBg: 'bg-tahoe-green/10',
    },
    {
      title: 'Days on Market',
      value: '18',
      subtitle: 'Average listing time',
      icon: BarChart3,
      iconColor: 'text-tahoe-blue',
      iconBg: 'bg-tahoe-blue/10',
    },
    {
      title: 'Comparable Units',
      value: '24',
      subtitle: 'Active market listings',
      icon: Home,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-green/10">
            <TrendingUp className="size-6 text-tahoe-green" />
          </div>
          <div>
            <h1 className="tahoe-title">Market Intelligence</h1>
            <p className="tahoe-caption mt-1">AI-powered market analysis and comparables</p>
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
            <Sparkles className="size-3.5" />
            AI Analysis
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── AI Insights ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-green/10">
                <Sparkles className="size-4 text-tahoe-green" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">AI Market Insights</CardTitle>
                <p className="tahoe-caption mt-0.5">Intelligent analysis powered by market data</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {AI_INSIGHTS.map((insight, i) => {
                const InsightIcon = insight.icon
                return (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                    className="glass-card rounded-xl p-4 tahoe-hover cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', insight.bg)}>
                        <InsightIcon className={cn('size-4', insight.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-foreground">{insight.title}</p>
                          <Badge className="tahoe-badge tahoe-badge-green shrink-0 text-[10px]">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="tahoe-caption mt-1">{insight.description}</p>
                      </div>
                    </div>
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
                <CardTitle className="tahoe-headline">Market Comparables</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredComparables.length} comparable{filteredComparables.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search addresses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={sourceFilter}
                  onValueChange={(val) => setSourceFilter(val as MarketSource | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[120px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="zillow">Zillow</SelectItem>
                    <SelectItem value="redfin">Redfin</SelectItem>
                    <SelectItem value="mls">MLS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                    <TableHead className="tahoe-overline">Address</TableHead>
                    <TableHead className="tahoe-overline text-right">Price</TableHead>
                    <TableHead className="tahoe-overline">Beds/Baths</TableHead>
                    <TableHead className="tahoe-overline text-right">Area</TableHead>
                    <TableHead className="tahoe-overline text-right">$/sqft</TableHead>
                    <TableHead className="tahoe-overline">Source</TableHead>
                    <TableHead className="tahoe-overline">Status</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredComparables.map((comp, i) => (
                      <motion.tr
                        key={comp.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        className="border-b border-border/30 tahoe-transition hover:bg-muted/30"
                      >
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tahoe-green/10">
                              <MapPin className="size-3.5 text-tahoe-green" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{comp.address}</p>
                              <p className="text-[11px] text-muted-foreground">{comp.distance} away · Listed {comp.listedDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <span className="font-bold text-foreground">${comp.price.toLocaleString()}/mo</span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="text-sm text-foreground">{comp.bedrooms}bd / {comp.bathrooms}ba</span>
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <span className="text-sm text-foreground">{comp.area.toLocaleString()} sqft</span>
                        </TableCell>
                        <TableCell className="py-3.5 text-right">
                          <span className="text-sm font-medium text-tahoe-green">${comp.pricePerSqft.toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className={getSourceBadgeClass(comp.source)}>{getSourceLabel(comp.source)}</span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className={getStatusBadgeClass(comp.status)}>{getStatusLabel(comp.status)}</span>
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
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 max-h-[420px] overflow-y-auto">
              <AnimatePresence>
                {filteredComparables.map((comp, i) => (
                  <motion.div
                    key={comp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="glass-card rounded-2xl p-4 space-y-3 tahoe-transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tahoe-green/10">
                          <MapPin className="size-3.5 text-tahoe-green" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{comp.address}</p>
                          <p className="text-[11px] text-muted-foreground">{comp.distance} · {comp.listedDate}</p>
                        </div>
                      </div>
                      <span className="font-bold text-foreground">${comp.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-foreground">{comp.bedrooms}bd / {comp.bathrooms}ba · {comp.area} sqft</span>
                      <span className="text-[11px] font-medium text-tahoe-green">${comp.pricePerSqft.toFixed(2)}/sqft</span>
                      <span className={getSourceBadgeClass(comp.source)}>{getSourceLabel(comp.source)}</span>
                      <span className={getStatusBadgeClass(comp.status)}>{getStatusLabel(comp.status)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredComparables.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-green/10 mb-4">
                  <TrendingUp className="size-8 text-tahoe-green/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No comparables found</h3>
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
