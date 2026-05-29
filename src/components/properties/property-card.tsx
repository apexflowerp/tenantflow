'use client'

import { motion } from 'framer-motion'
import { Building2, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Property } from '@/stores'

interface PropertyCardProps {
  property: Property
  index: number
  onClick: () => void
}

function getTypeColor(type: string) {
  switch (type) {
    case 'residential':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'commercial':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'mixed':
      return 'bg-teal-50 text-teal-700 border-teal-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

function getGradient(type: string) {
  switch (type) {
    case 'residential':
      return 'from-emerald-400 to-teal-500'
    case 'commercial':
      return 'from-amber-400 to-orange-500'
    case 'mixed':
      return 'from-teal-400 to-emerald-500'
    default:
      return 'from-slate-400 to-slate-500'
  }
}

export function PropertyCard({ property, index, onClick }: PropertyCardProps) {
  const stats = property.stats
  const occupancyRate = stats?.occupancyRate ?? property.occupancyRate ?? 0
  const totalUnits = stats?.totalUnits ?? property.totalUnits ?? 0
  const monthlyRevenue = stats?.monthlyRevenue ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden border border-border/50 hover:border-emerald-200 hover:shadow-md transition-all duration-300 py-0 gap-0">
        {/* Image placeholder */}
        <div className={`relative h-40 bg-gradient-to-br ${getGradient(property.type)} flex items-center justify-center`}>
          <Building2 className="size-16 text-white/30" />
          {/* Status dot */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="sr-only">{property.status}</span>
            <span
              className={`size-2.5 rounded-full ring-2 ring-white ${
                property.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </div>
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="outline"
              className={`text-xs capitalize backdrop-blur-sm ${getTypeColor(property.type)}`}
            >
              {property.type}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Name & Address */}
          <div>
            <h3 className="font-semibold text-foreground text-base leading-tight truncate">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {property.address}, {property.city}
                {property.state ? `, ${property.state}` : ''}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted/50 p-2">
              <Users className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{totalUnits}</span>
              <span className="text-[10px] text-muted-foreground">Units</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted/50 p-2">
              <TrendingUp className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{occupancyRate}%</span>
              <span className="text-[10px] text-muted-foreground">Occupancy</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted/50 p-2">
              <DollarSign className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                {monthlyRevenue >= 1000
                  ? `$${(monthlyRevenue / 1000).toFixed(1)}k`
                  : `$${monthlyRevenue.toLocaleString()}`}
              </span>
              <span className="text-[10px] text-muted-foreground">Revenue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
