'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Star,
  Users,
  TrendingUp,
  Search,
  Plus,
  Download,
  ChevronDown,
  CheckCircle2,
  BarChart3,
  Clock,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type SurveyStatus = 'active' | 'closed' | 'draft'

interface Survey {
  id: string
  name: string
  description: string
  questions: number
  responses: number
  targetResponses: number
  avgScore: number
  status: SurveyStatus
  createdAt: string
  closesAt: string | null
  category: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SURVEYS: Survey[] = [
  { id: 'sv-001', name: 'Q2 Tenant Satisfaction', description: 'Quarterly survey on overall tenant satisfaction, maintenance quality, and community engagement', questions: 12, responses: 87, targetResponses: 120, avgScore: 4.3, status: 'active', createdAt: '2025-06-01', closesAt: '2025-06-30', category: 'Satisfaction' },
  { id: 'sv-002', name: 'Maintenance Response Survey', description: 'Feedback on maintenance ticket response time and quality of repairs', questions: 8, responses: 45, targetResponses: 60, avgScore: 3.8, status: 'active', createdAt: '2025-06-10', closesAt: '2025-07-10', category: 'Maintenance' },
  { id: 'sv-003', name: 'Amenity Usage Feedback', description: 'How residents use and rate available amenities', questions: 6, responses: 32, targetResponses: 80, avgScore: 4.1, status: 'active', createdAt: '2025-06-05', closesAt: '2025-07-05', category: 'Amenities' },
  { id: 'sv-004', name: 'Move-in Experience', description: 'New tenant onboarding experience and initial impressions', questions: 10, responses: 24, targetResponses: 30, avgScore: 4.5, status: 'closed', createdAt: '2025-05-01', closesAt: '2025-05-31', category: 'Onboarding' },
  { id: 'sv-005', name: 'Communication Preferences', description: 'How tenants prefer to receive updates and announcements', questions: 5, responses: 56, targetResponses: 100, avgScore: 4.0, status: 'closed', createdAt: '2025-04-15', closesAt: '2025-05-15', category: 'Communication' },
  { id: 'sv-006', name: 'Parking & Transportation', description: 'Parking satisfaction and transportation needs assessment', questions: 7, responses: 0, targetResponses: 80, avgScore: 0, status: 'draft', createdAt: '2025-06-14', closesAt: null, category: 'Parking' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderStars(score: number): React.ReactNode[] {
  const stars: React.ReactNode[] = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={cn('size-4', i <= Math.round(score) ? 'text-tahoe-orange fill-tahoe-orange' : 'text-muted-foreground/20')}
      />
    )
  }
  return stars
}

function getStatusBadge(status: SurveyStatus): string {
  const map: Record<SurveyStatus, string> = {
    active: 'tahoe-badge tahoe-badge-green',
    closed: 'tahoe-badge tahoe-badge-blue',
    draft: 'tahoe-badge tahoe-badge-orange',
  }
  return map[status]
}

// ── Main Component ────────────────────────────────────────────────────────────

export function SurveysPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<SurveyStatus | 'all'>('all')

  const activeSurveys = SURVEYS.filter(s => s.status === 'active').length
  const totalResponses = SURVEYS.reduce((sum, s) => sum + s.responses, 0)
  const scoredSurveys = SURVEYS.filter(s => s.avgScore > 0)
  const avgSatisfaction = scoredSurveys.length > 0 ? (scoredSurveys.reduce((sum, s) => sum + s.avgScore, 0) / scoredSurveys.length).toFixed(1) : '0'
  const completionRate = Math.round((SURVEYS.reduce((sum, s) => sum + s.responses, 0) / SURVEYS.reduce((sum, s) => sum + s.targetResponses, 0)) * 100)

  const filteredSurveys = SURVEYS.filter(s => {
    const matchSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = [
    { title: 'Active Surveys', value: String(activeSurveys), subtitle: 'Currently open', icon: ClipboardList, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Total Responses', value: totalResponses.toLocaleString(), subtitle: 'Across all surveys', icon: Users, iconColor: 'text-tahoe-purple', iconBg: 'bg-tahoe-purple/10' },
    { title: 'Avg Satisfaction', value: `${avgSatisfaction}/5`, subtitle: 'Overall rating', icon: Star, iconColor: 'text-tahoe-orange', iconBg: 'bg-tahoe-orange/10' },
    { title: 'Completion Rate', value: `${completionRate}%`, subtitle: 'Response target met', icon: TrendingUp, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
  ]

  // Distribution chart mock data
  const distribution = [
    { label: 'Very Satisfied', count: 45, color: 'bg-tahoe-green', percentage: 38 },
    { label: 'Satisfied', count: 35, color: 'bg-tahoe-blue', percentage: 29 },
    { label: 'Neutral', count: 25, color: 'bg-tahoe-orange', percentage: 21 },
    { label: 'Dissatisfied', count: 10, color: 'bg-tahoe-red', percentage: 8 },
    { label: 'Very Dissatisfied', count: 5, color: 'bg-tahoe-purple', percentage: 4 },
  ]

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
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-orange/10">
            <ClipboardList className="size-6 text-tahoe-orange" />
          </div>
          <div>
            <h1 className="tahoe-title">Surveys</h1>
            <p className="tahoe-caption mt-1">Tenant satisfaction & feedback surveys</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Create Survey
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

      {/* Response Distribution */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="tahoe-headline">Response Distribution</CardTitle>
          <p className="tahoe-caption mt-1">Overall satisfaction breakdown</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {distribution.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-28 text-xs text-muted-foreground shrink-0">{item.label}</span>
              <div className="flex-1 h-6 rounded-lg bg-muted/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={cn('h-full rounded-lg', item.color)}
                />
              </div>
              <span className="w-12 text-right text-xs font-medium text-foreground">{item.percentage}%</span>
              <span className="w-10 text-right text-[11px] text-muted-foreground">({item.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Search surveys..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm glass-input border-0" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as SurveyStatus | 'all')}
            className="h-9 rounded-lg border-0 bg-secondary/60 px-3 pr-7 text-sm text-foreground appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Survey Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredSurveys.map((survey, i) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="glass-card tahoe-hover overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{survey.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{survey.category}</p>
                    </div>
                    <span className={getStatusBadge(survey.status)}>{survey.status}</span>
                  </div>

                  <p className="tahoe-caption line-clamp-2">{survey.description}</p>

                  {survey.avgScore > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {renderStars(survey.avgScore)}
                      <span className="text-sm font-bold text-foreground ml-1">{survey.avgScore}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Star className="size-3.5" />
                      No responses yet
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{survey.questions}</p>
                      <p className="text-[10px] text-muted-foreground">Questions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{survey.responses}</p>
                      <p className="text-[10px] text-muted-foreground">Responses</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round((survey.responses / survey.targetResponses) * 100)}%</span>
                    </div>
                    <Progress value={(survey.responses / survey.targetResponses) * 100} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="size-3" />{survey.createdAt}</span>
                    {survey.closesAt && <span>Closes {survey.closesAt}</span>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
