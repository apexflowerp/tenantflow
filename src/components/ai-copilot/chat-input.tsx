'use client'

import * as React from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  promptChips?: string[]
}

const DEFAULT_CHIPS = [
  'Show revenue summary',
  'Analyze occupancy',
  'Generate lease report',
  'Predict maintenance needs',
]

export function ChatInput({
  onSend,
  isLoading = false,
  promptChips = DEFAULT_CHIPS,
}: ChatInputProps) {
  const [value, setValue] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleChipClick = (chip: string) => {
    if (!isLoading) {
      onSend(chip)
    }
  }

  return (
    <div className="space-y-3">
      {/* Prompt chips */}
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="size-3" />
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask your AI copilot..."
          disabled={isLoading}
          className="flex-1 rounded-xl border-border/60 bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-emerald-500/30"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!value.trim() || isLoading}
          className="size-10 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
