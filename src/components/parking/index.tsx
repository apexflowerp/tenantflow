'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car,
  Search,
  Plus,
  Download,
  ChevronDown,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type SpotStatus = 'available' | 'assigned' | 'reserved' | 'maintenance'
type SpotType = 'standard' | 'compact' | 'handicapped' | 'ev'

interface ParkingSpot {
  id: string
  number: string
  level: number
  type: SpotType
  status: SpotStatus
  assignedTo: string | null
  vehicle: string | null
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SPOTS: ParkingSpot[] = [
  { id: 'ps-001', number: 'A1', level: 1, type: 'standard', status: 'assigned', assignedTo: 'Sarah Mitchell', vehicle: 'Tesla Model 3' },
  { id: 'ps-002', number: 'A2', level: 1, type: 'standard', status: 'assigned', assignedTo: 'James Rodriguez', vehicle: 'Honda Civic' },
  { id: 'ps-003', number: 'A3', level: 1, type: 'compact', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-004', number: 'A4', level: 1, type: 'ev', status: 'assigned', assignedTo: 'Emily Chen', vehicle: 'BMW i4' },
  { id: 'ps-005', number: 'A5', level: 1, type: 'handicapped', status: 'assigned', assignedTo: 'Robert Davis', vehicle: 'Toyota Camry' },
  { id: 'ps-006', number: 'A6', level: 1, type: 'standard', status: 'reserved', assignedTo: null, vehicle: null },
  { id: 'ps-007', number: 'A7', level: 1, type: 'standard', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-008', number: 'A8', level: 1, type: 'compact', status: 'maintenance', assignedTo: null, vehicle: null },
  { id: 'ps-009', number: 'B1', level: 2, type: 'standard', status: 'assigned', assignedTo: 'Michael Brown', vehicle: 'Ford F-150' },
  { id: 'ps-010', number: 'B2', level: 2, type: 'standard', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-011', number: 'B3', level: 2, type: 'ev', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-012', number: 'B4', level: 2, type: 'standard', status: 'assigned', assignedTo: 'Jessica Taylor', vehicle: 'Audi Q5' },
  { id: 'ps-013', number: 'B5', level: 2, type: 'compact', status: 'reserved', assignedTo: null, vehicle: null },
  { id: 'ps-014', number: 'B6', level: 2, type: 'standard', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-015', number: 'B7', level: 2, type: 'handicapped', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-016', number: 'B8', level: 2, type: 'standard', status: 'assigned', assignedTo: 'David Kim', vehicle: 'Hyundai Tucson' },
  { id: 'ps-017', number: 'C1', level: 3, type: 'standard', status: 'available', assignedTo: null, vehicle: null },
  { id: 'ps-018', number: 'C2', level: 3, type: 'standard', status: 'assigned', assignedTo: 'Amanda White', vehicle: 'Nissan Rogue' },
  { id: 'ps-019', number: 'C3', level: 3, type: 'ev', status: 'reserved', assignedTo: null, vehicle: null },
  { id: 'ps-020', number: 'C4', level: 3, type: 'compact', status: 'available', assignedTo: null, vehicle: null },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStatusColor(status: SpotStatus): string {
  const map: Record<SpotStatus, string> = {
    available: 'bg-tahoe-green/80 hover:bg-tahoe-green',
    assigned: 'bg-tahoe-blue/80 hover:bg-tahoe-blue',
    reserved: 'bg-tahoe-orange/80 hover:bg-tahoe-orange',
    maintenance: 'bg-tahoe-red/80 hover:bg-tahoe-red',
  }
  return map[status]
}

function getStatusBorderColor(status: SpotStatus): string {
  const map: Record<SpotStatus, string> = {
    available: 'ring-tahoe-green/40',
    assigned: 'ring-tahoe-blue/40',
    reserved: 'ring-tahoe-orange/40',
    maintenance: 'ring-tahoe-red/40',
  }
  return map[status]
}

function getTypeLabel(type: SpotType): string {
  const map: Record<SpotType, string> = { standard: 'Standard', compact: 'Compact', handicapped: 'Handicapped', ev: 'EV Charging' }
  return map[type]
}

function getTypeBadgeClass(type: SpotType): string {
  const map: Record<SpotType, string> = {
    standard: 'tahoe-badge tahoe-badge-blue',
    compact: 'tahoe-badge tahoe-badge-teal',
    handicapped: 'tahoe-badge tahoe-badge-purple',
    ev: 'tahoe-badge tahoe-badge-green',
  }
  return map[type]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ParkingPage() {
  const [selectedLevel, setSelectedLevel] = React.useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedSpot, setSelectedSpot] = React.useState<ParkingSpot | null>(null)

  const totalSpots = SPOTS.length
  const assignedSpots = SPOTS.filter(s => s.status === 'assigned').length
  const availableSpots = SPOTS.filter(s => s.status === 'available').length
  const reservedSpots = SPOTS.filter(s => s.status === 'reserved').length

  const filteredSpots = SPOTS.filter(s => {
    const matchLevel = selectedLevel === 'all' || s.level === selectedLevel
    const matchSearch = !searchQuery ||
      s.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.assignedTo && s.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchLevel && matchSearch
  })

  const stats = [
    { title: 'Total Spots', value: String(totalSpots), subtitle: 'Across 3 levels', icon: Car, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Assigned', value: String(assignedSpots), subtitle: 'Currently allocated', icon: Users, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Available', value: String(availableSpots), subtitle: 'Ready for assignment', icon: CheckCircle2, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Reserved', value: String(reservedSpots), subtitle: 'Held for future use', icon: Clock, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
  ]

  const levels = [...new Set(SPOTS.map(s => s.level))].sort()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-blue/10">
            <Car className="size-6 text-tahoe-blue" />
          </div>
          <div>
            <h1 className="tahoe-title">Parking</h1>
            <p className="tahoe-caption mt-1">Parking spot management & assignment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Assign Spot
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="glass-card tahoe-hover overflow-hidden">
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

      {/* Legend + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-tahoe-green" />Available</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-tahoe-blue" />Assigned</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-tahoe-orange" />Reserved</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-tahoe-red" />Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input placeholder="Search spots..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[140px] text-sm glass-input border-0" />
          </div>
          <div className="relative">
            <select
              value={String(selectedLevel)}
              onChange={e => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="h-8 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              {levels.map(l => <option key={l} value={String(l)}>Level {l}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Visual Parking Grid */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="tahoe-headline">Parking Map</CardTitle>
          <p className="tahoe-caption mt-1">Click a spot for details</p>
        </CardHeader>
        <CardContent className="pt-0">
          {levels.map(level => {
            const levelSpots = filteredSpots.filter(s => s.level === level)
            if (levelSpots.length === 0) return null
            return (
              <div key={level} className="mb-6 last:mb-0">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Level {level}
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {levelSpots.map((spot) => (
                    <motion.button
                      key={spot.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSpot(spot)}
                      className={cn(
                        'relative flex flex-col items-center justify-center rounded-xl p-3 text-white text-xs font-semibold tahoe-transition aspect-square',
                        getStatusColor(spot.status),
                        selectedSpot?.id === spot.id && cn('ring-2 ring-offset-2 ring-offset-background', getStatusBorderColor(spot.status))
                      )}
                    >
                      <span className="text-sm font-bold">{spot.number}</span>
                      <span className="text-[9px] opacity-80 mt-0.5">{getTypeLabel(spot.type)}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Selected Spot Detail */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn('flex size-14 items-center justify-center rounded-xl text-white text-lg font-bold', getStatusColor(selectedSpot.status))}>
                      {selectedSpot.number}
                    </div>
                    <div>
                      <p className="tahoe-headline">Spot {selectedSpot.number}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={getTypeBadgeClass(selectedSpot.type)}>{getTypeLabel(selectedSpot.type)}</span>
                        <span className={cn(
                          'tahoe-badge',
                          selectedSpot.status === 'available' && 'tahoe-badge-green',
                          selectedSpot.status === 'assigned' && 'tahoe-badge-blue',
                          selectedSpot.status === 'reserved' && 'tahoe-badge-orange',
                          selectedSpot.status === 'maintenance' && 'tahoe-badge-red',
                        )}>
                          {selectedSpot.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">Level {selectedSpot.level}</p>
                    {selectedSpot.assignedTo && (
                      <>
                        <p className="font-medium">{selectedSpot.assignedTo}</p>
                        <p className="text-muted-foreground">{selectedSpot.vehicle}</p>
                      </>
                    )}
                    {!selectedSpot.assignedTo && (
                      <Button size="sm" className="gap-2 tahoe-btn-primary mt-2">
                        <Plus className="size-3.5" />
                        Assign Tenant
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
