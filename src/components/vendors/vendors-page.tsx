'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  Wrench,
  Plus,
  ArrowLeft,
  MapPin,
  FileText,
  Shield,
  Calendar,
  CreditCard,
  Hash,
  StickyNote,
  Briefcase,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VendorCard, type Vendor } from './vendor-card'
import { AddVendorDialog } from './add-vendor-dialog'

// ── Mock Data ──────────────────────────────────────────────────────────────

const VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Mike Johnson',
    company: 'Elite Plumbing Co',
    category: 'plumbing',
    specialty: 'Emergency repairs',
    email: 'mike@eliteplumbing.com',
    phone: '(555) 123-4567',
    rating: 4.8,
    totalJobs: 45,
    status: 'active',
    paymentTerms: 'net30',
    licenseNumber: 'PLB-2019-4521',
    address: '456 Commerce Blvd',
    city: 'Riverside',
    state: 'CA',
    zipCode: '92501',
  },
  {
    id: 'v2',
    name: 'Sarah Chen',
    company: 'BrightSpark Electric',
    category: 'electrical',
    specialty: 'Panel upgrades & rewiring',
    email: 'sarah@brightspark.com',
    phone: '(555) 234-5678',
    rating: 4.9,
    totalJobs: 62,
    status: 'active',
    paymentTerms: 'net15',
    licenseNumber: 'ELC-2020-7823',
    address: '789 Voltage Way',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94601',
  },
  {
    id: 'v3',
    name: 'Tony Rivera',
    company: 'CoolBreeze HVAC',
    category: 'hvac',
    specialty: 'Installation & maintenance',
    email: 'tony@coolbreeze.com',
    phone: '(555) 345-6789',
    rating: 4.5,
    totalJobs: 38,
    status: 'active',
    paymentTerms: 'net30',
    address: '321 Climate Ave',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95101',
  },
  {
    id: 'v4',
    name: 'CleanPro Services',
    company: 'CleanPro LLC',
    category: 'cleaning',
    specialty: 'Deep cleaning & turnover',
    email: 'info@cleanpro.com',
    phone: '(555) 456-7890',
    rating: 4.3,
    totalJobs: 120,
    status: 'active',
    paymentTerms: 'net15',
    address: '100 Sparkle Street',
    city: 'Long Beach',
    state: 'CA',
    zipCode: '90801',
  },
  {
    id: 'v5',
    name: 'Green Thumb Landscaping',
    company: 'Green Thumb Inc',
    category: 'landscaping',
    specialty: 'Lawn care & irrigation',
    email: 'contact@greenthumb.com',
    phone: '(555) 567-8901',
    rating: 4.6,
    totalJobs: 55,
    status: 'active',
    paymentTerms: 'net30',
    address: '555 Garden Path',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
  },
  {
    id: 'v6',
    name: 'TopRoof Solutions',
    company: 'TopRoof Corp',
    category: 'roofing',
    specialty: 'Roof replacement & repair',
    email: 'quote@toproof.com',
    phone: '(555) 678-9012',
    rating: 4.1,
    totalJobs: 22,
    status: 'inactive',
    paymentTerms: 'net60',
    address: '888 Summit Drive',
    city: 'Fresno',
    state: 'CA',
    zipCode: '93650',
  },
]

// ── Category map ───────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  cleaning: 'Cleaning',
  landscaping: 'Landscaping',
  general: 'General',
  roofing: 'Roofing',
  painting: 'Painting',
}

// ── Vendor Detail View ─────────────────────────────────────────────────────

function VendorDetail({ vendor, onBack }: { vendor: Vendor; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Back button + header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mt-0.5 shrink-0">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Truck className="size-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-foreground truncate">{vendor.name}</h2>
              <p className="text-sm text-muted-foreground truncate">{vendor.company}</p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs font-medium shrink-0 ${
                vendor.status === 'active'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-muted text-muted-foreground border-muted'
              }`}
            >
              {vendor.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
              <Star className="size-4 text-amber-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Rating</p>
              <p className="text-lg font-bold tracking-tight">{vendor.rating.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Jobs</p>
              <p className="text-lg font-bold tracking-tight">{vendor.totalJobs}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10">
              <CreditCard className="size-4 text-sky-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Payment Terms</p>
              <p className="text-lg font-bold tracking-tight">{vendor.paymentTerms.replace('net', 'Net ')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal-500/10">
              <Wrench className="size-4 text-teal-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Category</p>
              <p className="text-lg font-bold tracking-tight">{CATEGORY_LABELS[vendor.category] ?? vendor.category}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Contact Information */}
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{vendor.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{vendor.phone}</span>
            </div>
            {vendor.address && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="size-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">
                  {vendor.address}{vendor.city ? `, ${vendor.city}` : ''}{vendor.state ? `, ${vendor.state}` : ''} {vendor.zipCode ?? ''}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Wrench className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{vendor.specialty}</span>
            </div>
            {vendor.licenseNumber && (
              <div className="flex items-center gap-3 text-sm">
                <Shield className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">License: </span>
                  <span className="font-mono text-foreground">{vendor.licenseNumber}</span>
                </div>
              </div>
            )}
            {vendor.insuranceExpiry && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Insurance Exp: </span>
                  <span className="text-foreground">{vendor.insuranceExpiry}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {vendor.notes && (
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <StickyNote className="size-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{vendor.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-1.5">
          <FileText className="size-4" />
          View Work History
        </Button>
        <Button variant="outline" className="gap-1.5">
          <Phone className="size-4" />
          Contact
        </Button>
      </div>
    </motion.div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

export function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS)

  // Stats
  const stats = useMemo(() => {
    const totalVendors = vendors.length
    const activeVendors = vendors.filter((v) => v.status === 'active').length
    const topRated = vendors.filter((v) => v.rating >= 4.5).length
    const totalSpent = vendors.reduce((sum, v) => sum + v.totalJobs * 250, 0) // Estimated
    return { totalVendors, activeVendors, topRated, totalSpent }
  }, [vendors])

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.specialty.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [vendors, searchQuery, categoryFilter])

  // Add vendor handler
  const handleAddVendor = (newVendorData: Record<string, unknown>) => {
    const newVendor: Vendor = {
      id: `v${Date.now()}`,
      name: (newVendorData.name as string) ?? '',
      company: (newVendorData.company as string) ?? '',
      category: (newVendorData.category as string) ?? 'general',
      specialty: (newVendorData.specialty as string) ?? '',
      email: (newVendorData.email as string) ?? '',
      phone: (newVendorData.phone as string) ?? '',
      rating: 0,
      totalJobs: 0,
      status: 'active',
      paymentTerms: (newVendorData.paymentTerms as string) ?? 'net30',
      licenseNumber: (newVendorData.licenseNumber as string) ?? undefined,
      insuranceExpiry: (newVendorData.insuranceExpiry as string) ?? undefined,
      address: (newVendorData.address as string) ?? undefined,
      city: (newVendorData.city as string) ?? undefined,
      state: (newVendorData.state as string) ?? undefined,
      zipCode: (newVendorData.zipCode as string) ?? undefined,
      notes: (newVendorData.notes as string) ?? undefined,
    }
    setVendors((prev) => [newVendor, ...prev])
  }

  // ── Detail View ──────────────────────────────────────────────────────────
  if (selectedVendor) {
    return <VendorDetail vendor={selectedVendor} onBack={() => setSelectedVendor(null)} />
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <Truck className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Vendors & Contractors
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage your service providers and contractors
            </p>
          </div>
        </div>
        <AddVendorDialog onAdd={handleAddVendor} />
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Vendors
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">{stats.totalVendors}</p>
              <span className="text-[11px] text-muted-foreground">registered</span>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Active
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight text-primary">{stats.activeVendors}</p>
              <span className="text-[11px] text-muted-foreground">
                {stats.totalVendors > 0 ? `${Math.round((stats.activeVendors / stats.totalVendors) * 100)}%` : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Top Rated
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">{stats.topRated}</p>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-amber-500">
                <Star className="size-3 fill-amber-400" />
                4.5+
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Spent
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">
                ${stats.totalSpent >= 1000 ? `${(stats.totalSpent / 1000).toFixed(1)}k` : stats.totalSpent.toLocaleString()}
              </p>
              <span className="text-[11px] text-muted-foreground">est.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vendors by name, company, email, or specialty..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vendor Grid */}
      <AnimatePresence mode="wait">
        {filteredVendors.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredVendors.map((vendor, index) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                index={index}
                onClick={() => setSelectedVendor(vendor)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="mojave-card border-border/40 bg-card/80">
              <CardContent className="py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <Truck className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No vendors found</h3>
                <p className="mt-1 max-w-sm mx-auto text-sm text-muted-foreground">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Add your first vendor to get started.'}
                </p>
                {(searchQuery || categoryFilter !== 'all') && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('')
                      setCategoryFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                {!searchQuery && categoryFilter === 'all' && (
                  <AddVendorDialog onAdd={handleAddVendor}>
                    <Button className="mt-4 gap-1.5">
                      <Plus className="size-4" />
                      Add Vendor
                    </Button>
                  </AddVendorDialog>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
