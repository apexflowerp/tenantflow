'use client'

import * as React from 'react'
import {
  User,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Shield,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ApplicationData {
  id: string
  listingId: string
  listingTitle: string
  applicantName: string
  email: string
  phone: string
  income: number
  employment: string
  moveInDate: string
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected'
  score: number
  appliedDate: string
}

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  submitted: {
    label: 'Submitted',
    color: 'text-sky-700 dark:text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    icon: FileText,
  },
  reviewing: {
    label: 'Under Review',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    icon: Shield,
  },
  approved: {
    label: 'Approved',
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    icon: XCircle,
  },
}

// ── Score color helper ───────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-primary'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-primary'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

// ── Format currency ──────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

// ── Mock documents ───────────────────────────────────────────────────────────

const MOCK_DOCUMENTS = [
  { name: 'Government ID', type: 'id', status: 'verified' },
  { name: 'Proof of Income', type: 'income', status: 'verified' },
  { name: 'Employment Letter', type: 'employment', status: 'pending' },
  { name: 'Previous Landlord Reference', type: 'reference', status: 'verified' },
  { name: 'Bank Statement', type: 'financial', status: 'pending' },
]

// ── Component ────────────────────────────────────────────────────────────────

interface ApplicationReviewProps {
  application: ApplicationData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function ApplicationReview({
  application,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApplicationReviewProps) {
  const [notes, setNotes] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  if (!application) return null

  const statusConfig = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.submitted
  const StatusIcon = statusConfig.icon
  const scoreColor = getScoreColor(application.score)

  async function handleAction(action: 'approve' | 'reject') {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsProcessing(false)
    if (action === 'approve') {
      onApprove?.(application.id)
    } else {
      onReject?.(application.id)
    }
    onOpenChange(false)
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="size-4 text-primary" />
            </div>
            Application Review
          </DialogTitle>
          <DialogDescription>
            Review applicant details and make a decision.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Applicant info card */}
          <div className="rounded-xl border border-border/40 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm">
                {application.applicantName.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{application.applicantName}</h3>
                <p className="text-xs text-muted-foreground">Applied for {application.listingTitle}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold border gap-1 ${statusConfig.bg} ${statusConfig.color}`}
              >
                <StatusIcon className="size-3" />
                {statusConfig.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">{application.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{application.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{formatCurrency(application.income)}/yr</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Move-in: {application.moveInDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">{application.employment}</span>
            </div>
          </div>

          {/* Screening Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Shield className="size-4 text-muted-foreground" />
                Screening Score
              </Label>
              <span className={`text-lg font-bold ${scoreColor}`}>
                {application.score}
                <span className="text-xs font-normal text-muted-foreground">/100</span>
              </span>
            </div>
            <Progress
              value={application.score}
              className="h-2"
            />
            <p className="text-[11px] text-muted-foreground">
              {application.score >= 80
                ? 'Excellent candidate — meets all criteria'
                : application.score >= 60
                ? 'Good candidate — some areas need attention'
                : 'Below average — review carefully before approving'}
            </p>
          </div>

          <Separator />

          {/* Documents */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Submitted Documents</Label>
            <div className="space-y-1.5">
              {MOCK_DOCUMENTS.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-lg border border-border/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{doc.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      doc.status === 'verified'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {doc.status === 'verified' ? (
                      <CheckCircle2 className="size-3 mr-0.5" />
                    ) : (
                      <XCircle className="size-3 mr-0.5" />
                    )}
                    {doc.status === 'verified' ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="review-notes" className="text-sm font-medium">
              Review Notes
            </Label>
            <Textarea
              id="review-notes"
              placeholder="Add notes about this application..."
              className="min-h-[72px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {(application.status === 'submitted' || application.status === 'reviewing') && (
            <>
              <Button
                variant="outline"
                className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-600"
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
              >
                <XCircle className="size-4 mr-1.5" />
                Reject
              </Button>
              <Button
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1.5" />
                ) : (
                  <CheckCircle2 className="size-4 mr-1.5" />
                )}
                Approve
              </Button>
            </>
          )}
          {application.status === 'approved' && (
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-sm px-4 py-2">
              <CheckCircle2 className="size-4" />
              Application Approved
            </Badge>
          )}
          {application.status === 'rejected' && (
            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 gap-1 text-sm px-4 py-2">
              <XCircle className="size-4" />
              Application Rejected
            </Badge>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
