'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  FileText,
  BarChart3,
  Building2,
  Wrench,
  Users,
  TrendingUp,
  Lightbulb,
  RotateCcw,
  MessageSquare,
  Zap,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useChatStore } from '@/stores'
import { ChatMessageBubble, TypingMessage } from './chat-message'
import { ChatInput } from './chat-input'

// ── Suggested Actions ──────────────────────────────────────────────────────────

const SUGGESTED_ACTIONS = [
  { label: 'Review lease renewals', icon: FileText, color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Analyze rent collection', icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Check property occupancy', icon: Building2, color: 'text-teal-600 dark:text-teal-400' },
  { label: 'Review maintenance queue', icon: Wrench, color: 'text-orange-600 dark:text-orange-400' },
  { label: 'Tenant satisfaction report', icon: Users, color: 'text-violet-600 dark:text-violet-400' },
  { label: 'Revenue forecast', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
]

const RECENT_INSIGHTS = [
  'Occupancy rate improved to 89% this month',
  '3 leases expiring in the next 30 days',
  'Skyline Tower revenue up 12% QoQ',
  'Maintenance tickets down 8% this week',
  'Average rent collection at 89% on-time',
]

const QUICK_REPORTS = [
  { label: 'Monthly Revenue Report', icon: BarChart3 },
  { label: 'Occupancy Summary', icon: Building2 },
  { label: 'Maintenance Log', icon: Wrench },
  { label: 'Tenant Directory', icon: Users },
]

// ── Welcome Screen ─────────────────────────────────────────────────────────────

function WelcomeScreen({ onSend }: { onSend: (msg: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20"
      >
        <Sparkles className="size-8 text-white" />
      </motion.div>
      <h2 className="text-xl font-bold text-foreground">AI Copilot</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Ask me anything about your properties, tenants, leases, or maintenance.
        I can analyze data, generate reports, and provide recommendations.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {[
          'What is the current occupancy rate?',
          'Show me overdue payments',
          'Which properties need attention?',
          'Summarize this month\'s activity',
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSend(prompt)}
            className="rounded-xl border border-border/60 bg-background px-4 py-3 text-left text-xs font-medium text-muted-foreground shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main AI Copilot Page ──────────────────────────────────────────────────────

export function AiCopilotPage() {
  const { messages, isLoading, sendMessage, clearChat } = useChatStore()
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-8rem)] gap-6"
    >
      {/* ── Chat Section (2/3) ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col lg:max-w-[66.67%]">
        {/* Chat Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/15">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                AI Copilot
              </h1>
              <p className="text-xs text-muted-foreground">
                Your property management assistant
              </p>
            </div>
            <Badge variant="secondary" className="ml-2 gap-1 text-xs">
              <Zap className="size-3" />
              Powered by AI
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="text-muted-foreground hover:text-foreground"
            title="Clear chat"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 border-border/50 shadow-sm overflow-hidden">
          <CardContent className="flex h-full flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <WelcomeScreen onSend={sendMessage} />
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                      <ChatMessageBubble key={msg.id} message={msg} />
                    ))}
                  </AnimatePresence>
                  {isLoading && <TypingMessage />}
                </div>
              )}
            </ScrollArea>

            {/* Input bar */}
            <div className="border-t border-border/50 bg-background p-4">
              <ChatInput onSend={sendMessage} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Suggestions Panel (1/3) ──────────────────────────────────────── */}
      <div className="hidden w-[320px] shrink-0 space-y-4 lg:block">
        {/* Suggested Actions */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="size-4 text-amber-500" />
              Suggested Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {SUGGESTED_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Icon className={`size-4 shrink-0 ${action.color}`} />
                  {action.label}
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Insights */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="size-4 text-teal-500" />
              Recent Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {RECENT_INSIGHTS.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4 text-emerald-500" />
              Quick Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_REPORTS.map((report) => {
              const Icon = report.icon
              return (
                <Button
                  key={report.label}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs"
                  onClick={() => sendMessage(`Generate ${report.label}`)}
                >
                  <Icon className="size-3.5 text-muted-foreground" />
                  {report.label}
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
