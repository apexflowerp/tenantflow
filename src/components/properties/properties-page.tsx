'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Building2, SlidersHorizontal } from 'lucide-react'
import { usePropertyStore } from '@/stores'
import { PropertyCard } from './property-card'
import { PropertyDetail } from './property-detail'
import { AddPropertyDialog } from './add-property-dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export function PropertiesPage() {
  const { properties, selectedProperty, isLoading, fetchProperties, selectProperty, clearSelection } =
    usePropertyStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const filteredProperties = useMemo(() => {
    let result = properties

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }

    return result
  }, [properties, searchQuery, typeFilter, statusFilter])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {selectedProperty ? (
            <PropertyDetail
              key="detail"
              property={selectedProperty}
              onBack={clearSelection}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Building2 className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground">Properties</h1>
                      <Badge variant="secondary" className="text-xs">
                        {properties.length}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage your property portfolio
                    </p>
                  </div>
                </div>
                <AddPropertyDialog />
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 p-4 rounded-lg border bg-card">
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger size="sm" className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger size="sm" className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && properties.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border overflow-hidden">
                      <Skeleton className="h-40 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="grid grid-cols-3 gap-2">
                          <Skeleton className="h-14 rounded-lg" />
                          <Skeleton className="h-14 rounded-lg" />
                          <Skeleton className="h-14 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredProperties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Building2 className="size-14 mb-4 opacity-30" />
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                      ? 'No properties match your filters'
                      : 'No properties yet'}
                  </h3>
                  <p className="text-sm mb-4">
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your search or filters.'
                      : 'Get started by adding your first property.'}
                  </p>
                  {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
                    <AddPropertyDialog />
                  )}
                </div>
              )}

              {/* Property Grid */}
              {!isLoading && filteredProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      onClick={() => selectProperty(property.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
