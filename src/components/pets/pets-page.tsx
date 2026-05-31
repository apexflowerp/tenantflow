'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PawPrint,
  Dog,
  Cat,
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Weight,
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

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'other'
type ApprovalStatus = 'approved' | 'pending' | 'not_approved'

interface PetRecord {
  id: string
  name: string
  type: PetType
  breed: string
  tenantName: string
  property: string
  unit: string
  weight: number
  approvalStatus: ApprovalStatus
  vaccinated: boolean
  notes: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const PETS: PetRecord[] = [
  {
    id: 'PET-001',
    name: 'Buddy',
    type: 'dog',
    breed: 'Golden Retriever',
    tenantName: 'Sarah Mitchell',
    property: 'Skyline Tower',
    unit: '4B',
    weight: 65,
    approvalStatus: 'approved',
    vaccinated: true,
    notes: 'Service animal — ADA compliant',
  },
  {
    id: 'PET-002',
    name: 'Whiskers',
    type: 'cat',
    breed: 'Siamese',
    tenantName: 'James Rodriguez',
    property: 'Harbor View Residences',
    unit: '12A',
    weight: 10,
    approvalStatus: 'approved',
    vaccinated: true,
    notes: 'Indoor only',
  },
  {
    id: 'PET-003',
    name: 'Max',
    type: 'dog',
    breed: 'German Shepherd',
    tenantName: 'Emily Chen',
    property: 'Greenfield Gardens',
    unit: '7C',
    weight: 80,
    approvalStatus: 'pending',
    vaccinated: true,
    notes: 'Breed approval required — large breed policy',
  },
  {
    id: 'PET-004',
    name: 'Luna',
    type: 'cat',
    breed: 'Maine Coon',
    tenantName: 'David Kim',
    property: 'Riverside Lofts',
    unit: '2D',
    weight: 15,
    approvalStatus: 'approved',
    vaccinated: true,
    notes: '',
  },
  {
    id: 'PET-005',
    name: 'Rex',
    type: 'dog',
    breed: 'Pit Bull',
    tenantName: 'Michael Brown',
    property: 'Oakwood Estates',
    unit: '3A',
    weight: 55,
    approvalStatus: 'not_approved',
    vaccinated: false,
    notes: 'Restricted breed — policy violation',
  },
  {
    id: 'PET-006',
    name: 'Coco',
    type: 'dog',
    breed: 'French Bulldog',
    tenantName: 'Amanda White',
    property: 'Metro Commercial Hub',
    unit: '5C',
    weight: 25,
    approvalStatus: 'pending',
    vaccinated: true,
    notes: 'Pending vaccination records review',
  },
]

const POLICY_ITEMS = [
  {
    icon: Dog,
    title: 'Breed Restrictions',
    description: 'Pit Bulls, Rottweilers, and Dobermans are restricted breeds. All other breeds welcome with approval.',
    status: '2 violations',
    statusColor: 'text-tahoe-red',
    statusBg: 'bg-tahoe-red/10',
  },
  {
    icon: Weight,
    title: 'Weight Limits',
    description: 'Maximum pet weight is 75 lbs. Overweight pets require additional deposit and insurance.',
    status: '1 over limit',
    statusColor: 'text-tahoe-orange',
    statusBg: 'bg-tahoe-orange/10',
  },
  {
    icon: ShieldCheck,
    title: 'Vaccination Compliance',
    description: 'All pets must have up-to-date rabies and DHPP vaccinations. Records must be submitted annually.',
    status: '1 unvaccinated',
    statusColor: 'text-tahoe-red',
    statusBg: 'bg-tahoe-red/10',
  },
  {
    icon: PawPrint,
    title: 'Pet Deposits',
    description: 'One-time pet deposit of $300 per pet. Monthly pet rent of $50 applies for dogs, $25 for cats.',
    status: 'All collected',
    statusColor: 'text-tahoe-green',
    statusBg: 'bg-tahoe-green/10',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTypeLabel(type: PetType): string {
  const map: Record<PetType, string> = {
    dog: 'Dog',
    cat: 'Cat',
    bird: 'Bird',
    fish: 'Fish',
    other: 'Other',
  }
  return map[type]
}

function getTypeIcon(type: PetType) {
  const map: Record<PetType, React.ReactNode> = {
    dog: <Dog className="size-3.5" />,
    cat: <Cat className="size-3.5" />,
    bird: <PawPrint className="size-3.5" />,
    fish: <PawPrint className="size-3.5" />,
    other: <PawPrint className="size-3.5" />,
  }
  return map[type]
}

function getTypeColor(type: PetType): { bg: string; text: string; badge: string } {
  const map: Record<PetType, { bg: string; text: string; badge: string }> = {
    dog: { bg: 'bg-tahoe-orange/10', text: 'text-tahoe-orange', badge: 'tahoe-badge tahoe-badge-orange' },
    cat: { bg: 'bg-tahoe-purple/10', text: 'text-tahoe-purple', badge: 'tahoe-badge tahoe-badge-purple' },
    bird: { bg: 'bg-tahoe-teal/10', text: 'text-tahoe-teal', badge: 'tahoe-badge tahoe-badge-teal' },
    fish: { bg: 'bg-tahoe-blue/10', text: 'text-tahoe-blue', badge: 'tahoe-badge tahoe-badge-blue' },
    other: { bg: 'bg-muted/50', text: 'text-muted-foreground', badge: 'tahoe-badge' },
  }
  return map[type]
}

function getApprovalBadgeClass(status: ApprovalStatus): string {
  const map: Record<ApprovalStatus, string> = {
    approved: 'tahoe-badge tahoe-badge-green',
    pending: 'tahoe-badge tahoe-badge-orange',
    not_approved: 'tahoe-badge tahoe-badge-red',
  }
  return map[status]
}

function getApprovalIcon(status: ApprovalStatus) {
  const map: Record<ApprovalStatus, React.ReactNode> = {
    approved: <CheckCircle2 className="size-3.5 text-tahoe-green" />,
    pending: <Clock className="size-3.5 text-tahoe-orange" />,
    not_approved: <XCircle className="size-3.5 text-tahoe-red" />,
  }
  return map[status]
}

function getApprovalLabel(status: ApprovalStatus): string {
  const map: Record<ApprovalStatus, string> = {
    approved: 'Approved',
    pending: 'Pending',
    not_approved: 'Not Approved',
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

export function PetsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<ApprovalStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = React.useState<PetType | 'all'>('all')

  const filteredPets = PETS.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.approvalStatus === statusFilter
    const matchType = typeFilter === 'all' || p.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const stats = [
    {
      title: 'Registered Pets',
      value: '18',
      subtitle: 'Across all properties',
      icon: PawPrint,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Dogs',
      value: '12',
      subtitle: '67% of registered pets',
      icon: Dog,
      iconColor: 'text-tahoe-orange',
      iconBg: 'bg-tahoe-orange/10',
    },
    {
      title: 'Cats',
      value: '5',
      subtitle: '28% of registered pets',
      icon: Cat,
      iconColor: 'text-tahoe-purple',
      iconBg: 'bg-tahoe-purple/10',
    },
    {
      title: 'Pending Approval',
      value: '2',
      subtitle: 'Requires review',
      icon: Clock,
      iconColor: 'text-tahoe-red',
      iconBg: 'bg-tahoe-red/10',
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
            <PawPrint className="size-6 text-tahoe-orange" />
          </div>
          <div>
            <h1 className="tahoe-title">Pet Management</h1>
            <p className="tahoe-caption mt-1">Register and track pets</p>
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
            Register Pet
          </Button>
        </motion.div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Pet Policy Compliance ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tahoe-orange/10">
                <ShieldCheck className="size-4 text-tahoe-orange" />
              </div>
              <div>
                <CardTitle className="tahoe-headline">Pet Policy Compliance</CardTitle>
                <p className="tahoe-caption mt-0.5">Current policy status and violations</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {POLICY_ITEMS.map((policy, i) => {
                const PolicyIcon = policy.icon
                return (
                  <motion.div
                    key={policy.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                    className="glass-card rounded-xl p-4 tahoe-hover cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                        <PolicyIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-foreground">{policy.title}</p>
                          <Badge className={cn('tahoe-badge shrink-0 text-[10px]', policy.statusBg, policy.statusColor)}>
                            {policy.status}
                          </Badge>
                        </div>
                        <p className="tahoe-caption mt-1">{policy.description}</p>
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
                <CardTitle className="tahoe-headline">Pet Registry</CardTitle>
                <p className="tahoe-caption mt-1">
                  {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search pets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm glass-input border-0 rounded-lg"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(val) => setTypeFilter(val as PetType | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[110px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="dog">Dogs</SelectItem>
                    <SelectItem value="cat">Cats</SelectItem>
                    <SelectItem value="bird">Birds</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as ApprovalStatus | 'all')}
                >
                  <SelectTrigger size="sm" className="w-[140px] rounded-lg border-0 bg-secondary/60">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not_approved">Not Approved</SelectItem>
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
                    <TableHead className="tahoe-overline">Pet</TableHead>
                    <TableHead className="tahoe-overline">Type</TableHead>
                    <TableHead className="tahoe-overline">Tenant</TableHead>
                    <TableHead className="tahoe-overline text-right">Weight</TableHead>
                    <TableHead className="tahoe-overline">Vaccinated</TableHead>
                    <TableHead className="tahoe-overline">Approval</TableHead>
                    <TableHead className="tahoe-overline text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredPets.map((pet, i) => {
                      const typeColor = getTypeColor(pet.type)
                      return (
                        <motion.tr
                          key={pet.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className={cn(
                            'border-b border-border/30 tahoe-transition',
                            pet.approvalStatus === 'not_approved' && 'bg-tahoe-red/[0.03] dark:bg-tahoe-red/[0.04]',
                            'hover:bg-muted/30'
                          )}
                        >
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                                typeColor.bg, typeColor.text
                              )}>
                                {pet.name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{pet.name}</p>
                                <p className="text-[11px] text-muted-foreground">{pet.breed}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('flex size-5 items-center justify-center rounded-md', typeColor.bg)}>
                                {getTypeIcon(pet.type)}
                              </span>
                              <span className={typeColor.badge}>{getTypeLabel(pet.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <p className="text-sm text-foreground">{pet.tenantName}</p>
                            <p className="text-[11px] text-muted-foreground">{pet.property} · {pet.unit}</p>
                          </TableCell>
                          <TableCell className="py-3.5 text-right">
                            <span className="text-sm font-medium text-foreground">{pet.weight} lbs</span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            {pet.vaccinated ? (
                              <span className="tahoe-badge tahoe-badge-green">
                                <CheckCircle2 className="size-3" />
                                Up to date
                              </span>
                            ) : (
                              <span className="tahoe-badge tahoe-badge-red">
                                <AlertTriangle className="size-3" />
                                Missing
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              {getApprovalIcon(pet.approvalStatus)}
                              <span className={getApprovalBadgeClass(pet.approvalStatus)}>
                                {getApprovalLabel(pet.approvalStatus)}
                              </span>
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
                {filteredPets.map((pet, i) => {
                  const typeColor = getTypeColor(pet.type)
                  return (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        'glass-card rounded-2xl p-4 space-y-3 tahoe-transition',
                        pet.approvalStatus === 'not_approved' && 'ring-1 ring-tahoe-red/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'flex size-9 items-center justify-center rounded-full text-xs font-semibold',
                            typeColor.bg, typeColor.text
                          )}>
                            {pet.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{pet.name}</p>
                            <p className="text-[11px] text-muted-foreground">{pet.breed} · {pet.weight} lbs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getApprovalIcon(pet.approvalStatus)}
                          <span className={getApprovalBadgeClass(pet.approvalStatus)}>
                            {getApprovalLabel(pet.approvalStatus)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={typeColor.badge}>{getTypeLabel(pet.type)}</span>
                        {pet.vaccinated ? (
                          <span className="tahoe-badge tahoe-badge-green text-[10px]">
                            <CheckCircle2 className="size-2.5" />
                            Vaccinated
                          </span>
                        ) : (
                          <span className="tahoe-badge tahoe-badge-red text-[10px]">
                            <AlertTriangle className="size-2.5" />
                            Unvaccinated
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground ml-auto">{pet.tenantName}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {filteredPets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-tahoe-orange/10 mb-4">
                  <PawPrint className="size-8 text-tahoe-orange/40" />
                </div>
                <h3 className="tahoe-headline text-muted-foreground">No pets found</h3>
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
