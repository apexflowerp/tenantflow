'use client'

import { motion } from 'framer-motion'
import { Star, Phone, Mail, Wrench, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface Vendor {
  id: string
  name: string
  company: string
  category: string
  specialty: string
  email: string
  phone: string
  rating: number
  totalJobs: number
  status: 'active' | 'inactive'
  paymentTerms: string
  licenseNumber?: string
  insuranceExpiry?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  notes?: string
}

interface VendorCardProps {
  vendor: Vendor
  index: number
  onClick: () => void
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  plumbing: { label: 'Plumbing', color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800' },
  electrical: { label: 'Electrical', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' },
  hvac: { label: 'HVAC', color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800' },
  cleaning: { label: 'Cleaning', color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800' },
  landscaping: { label: 'Landscaping', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' },
  general: { label: 'General', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/40 dark:text-slate-400 dark:border-slate-800' },
  roofing: { label: 'Roofing', color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800' },
  painting: { label: 'Painting', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
              ? 'fill-amber-400/50 text-amber-400'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

export function VendorCard({ vendor, index, onClick }: VendorCardProps) {
  const catConfig = CATEGORY_CONFIG[vendor.category] ?? CATEGORY_CONFIG.general

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="mojave-card border-border/40 bg-card/80 hover:border-primary/20 hover:shadow-md transition-all duration-300 py-0 gap-0">
        <CardContent className="p-4 space-y-3">
          {/* Header: Name, Company, Actions */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
                  {vendor.name}
                </h3>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium shrink-0 ${
                    vendor.status === 'active'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted text-muted-foreground border-muted'
                  }`}
                >
                  {vendor.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">{vendor.company}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="size-7 shrink-0">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick() }}>
                  <Eye className="size-3.5" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Pencil className="size-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category Badge + Rating */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className={`text-[10px] font-medium ${catConfig.color}`}>
              {catConfig.label}
            </Badge>
            <StarRating rating={vendor.rating} />
          </div>

          {/* Specialty */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wrench className="size-3 shrink-0" />
            <span className="truncate">{vendor.specialty}</span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{vendor.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0">
              <Phone className="size-3 shrink-0" />
              <span className="truncate">{vendor.phone}</span>
            </div>
          </div>

          {/* Footer: Total Jobs & Payment Terms */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Jobs</span>
              <span className="text-sm font-semibold text-foreground">{vendor.totalJobs}</span>
            </div>
            <Badge variant="secondary" className="text-[10px] font-medium uppercase">
              {vendor.paymentTerms.replace('net', 'Net ')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
