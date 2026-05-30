'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// ── Types ────────────────────────────────────────────────────────────────────

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

// ── Component ────────────────────────────────────────────────────────────────

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// ── Form Row ─────────────────────────────────────────────────────────────────

interface SettingsFormRowProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsFormRow({
  label,
  description,
  children,
  className,
}: SettingsFormRowProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 ${
        className || ''
      }`}
    >
      <div className="space-y-0.5 sm:flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="sm:w-64 lg:w-80 shrink-0">{children}</div>
    </div>
  )
}
