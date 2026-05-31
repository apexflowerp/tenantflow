'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Waves,
  Dumbbell,
  Building2,
  Shirt,
  Flame,
  Users,
  Search,
  Plus,
  Download,
  Calendar,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Amenity {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  capacity: number
  hours: string
  bookingsCount: number
  utilizationRate: number
  revenue: number
  rating: number
  status: 'available' | 'maintenance' | 'reserved'
  nextAvailable: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const AMENITIES: Amenity[] = [
  { id: 'am-001', name: 'Swimming Pool', icon: Waves, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10', capacity: 30, hours: '6:00 AM - 10:00 PM', bookingsCount: 156, utilizationRate: 72, revenue: 2400, rating: 4.8, status: 'available', nextAvailable: 'Today, 2:00 PM' },
  { id: 'am-002', name: 'Fitness Center', icon: Dumbbell, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10', capacity: 25, hours: '24/7', bookingsCount: 342, utilizationRate: 85, revenue: 0, rating: 4.6, status: 'available', nextAvailable: 'Available now' },
  { id: 'am-003', name: 'Rooftop Terrace', icon: Building2, iconColor: 'text-tahoe-purple', iconBg: 'bg-tahoe-purple/10', capacity: 50, hours: '8:00 AM - 11:00 PM', bookingsCount: 89, utilizationRate: 45, revenue: 1800, rating: 4.9, status: 'available', nextAvailable: 'Tomorrow, 10:00 AM' },
  { id: 'am-004', name: 'Laundry Room', icon: Shirt, iconColor: 'text-tahoe-teal', iconBg: 'bg-tahoe-teal/10', capacity: 8, hours: '6:00 AM - 12:00 AM', bookingsCount: 520, utilizationRate: 92, revenue: 3200, rating: 4.2, status: 'available', nextAvailable: 'Available now' },
  { id: 'am-005', name: 'BBQ & Grill Area', icon: Flame, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10', capacity: 20, hours: '10:00 AM - 9:00 PM', bookingsCount: 67, utilizationRate: 38, revenue: 950, rating: 4.5, status: 'maintenance', nextAvailable: 'June 18, 10:00 AM' },
  { id: 'am-006', name: 'Meeting Room', icon: Users, iconColor: 'text-tahoe-pink', iconBg: 'bg-tahoe-pink/10', capacity: 12, hours: '8:00 AM - 8:00 PM', bookingsCount: 124, utilizationRate: 68, revenue: 1500, rating: 4.7, status: 'available', nextAvailable: 'Today, 4:00 PM' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    available: 'tahoe-badge tahoe-badge-green',
    maintenance: 'tahoe-badge tahoe-badge-orange',
    reserved: 'tahoe-badge tahoe-badge-blue',
  }
  return map[status] ?? 'tahoe-badge'
}

function renderStars(rating: number): React.ReactNode[] {
  const stars: React.ReactNode[] = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={cn('size-3.5', i <= Math.round(rating) ? 'text-tahoe-orange fill-tahoe-orange' : 'text-muted-foreground/30')}
      />
    )
  }
  return stars
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AmenitiesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const totalAmenities = AMENITIES.length
  const activeBookings = AMENITIES.reduce((sum, a) => sum + a.bookingsCount, 0)
  const avgUtilization = Math.round(AMENITIES.reduce((sum, a) => sum + a.utilizationRate, 0) / totalAmenities)
  const totalRevenue = AMENITIES.reduce((sum, a) => sum + a.revenue, 0)

  const filteredAmenities = AMENITIES.filter(a =>
    !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { title: 'Total Amenities', value: String(totalAmenities), subtitle: 'Managed facilities', icon: Waves, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Active Bookings', value: activeBookings.toLocaleString(), subtitle: 'This month', icon: Calendar, iconColor: 'text-tahoe-purple', iconBg: 'bg-tahoe-purple/10' },
    { title: 'Utilization Rate', value: `${avgUtilization}%`, subtitle: 'Average across all', icon: TrendingUp, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, subtitle: 'From paid amenities', icon: DollarSign, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
  ]

  // Calendar days mock
  const today = new Date()
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const timeSlots = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM']

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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-teal/10">
            <Waves className="size-6 text-tahoe-teal" />
          </div>
          <div>
            <h1 className="tahoe-title">Amenities</h1>
            <p className="tahoe-caption mt-1">Amenity booking & management system</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Add Amenity
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

      {/* Amenity Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="tahoe-headline">Facilities</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input placeholder="Search amenities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 w-[180px] text-sm glass-input border-0" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredAmenities.map((amenity, i) => {
              const Icon = amenity.icon
              return (
                <motion.div
                  key={amenity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className={cn('glass-card tahoe-hover overflow-hidden', amenity.status === 'maintenance' && 'opacity-70')}>
                    {/* Image Placeholder */}
                    <div className={cn('h-32 flex items-center justify-center relative', amenity.iconBg)}>
                      <Icon className={cn('size-12', amenity.iconColor, 'opacity-30')} />
                      <div className="absolute top-3 right-3">
                        <span className={getStatusBadge(amenity.status)}>{amenity.status}</span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{amenity.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {renderStars(amenity.rating)}
                            <span className="text-[11px] text-muted-foreground ml-1">{amenity.rating}</span>
                          </div>
                        </div>
                        {amenity.revenue > 0 && (
                          <span className="text-sm font-bold text-tahoe-green">${amenity.revenue}</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="size-3" />{amenity.capacity} capacity</span>
                          <span className="flex items-center gap-1"><Clock className="size-3" />{amenity.hours}</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Utilization</span>
                            <span className="font-medium">{amenity.utilizationRate}%</span>
                          </div>
                          <Progress value={amenity.utilizationRate} className="h-1.5" />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{amenity.bookingsCount} bookings</span>
                          <span className="text-tahoe-blue font-medium">{amenity.nextAvailable}</span>
                        </div>
                      </div>

                      <Button size="sm" className="w-full tahoe-btn-primary" disabled={amenity.status === 'maintenance'}>
                        {amenity.status === 'maintenance' ? 'Under Maintenance' : 'Book Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Calendar Placeholder */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="tahoe-headline">Booking Calendar</CardTitle>
              <p className="tahoe-caption mt-1">Weekly availability overview</p>
            </div>
            <Badge variant="outline" className="text-[10px]">This Week</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center tahoe-overline py-2">{day}</div>
                ))}
              </div>
              {/* Time Slots */}
              {timeSlots.map(slot => (
                <div key={slot} className="grid grid-cols-7 gap-1 mb-1">
                  {daysOfWeek.map((day, idx) => {
                    const isBooked = ((idx + slot.charCodeAt(0)) % 3) === 0
                    const isPast = idx < 2 && slot === '9 AM'
                    return (
                      <div
                        key={`${day}-${slot}`}
                        className={cn(
                          'rounded-lg p-2 text-center text-[10px] tahoe-transition',
                          isPast ? 'bg-muted/30 text-muted-foreground/40' :
                          isBooked ? 'bg-tahoe-blue/15 text-tahoe-blue font-medium' :
                          'bg-tahoe-green/10 text-tahoe-green cursor-pointer hover:bg-tahoe-green/20'
                        )}
                      >
                        {isPast ? '—' : isBooked ? 'Booked' : 'Open'}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
