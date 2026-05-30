'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { AddEventDialog } from './add-event-dialog'

// ── Mock Data ────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string
  title: string
  type: string
  startDate: string
  endDate: string
  allDay?: boolean
  location?: string
  status: string
  color: string
}

const EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Property Showing - Unit 4B', type: 'showing', startDate: '2025-03-15T10:00', endDate: '2025-03-15T11:00', location: 'Skyline Tower', status: 'confirmed', color: '#5e3c92' },
  { id: 'e2', title: 'Annual Safety Inspection', type: 'inspection', startDate: '2025-03-20T09:00', endDate: '2025-03-20T12:00', location: 'Harbor View Residences', status: 'confirmed', color: '#c4736e' },
  { id: 'e3', title: 'HVAC Maintenance', type: 'maintenance', startDate: '2025-03-18T14:00', endDate: '2025-03-18T16:00', location: 'Greenfield Gardens', status: 'confirmed', color: '#e8a555' },
  { id: 'e4', title: 'Lease Renewal Meeting', type: 'meeting', startDate: '2025-03-22T11:00', endDate: '2025-03-22T12:00', location: 'Office', status: 'confirmed', color: '#8b5a9f' },
  { id: 'e5', title: 'Insurance Premium Due', type: 'deadline', startDate: '2025-03-31', endDate: '2025-03-31', allDay: true, status: 'pending', color: '#ef4444' },
  { id: 'e6', title: 'Rent Reminder - All Units', type: 'reminder', startDate: '2025-04-01T08:00', endDate: '2025-04-01T08:30', status: 'confirmed', color: '#22c55e' },
  { id: 'e7', title: 'Property Showing - Unit 7C', type: 'showing', startDate: '2025-03-17T15:00', endDate: '2025-03-17T16:00', location: 'Skyline Tower', status: 'confirmed', color: '#5e3c92' },
  { id: 'e8', title: 'Board Meeting', type: 'meeting', startDate: '2025-03-25T10:00', endDate: '2025-03-25T12:00', location: 'Conference Room', status: 'confirmed', color: '#8b5a9f' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    showing: 'Showing',
    inspection: 'Inspection',
    maintenance: 'Maintenance',
    meeting: 'Meeting',
    deadline: 'Deadline',
    reminder: 'Reminder',
  }
  return map[type] ?? type
}

function getTypeIcon(type: string): string {
  const map: Record<string, string> = {
    showing: '🏠',
    inspection: '🔍',
    maintenance: '🔧',
    meeting: '🤝',
    deadline: '⏰',
    reminder: '🔔',
  }
  return map[type] ?? '📅'
}

function getEventDate(event: CalendarEvent): Date {
  return parseISO(event.startDate)
}

function getEventsForDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((event) => {
    const eventDate = getEventDate(event)
    return isSameDay(eventDate, date)
  })
}

function formatEventTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    return format(date, 'h:mm a')
  } catch {
    return dateStr
  }
}

// ── Stats Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  index: number
}

function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="mojave-card border-border/40 bg-card/80 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
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

// ── Month Calendar ───────────────────────────────────────────────────────────

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface MonthCalendarProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  selectedDate: Date | null
}

function MonthCalendar({ currentDate, events, onDateClick, selectedDate }: MonthCalendarProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  return (
    <div className="select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px bg-border/20 rounded-xl overflow-hidden">
        {days.map((d, i) => {
          const dayEvents = getEventsForDate(d, events)
          const inMonth = isSameMonth(d, currentDate)
          const today = isToday(d)
          const selected = selectedDate && isSameDay(d, selectedDate)

          return (
            <button
              key={i}
              onClick={() => onDateClick(d)}
              className={cn(
                'relative min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 text-left transition-colors',
                inMonth ? 'bg-card/60' : 'bg-muted/20',
                today && 'bg-primary/5',
                selected && 'bg-primary/10 ring-1 ring-primary/30',
                'hover:bg-accent/50'
              )}
            >
              <span
                className={cn(
                  'inline-flex size-6 items-center justify-center rounded-full text-xs font-medium',
                  today && 'bg-primary text-primary-foreground',
                  !today && inMonth && 'text-foreground',
                  !today && !inMonth && 'text-muted-foreground/50'
                )}
              >
                {format(d, 'd')}
              </span>

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="mt-0.5 sm:mt-1 space-y-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="hidden sm:flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium truncate"
                      style={{
                        backgroundColor: `${event.color}15`,
                        color: event.color,
                      }}
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {/* Mobile: just dots */}
                  <div className="sm:hidden flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 4).map((event) => (
                      <span
                        key={event.id}
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[8px] text-muted-foreground">+{dayEvents.length - 4}</span>
                    )}
                  </div>
                  {dayEvents.length > 3 && (
                    <p className="hidden sm:block text-[9px] text-muted-foreground pl-1">
                      +{dayEvents.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Upcoming Events Sidebar ──────────────────────────────────────────────────

interface UpcomingEventsProps {
  events: CalendarEvent[]
  selectedDate: Date | null
}

function UpcomingEvents({ events, selectedDate }: UpcomingEventsProps) {
  // Show events for selected date, or upcoming events
  const displayEvents = React.useMemo(() => {
    if (selectedDate) {
      return getEventsForDate(selectedDate, events)
    }
    // Otherwise show upcoming events
    const now = new Date()
    return events
      .filter((e) => getEventDate(e) >= now)
      .sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime())
      .slice(0, 6)
  }, [events, selectedDate])

  const sectionTitle = selectedDate
    ? format(selectedDate, 'EEEE, MMMM d')
    : 'Upcoming Events'

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{sectionTitle}</h3>

      {displayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarIcon className="size-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No events scheduled</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-lg border border-border/40 p-3 transition-all hover:shadow-sm hover:border-border/60"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="mt-0.5 size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {event.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {event.allDay
                        ? 'All Day'
                        : `${formatEventTime(event.startDate)} – ${formatEventTime(event.endDate)}`}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge
                      className="text-[10px] border-0 px-1.5 py-0"
                      style={{
                        backgroundColor: `${event.color}15`,
                        color: event.color,
                      }}
                    >
                      {getTypeIcon(event.type)} {getTypeLabel(event.type)}
                    </Badge>
                    {event.status === 'pending' && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-0 text-[10px] px-1.5 py-0">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Calendar Page ───────────────────────────────────────────────────────

export function CalendarPage() {
  const [addEventOpen, setAddEventOpen] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState(new Date(2025, 2, 1)) // March 2025 to match data
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  // Stats
  const now = new Date()
  const upcomingEvents = EVENTS.filter((e) => getEventDate(e) >= now).length
  const todayEvents = EVENTS.filter((e) => isSameDay(getEventDate(e), now)).length
  const thisWeekEvents = EVENTS.filter((e) => {
    const d = getEventDate(e)
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    return d >= weekStart && d <= weekEnd
  }).length
  const showings = EVENTS.filter((e) => e.type === 'showing').length

  const handleDateClick = (date: Date) => {
    setSelectedDate((prev) => (prev && isSameDay(prev, date) ? null : date))
  }

  const handlePrevMonth = () => setCurrentDate((d) => subMonths(d, 1))
  const handleNextMonth = () => setCurrentDate((d) => addMonths(d, 1))
  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <CalendarIcon className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Calendar & Scheduling
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage showings, inspections, and events across properties
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setAddEventOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Event</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Events"
          value={String(upcomingEvents)}
          subtitle="Scheduled ahead"
          icon={CalendarIcon}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          index={0}
        />
        <StatCard
          title="Today&apos;s Events"
          value={String(todayEvents)}
          subtitle={format(now, 'EEEE, MMM d')}
          icon={Clock}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          index={1}
        />
        <StatCard
          title="This Week"
          value={String(thisWeekEvents)}
          subtitle={format(startOfWeek(now), 'MMM d') + ' – ' + format(endOfWeek(now), 'MMM d')}
          icon={CalendarIcon}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/40"
          index={2}
        />
        <StatCard
          title="Showings"
          value={String(showings)}
          subtitle="Property showings"
          icon={MapPin}
          iconColor="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-950/40"
          index={3}
        />
      </div>

      {/* Calendar + Sidebar Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar */}
        <Card className="mojave-card border-border/40 bg-card/80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  onClick={handleToday}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MonthCalendar
              currentDate={currentDate}
              events={EVENTS}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-4">
              <UpcomingEvents
                events={EVENTS}
                selectedDate={selectedDate}
              />
            </CardContent>
          </Card>

          {/* Event Type Legend */}
          <Card className="mojave-card border-border/40 bg-card/80">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Event Types</h3>
              <div className="space-y-2">
                {[
                  { type: 'showing', color: '#5e3c92' },
                  { type: 'inspection', color: '#c4736e' },
                  { type: 'maintenance', color: '#e8a555' },
                  { type: 'meeting', color: '#8b5a9f' },
                  { type: 'deadline', color: '#ef4444' },
                  { type: 'reminder', color: '#22c55e' },
                ].map(({ type, color }) => (
                  <div key={type} className="flex items-center gap-2.5">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {getTypeIcon(type)} {getTypeLabel(type)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <AddEventDialog
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
      />
    </motion.div>
  )
}
