'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Eye,
  Users,
  Star,
  Home,
  MapPin,
  Building2,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ListingData {
  id: string
  title: string
  property: string
  unit: string
  type: 'rental' | 'sale'
  price: number
  deposit: number
  status: 'active' | 'paused' | 'closed'
  featured: boolean
  views: number
  applications: number
  listedDate: string
  availableFrom: string
  amenities: string
}

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: {
    label: 'Active',
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  closed: {
    label: 'Closed',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-500/10 border-gray-500/20',
  },
}

// ── Property image gradients ─────────────────────────────────────────────────

const PROPERTY_GRADIENTS = [
  'from-emerald-500/20 to-teal-600/20',
  'from-cyan-500/20 to-sky-600/20',
  'from-amber-500/20 to-orange-600/20',
  'from-violet-500/20 to-purple-600/20',
  'from-rose-500/20 to-pink-600/20',
]

function getGradient(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PROPERTY_GRADIENTS[Math.abs(hash) % PROPERTY_GRADIENTS.length]
}

// ── Format currency ──────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

// ── Component ────────────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: ListingData
  index?: number
  onViewApplications?: (listingId: string) => void
}

export function ListingCard({ listing, index = 0, onViewApplications }: ListingCardProps) {
  const statusConfig = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.active
  const gradient = getGradient(listing.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Card className="mojave-card border-border/40 bg-card/80 group overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Property image placeholder */}
        <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
            <Building2 className="size-10" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Property Image</span>
          </div>

          {/* Featured badge */}
          {listing.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="gap-1 bg-amber-500/90 text-white border-0 text-[10px] font-semibold shadow-md">
                <Star className="size-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold border ${statusConfig.bg} ${statusConfig.color}`}
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Type badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-[10px] font-semibold bg-white/80 dark:bg-black/50 backdrop-blur-sm gap-1">
              <Home className="size-3" />
              {listing.type === 'rental' ? 'For Rent' : 'For Sale'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="size-3" />
              <span className="text-xs">{listing.property} &middot; Unit {listing.unit}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary">{formatCurrency(listing.price)}</span>
            <span className="text-xs text-muted-foreground">/mo</span>
            {listing.deposit > 0 && (
              <span className="text-[11px] text-muted-foreground ml-auto">
                Deposit: {formatCurrency(listing.deposit)}
              </span>
            )}
          </div>

          {/* Amenities preview */}
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {listing.amenities}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="size-3.5" />
                <span className="text-xs font-medium">{listing.views}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="size-3.5" />
                <span className="text-xs font-medium">{listing.applications}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] text-primary hover:text-primary"
              onClick={(e) => {
                e.stopPropagation()
                onViewApplications?.(listing.id)
              }}
            >
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
