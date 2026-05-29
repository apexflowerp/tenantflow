'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardCheck,
  Calendar,
  Star,
  MapPin,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  User,
  Building2,
  FileText,
  Activity,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { InspectionCard } from './inspection-card'
import { ScheduleInspectionDialog } from './schedule-inspection-dialog'
import type { Inspection } from './inspection-card'

// ── Mock data ─────────────────────────────────────────────────────────────────

const INSPECTIONS: Inspection[] = [
  { id: 'i1', title: 'Move-In Inspection - Unit 4B', type: 'move_in', status: 'completed', scheduledDate: '2025-01-15', completedDate: '2025-01-15', property: 'Skyline Tower', unit: '4B', inspectorName: 'Jordan Davis', rating: 4.8, findings: 'Unit in excellent condition. Minor scratch on kitchen counter.' },
  { id: 'i2', title: 'Annual Safety Check', type: 'annual', status: 'scheduled', scheduledDate: '2025-03-20', completedDate: null, property: 'Harbor View Residences', unit: null, inspectorName: 'Alex Morgan', rating: null },
  { id: 'i3', title: 'Move-Out Inspection - Unit 12A', type: 'move_out', status: 'in_progress', scheduledDate: '2025-02-28', completedDate: null, property: 'Metro Commercial Hub', unit: '12A', inspectorName: 'Sam Taylor', rating: null },
  { id: 'i4', title: 'Seasonal HVAC Review', type: 'seasonal', status: 'scheduled', scheduledDate: '2025-04-01', completedDate: null, property: 'Greenfield Gardens', unit: null, inspectorName: 'Mike Johnson', rating: null },
  { id: 'i5', title: 'Compliance Fire Safety', type: 'compliance', status: 'completed', scheduledDate: '2025-01-10', completedDate: '2025-01-10', property: 'Riverside Apartments', unit: null, inspectorName: 'Jordan Davis', rating: 4.5, findings: 'All fire extinguishers current. Exit signs functional.' },
  { id: 'i6', title: 'Emergency Water Damage', type: 'emergency', status: 'completed', scheduledDate: '2025-02-05', completedDate: '2025-02-06', property: 'Skyline Tower', unit: '7C', inspectorName: 'Alex Morgan', rating: 3.2, findings: 'Significant water damage in bathroom. Drywall replacement needed.' },
]

// ── Config maps ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  move_in: { label: 'Move-In', color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500/10' },
  move_out: { label: 'Move-Out', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
  annual: { label: 'Annual', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-500/10' },
  seasonal: { label: 'Seasonal', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10' },
  emergency: { label: 'Emergency', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10' },
  compliance: { label: 'Compliance', color: 'text-primary', bg: 'bg-primary/10' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', dot: 'bg-teal-500' },
  completed: { label: 'Completed', color: 'text-primary', bg: 'bg-primary/10 border-primary/20', dot: 'bg-primary' },
}

// ── Stat card definitions ─────────────────────────────────────────────────────

interface StatCardDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  getValue: (inspections: Inspection[]) => string
}

const STAT_CARDS: StatCardDef[] = [
  {
    key: 'total',
    label: 'Total Inspections',
    icon: ClipboardCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
    getValue: (inspections) => inspections.length.toString(),
  },
  {
    key: 'scheduled',
    label: 'Scheduled',
    icon: Calendar,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    getValue: (inspections) => inspections.filter((i) => i.status === 'scheduled').length.toString(),
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    getValue: (inspections) => inspections.filter((i) => i.status === 'completed').length.toString(),
  },
  {
    key: 'avg_rating',
    label: 'Avg Rating',
    icon: Star,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    getValue: (inspections) => {
      const rated = inspections.filter((i) => i.rating !== null)
      if (rated.length === 0) return '—'
      const avg = rated.reduce((sum, i) => sum + (i.rating ?? 0), 0) / rated.length
      return avg.toFixed(1)
    },
  },
]

// ── Detail view component ─────────────────────────────────────────────────────

function InspectionDetail({
  inspection,
  onBack,
}: {
  inspection: Inspection
  onBack: () => void
}) {
  const typeConfig = TYPE_CONFIG[inspection.type] ?? TYPE_CONFIG.annual
  const statusConfig = STATUS_CONFIG[inspection.status] ?? STATUS_CONFIG.scheduled

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <motion.div
      key={inspection.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-11 items-center justify-center rounded-xl ${typeConfig.bg}`}>
            <ClipboardCheck className={`size-5 ${typeConfig.color}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{inspection.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-[11px] ${typeConfig.bg} ${typeConfig.color} border`}>
                {typeConfig.label}
              </Badge>
              <Badge variant="outline" className={`text-[11px] gap-1 ${statusConfig.bg} ${statusConfig.color} border`}>
                <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Property</p>
              <p className="text-sm font-semibold text-foreground">{inspection.property}</p>
              {inspection.unit && <p className="text-xs text-muted-foreground">Unit {inspection.unit}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
              <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Scheduled Date</p>
              <p className="text-sm font-semibold text-foreground">{formatDate(inspection.scheduledDate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mojave-card border-border/40 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal-500/10">
              <User className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Inspector</p>
              <p className="text-sm font-semibold text-foreground">{inspection.inspectorName}</p>
            </div>
          </CardContent>
        </Card>

        {inspection.completedDate && (
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Completed Date</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(inspection.completedDate)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {inspection.rating !== null && (
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Star className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Rating</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground">{inspection.rating.toFixed(1)}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${
                          i < Math.floor(inspection.rating ?? 0)
                            ? 'fill-current text-amber-500'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {inspection.type === 'emergency' && (
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Priority</p>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">Emergency</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Findings */}
      {inspection.findings && (
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              Inspection Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">{inspection.findings}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="mojave-card border-border/40 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10">
                  <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="w-px h-full bg-border/40 mt-1" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-foreground">Inspection Scheduled</p>
                <p className="text-xs text-muted-foreground">{formatDate(inspection.scheduledDate)} · by {inspection.inspectorName}</p>
              </div>
            </div>

            {inspection.status === 'in_progress' && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 items-center justify-center rounded-full bg-teal-500/10">
                    <Clock className="size-4 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Inspection In Progress</p>
                  <p className="text-xs text-muted-foreground">Inspector is currently on-site</p>
                </div>
              </div>
            )}

            {inspection.status === 'completed' && inspection.completedDate && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Inspection Completed</p>
                  <p className="text-xs text-muted-foreground">{formatDate(inspection.completedDate)} · Rating: {inspection.rating?.toFixed(1) ?? 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {inspection.status === 'scheduled' && (
          <Button>
            <Clock className="size-4 mr-1.5" />
            Start Inspection
          </Button>
        )}
        {inspection.status === 'in_progress' && (
          <Button>
            <CheckCircle2 className="size-4 mr-1.5" />
            Complete Inspection
          </Button>
        )}
        <Button variant="outline">
          <FileText className="size-4 mr-1.5" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Building2 className="size-4 mr-1.5" />
          View Property
        </Button>
      </div>
    </motion.div>
  )
}

// ── Main page component ───────────────────────────────────────────────────────

export function InspectionsPage() {
  const [inspections] = React.useState<Inspection[]>(INSPECTIONS)
  const [selectedInspection, setSelectedInspection] = React.useState<Inspection | null>(null)
  const [scheduleDialogOpen, setScheduleDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('all')
  const [filterType, setFilterType] = React.useState('all')

  // Filter inspections
  const filteredInspections = React.useMemo(() => {
    let result = inspections

    // Status filter via tabs
    if (activeTab !== 'all') {
      result = result.filter((i) => i.status === activeTab)
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter((i) => i.type === filterType)
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.property.toLowerCase().includes(q) ||
          i.inspectorName.toLowerCase().includes(q) ||
          (i.unit && i.unit.toLowerCase().includes(q))
      )
    }

    return result
  }, [inspections, activeTab, filterType, searchQuery])

  // Stats
  const stats = React.useMemo(
    () => STAT_CARDS.map((card) => ({ ...card, value: card.getValue(inspections) })),
    [inspections]
  )

  // Handle schedule
  function handleSchedule() {
    // In production, this would call an API. For now, just close the dialog.
    setScheduleDialogOpen(false)
  }

  // Detail view
  if (selectedInspection) {
    return (
      <InspectionDetail
        inspection={selectedInspection}
        onBack={() => setSelectedInspection(null)}
      />
    )
  }

  // Main list view
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="inspections-list"
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
              <ClipboardCheck className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Inspections</h1>
              <p className="text-sm text-muted-foreground">
                {inspections.length} inspection{inspections.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setScheduleDialogOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Schedule Inspection
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card, i) => {
            const CardIcon = card.icon
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="mojave-card border-border/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                          {card.value}
                        </p>
                      </div>
                      <div className={`flex size-10 items-center justify-center rounded-xl ${card.bg}`}>
                        <CardIcon className={`size-5 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filter Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search inspections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-full sm:w-[220px]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="size-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Types</option>
                <option value="move_in">Move-In</option>
                <option value="move_out">Move-Out</option>
                <option value="annual">Annual</option>
                <option value="seasonal">Seasonal</option>
                <option value="emergency">Emergency</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inspections List */}
        {filteredInspections.length === 0 ? (
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <ClipboardCheck className="size-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Inspections Found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchQuery || filterType !== 'all' || activeTab !== 'all'
                  ? 'Try adjusting your filters or search query.'
                  : 'Schedule your first inspection to start tracking property conditions.'}
              </p>
              {!searchQuery && filterType === 'all' && activeTab === 'all' && (
                <Button className="mt-4" onClick={() => setScheduleDialogOpen(true)}>
                  <Plus className="size-4 mr-1.5" />
                  Schedule Inspection
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInspections.map((inspection, i) => (
              <motion.div
                key={inspection.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: i * 0.04 }}
              >
                <InspectionCard
                  inspection={inspection}
                  onClick={() => setSelectedInspection(inspection)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Schedule Inspection Dialog */}
        <ScheduleInspectionDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          onSchedule={handleSchedule}
        />
      </motion.div>
    </AnimatePresence>
  )
}
