'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Layers,
  MapPin,
  Ruler,
  Users,
  FileText,
  FolderOpen,
  Plus,
  Home,
  Bath,
  BedDouble,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Property, Unit } from '@/stores'

interface PropertyDetailProps {
  property: Property
  onBack: () => void
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
          Active
        </Badge>
      )
    case 'maintenance':
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
          Maintenance
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getUnitStatusBadge(status: string) {
  switch (status) {
    case 'vacant':
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-xs">
          Vacant
        </Badge>
      )
    case 'occupied':
      return (
        <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 text-xs">
          Occupied
        </Badge>
      )
    case 'maintenance':
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs">
          Maintenance
        </Badge>
      )
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'residential':
      return (
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize">
          {type}
        </Badge>
      )
    case 'commercial':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 capitalize">
          {type}
        </Badge>
      )
    case 'mixed':
      return (
        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 capitalize">
          {type}
        </Badge>
      )
    default:
      return <Badge variant="outline" className="capitalize">{type}</Badge>
  }
}

export function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = property.stats
  const totalUnits = stats?.totalUnits ?? property.totalUnits ?? 0
  const occupiedUnits = stats?.occupiedUnits ?? property.occupiedUnits ?? 0
  const vacantUnits = stats?.vacancyUnits ?? 0
  const monthlyRevenue = stats?.monthlyRevenue ?? 0
  const units = property.units ?? []
  const leaseCount = property._count?.leases ?? 0
  const documentCount = property._count?.documents ?? 0

  const overviewStats = [
    {
      label: 'Total Units',
      value: totalUnits,
      icon: Home,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
    {
      label: 'Occupied',
      value: occupiedUnits,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      label: 'Vacant',
      value: vacantUnits,
      icon: Building2,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: FileText,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {property.name}
            </h1>
            {getTypeBadge(property.type)}
            {getStatusBadge(property.status)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {property.address}, {property.city}
              {property.state ? `, ${property.state}` : ''}
              {property.zipCode ? ` ${property.zipCode}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="leases">Leases</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <AnimatePresence mode="wait">
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewStats.map((stat) => (
                  <Card key={stat.label} className="py-0 gap-0">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`size-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                        <stat.icon className={`size-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Property Details */}
              <Card className="py-0 gap-0">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-base">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.yearBuilt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Year Built</p>
                          <p className="text-sm font-medium">{property.yearBuilt}</p>
                        </div>
                      </div>
                    )}
                    {property.totalArea && (
                      <div className="flex items-center gap-2">
                        <Ruler className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Total Area</p>
                          <p className="text-sm font-medium">{property.totalArea.toLocaleString()} sq ft</p>
                        </div>
                      </div>
                    )}
                    {property.floors && (
                      <div className="flex items-center gap-2">
                        <Layers className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Floors</p>
                          <p className="text-sm font-medium">{property.floors}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Home className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Units</p>
                        <p className="text-sm font-medium">{totalUnits}</p>
                      </div>
                    </div>
                  </div>

                  {property.description && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {property.description}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units">
          <AnimatePresence mode="wait">
            <motion.div
              key="units"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="py-0 gap-0">
                <CardHeader className="p-4 pb-0 flex-row items-center justify-between">
                  <CardTitle className="text-base">Units ({units.length})</CardTitle>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="size-3.5" />
                    Add Unit
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {units.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Building2 className="size-10 mb-3 opacity-40" />
                      <p className="text-sm font-medium">No units yet</p>
                      <p className="text-xs">Add units to this property to get started.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit #</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            <span className="flex items-center gap-1">
                              <BedDouble className="size-3.5" /> Beds
                            </span>
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            <span className="flex items-center gap-1">
                              <Bath className="size-3.5" /> Baths
                            </span>
                          </TableHead>
                          <TableHead className="hidden md:table-cell">Area</TableHead>
                          <TableHead>Rent</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {units.map((unit: Unit) => (
                          <TableRow key={unit.id}>
                            <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                            <TableCell className="capitalize">{unit.type}</TableCell>
                            <TableCell className="hidden sm:table-cell">{unit.bedrooms}</TableCell>
                            <TableCell className="hidden sm:table-cell">{unit.bathrooms}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {unit.area ? `${unit.area} sq ft` : '—'}
                            </TableCell>
                            <TableCell>${unit.rent.toLocaleString()}</TableCell>
                            <TableCell>{getUnitStatusBadge(unit.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Leases Tab */}
        <TabsContent value="leases">
          <AnimatePresence mode="wait">
            <motion.div
              key="leases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="py-0 gap-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="size-10 mb-3 opacity-40" />
                    <p className="text-sm font-medium">{leaseCount} Leases</p>
                    <p className="text-xs">Lease management coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <AnimatePresence mode="wait">
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="py-0 gap-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FolderOpen className="size-10 mb-3 opacity-40" />
                    <p className="text-sm font-medium">{documentCount} Documents</p>
                    <p className="text-xs">Document management coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
