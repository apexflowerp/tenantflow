'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Users,
  Eye,
  Star,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Building2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  FileText,
  Shield,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Separator } from '@/components/ui/separator'

import { ListingCard, type ListingData } from './listing-card'
import { CreateListingDialog } from './create-listing-dialog'
import { ApplicationReview, type ApplicationData } from './application-review'

// ── Mock data ────────────────────────────────────────────────────────────────

const LISTINGS: ListingData[] = [
  {
    id: 'l1',
    title: 'Modern 2BR with City View',
    property: 'Skyline Tower',
    unit: '4B',
    type: 'rental',
    price: 2800,
    deposit: 2800,
    status: 'active',
    featured: true,
    views: 145,
    applications: 4,
    listedDate: '2025-02-15',
    availableFrom: '2025-03-01',
    amenities: 'In-unit laundry, Balcony, Gym access, Parking',
  },
  {
    id: 'l2',
    title: 'Spacious Studio Near Park',
    property: 'Greenfield Gardens',
    unit: '2A',
    type: 'rental',
    price: 1500,
    deposit: 1500,
    status: 'active',
    featured: false,
    views: 89,
    applications: 2,
    listedDate: '2025-02-20',
    availableFrom: '2025-03-15',
    amenities: 'Pet-friendly, Garden access, Storage',
  },
  {
    id: 'l3',
    title: 'Luxury Penthouse Suite',
    property: 'Harbor View Residences',
    unit: 'PH1',
    type: 'rental',
    price: 5500,
    deposit: 5500,
    status: 'active',
    featured: true,
    views: 312,
    applications: 7,
    listedDate: '2025-01-10',
    availableFrom: '2025-02-01',
    amenities: 'Rooftop terrace, Concierge, Pool, Smart home',
  },
  {
    id: 'l4',
    title: 'Commercial Retail Space',
    property: 'Metro Commercial Hub',
    unit: 'G1',
    type: 'rental',
    price: 4200,
    deposit: 8400,
    status: 'active',
    featured: false,
    views: 67,
    applications: 1,
    listedDate: '2025-03-01',
    availableFrom: '2025-04-01',
    amenities: 'High ceilings, Loading dock, Signage',
  },
  {
    id: 'l5',
    title: 'Cozy 1BR Garden Unit',
    property: 'Riverside Apartments',
    unit: 'G2',
    type: 'rental',
    price: 1200,
    deposit: 1200,
    status: 'paused',
    featured: false,
    views: 45,
    applications: 3,
    listedDate: '2025-01-20',
    availableFrom: '2025-02-15',
    amenities: 'Private entrance, Garden, Pet-friendly',
  },
]

const APPLICATIONS: ApplicationData[] = [
  {
    id: 'a1',
    listingId: 'l1',
    listingTitle: 'Modern 2BR with City View',
    applicantName: 'Emily Watson',
    email: 'emily.w@email.com',
    phone: '(555) 111-2222',
    income: 95000,
    employment: 'Software Engineer - Tech Corp',
    moveInDate: '2025-03-01',
    status: 'approved',
    score: 92,
    appliedDate: '2025-02-18',
  },
  {
    id: 'a2',
    listingId: 'l1',
    listingTitle: 'Modern 2BR with City View',
    applicantName: 'James Rodriguez',
    email: 'james.r@email.com',
    phone: '(555) 222-3333',
    income: 78000,
    employment: 'Marketing Manager - AdWorks',
    moveInDate: '2025-03-15',
    status: 'reviewing',
    score: 78,
    appliedDate: '2025-02-20',
  },
  {
    id: 'a3',
    listingId: 'l3',
    listingTitle: 'Luxury Penthouse Suite',
    applicantName: 'Victoria Chen',
    email: 'v.chen@email.com',
    phone: '(555) 333-4444',
    income: 250000,
    employment: 'VP of Finance - Global Investments',
    moveInDate: '2025-02-01',
    status: 'approved',
    score: 98,
    appliedDate: '2025-01-12',
  },
  {
    id: 'a4',
    listingId: 'l2',
    listingTitle: 'Spacious Studio Near Park',
    applicantName: 'Marcus Brown',
    email: 'marcus.b@email.com',
    phone: '(555) 444-5555',
    income: 52000,
    employment: 'Graphic Designer - Creative Studio',
    moveInDate: '2025-03-15',
    status: 'submitted',
    score: 72,
    appliedDate: '2025-02-25',
  },
  {
    id: 'a5',
    listingId: 'l4',
    listingTitle: 'Commercial Retail Space',
    applicantName: 'Bella Boutique LLC',
    email: 'info@bellaboutique.com',
    phone: '(555) 555-6666',
    income: 180000,
    employment: 'Retail Business - Owner',
    moveInDate: '2025-04-01',
    status: 'reviewing',
    score: 85,
    appliedDate: '2025-03-02',
  },
  {
    id: 'a6',
    listingId: 'l3',
    listingTitle: 'Luxury Penthouse Suite',
    applicantName: 'David Kim',
    email: 'd.kim@email.com',
    phone: '(555) 666-7777',
    income: 120000,
    employment: 'Consultant - Deloitte',
    moveInDate: '2025-03-01',
    status: 'rejected',
    score: 45,
    appliedDate: '2025-01-15',
  },
]

// ── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  reviewing: { label: 'Reviewing', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  approved: { label: 'Approved', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  rejected: { label: 'Rejected', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
}

// ── Stats config ─────────────────────────────────────────────────────────────

interface StatDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  value: string
  trend?: string
}

const STATS: StatDef[] = [
  {
    key: 'active-listings',
    label: 'Active Listings',
    icon: Home,
    color: 'text-primary',
    bg: 'bg-primary/10',
    value: '4',
    trend: '+1',
  },
  {
    key: 'total-applications',
    label: 'Total Applications',
    icon: Users,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10',
    value: '6',
    trend: '+2',
  },
  {
    key: 'approval-rate',
    label: 'Approval Rate',
    icon: CheckCircle2,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    value: '33%',
  },
  {
    key: 'avg-days-fill',
    label: 'Avg. Days to Fill',
    icon: Clock,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10',
    value: '18',
  },
]

// ── Sort helpers ─────────────────────────────────────────────────────────────

type SortField = 'applicantName' | 'listingTitle' | 'income' | 'score' | 'appliedDate' | 'status'
type SortDir = 'asc' | 'desc'

function sortApplications(apps: ApplicationData[], field: SortField, dir: SortDir): ApplicationData[] {
  return [...apps].sort((a, b) => {
    let cmp = 0
    switch (field) {
      case 'applicantName':
        cmp = a.applicantName.localeCompare(b.applicantName)
        break
      case 'listingTitle':
        cmp = a.listingTitle.localeCompare(b.listingTitle)
        break
      case 'income':
        cmp = a.income - b.income
        break
      case 'score':
        cmp = a.score - b.score
        break
      case 'appliedDate':
        cmp = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
        break
      case 'status':
        cmp = a.status.localeCompare(b.status)
        break
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

function SortIcon({ field, currentField, dir }: { field: SortField; currentField: SortField; dir: SortDir }) {
  if (currentField !== field) {
    return <ArrowUpDown className="size-3 text-muted-foreground/40" />
  }
  return dir === 'asc' ? (
    <ChevronUp className="size-3 text-primary" />
  ) : (
    <ChevronDown className="size-3 text-primary" />
  )
}

// ── Format helpers ───────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-primary'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

// ── Component ────────────────────────────────────────────────────────────────

export function MarketplacePage() {
  const [activeTab, setActiveTab] = React.useState('listings')
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false)
  const [selectedApplication, setSelectedApplication] = React.useState<ApplicationData | null>(null)

  // Listing filters
  const [listingSearch, setListingSearch] = React.useState('')
  const [listingStatusFilter, setListingStatusFilter] = React.useState('all')
  const [listingTypeFilter, setListingTypeFilter] = React.useState('all')

  // Application filters & sort
  const [appSearch, setAppSearch] = React.useState('')
  const [appStatusFilter, setAppStatusFilter] = React.useState('all')
  const [sortField, setSortField] = React.useState<SortField>('appliedDate')
  const [sortDir, setSortDir] = React.useState<SortDir>('desc')

  // Handle sort toggle
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  // Filter listings
  const filteredListings = React.useMemo(() => {
    let result = LISTINGS
    if (listingSearch) {
      const q = listingSearch.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.property.toLowerCase().includes(q) ||
          l.amenities.toLowerCase().includes(q)
      )
    }
    if (listingStatusFilter !== 'all') {
      result = result.filter((l) => l.status === listingStatusFilter)
    }
    if (listingTypeFilter !== 'all') {
      result = result.filter((l) => l.type === listingTypeFilter)
    }
    return result
  }, [listingSearch, listingStatusFilter, listingTypeFilter])

  // Filter + sort applications
  const filteredApplications = React.useMemo(() => {
    let result = APPLICATIONS
    if (appSearch) {
      const q = appSearch.toLowerCase()
      result = result.filter(
        (a) =>
          a.applicantName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.listingTitle.toLowerCase().includes(q) ||
          a.employment.toLowerCase().includes(q)
      )
    }
    if (appStatusFilter !== 'all') {
      result = result.filter((a) => a.status === appStatusFilter)
    }
    return sortApplications(result, sortField, sortDir)
  }, [appSearch, appStatusFilter, sortField, sortDir])

  // Open review dialog
  function openReview(app: ApplicationData) {
    setSelectedApplication(app)
    setReviewDialogOpen(true)
  }

  // Handle approve/reject
  function handleApprove(id: string) {
    // In production, this would call an API
    console.log('Approved application:', id)
  }

  function handleReject(id: string) {
    // In production, this would call an API
    console.log('Rejected application:', id)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="marketplace"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketplace</h1>
              <p className="text-sm text-muted-foreground">
                Manage listings and review applications
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Create Listing
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const StatIcon = stat.icon
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="mojave-card border-border/40 bg-card/80 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <div className="mt-1.5 flex items-baseline gap-2">
                          <p className="text-2xl font-bold tracking-tight text-foreground">
                            {stat.value}
                          </p>
                          {stat.trend && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary">
                              <TrendingUp className="size-3" />
                              {stat.trend}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`flex size-10 items-center justify-center rounded-xl ${stat.bg}`}>
                        <StatIcon className={`size-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="listings" className="gap-1.5">
              <Home className="size-3.5" />
              Listings
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4">
                {LISTINGS.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-1.5">
              <Users className="size-3.5" />
              Applications
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4">
                {APPLICATIONS.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── Listings Tab ────────────────────────────────────────────────── */}
          <TabsContent value="listings" className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={listingStatusFilter} onValueChange={setListingStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={listingTypeFilter} onValueChange={setListingTypeFilter}>
                <SelectTrigger className="w-full sm:w-[130px] h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Listings grid */}
            {filteredListings.length === 0 ? (
              <Card className="mojave-card border-border/40 bg-card/80">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <Home className="size-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No Listings Found</h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Try adjusting your search or filters, or create a new listing.
                  </p>
                  <Button className="mt-4" size="sm" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="size-4 mr-1.5" />
                    Create Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing, i) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={i}
                    onViewApplications={(listingId) => {
                      const apps = APPLICATIONS.filter((a) => a.listingId === listingId)
                      if (apps.length > 0) {
                        setActiveTab('applications')
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Applications Tab ────────────────────────────────────────────── */}
          <TabsContent value="applications" className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={appStatusFilter} onValueChange={setAppStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications table */}
            <Card className="mojave-card border-border/40 bg-card/80 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('applicantName')}
                        >
                          Applicant <SortIcon field="applicantName" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('listingTitle')}
                        >
                          Listing <SortIcon field="listingTitle" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('income')}
                        >
                          Income <SortIcon field="income" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead>
                        Status
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('score')}
                        >
                          Score <SortIcon field="score" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <button
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          onClick={() => handleSort('appliedDate')}
                        >
                          Applied <SortIcon field="appliedDate" currentField={sortField} dir={sortDir} />
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No applications match your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => {
                        const statusBadge = STATUS_BADGE[app.status] ?? STATUS_BADGE.submitted
                        const scoreColor = getScoreColor(app.score)
                        return (
                          <TableRow
                            key={app.id}
                            className="cursor-pointer hover:bg-muted/40"
                            onClick={() => openReview(app)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-[10px] shrink-0">
                                  {app.applicantName.split(' ').map((n) => n[0]).join('').toUpperCase()}
                                </div>
                                <span className="font-medium text-sm truncate max-w-[140px]">
                                  {app.applicantName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground truncate max-w-[160px]">
                              {app.email}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-[160px]">
                              {app.listingTitle}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {formatCurrency(app.income)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-semibold border gap-0.5 ${statusBadge.bg} ${statusBadge.color}`}
                              >
                                {statusBadge.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={`text-sm font-semibold ${scoreColor}`}>
                                {app.score}
                              </span>
                              <span className="text-[10px] text-muted-foreground">/100</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {formatShortDate(app.appliedDate)}
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
        </Tabs>

        {/* Dialogs */}
        <CreateListingDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        <ApplicationReview
          application={selectedApplication}
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </motion.div>
    </AnimatePresence>
  )
}
