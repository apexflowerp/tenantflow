'use client'

import { motion } from 'framer-motion'
import { Bot, User, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/stores'

interface ChatMessageProps {
  message: ChatMessage
  isLatest?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-emerald-500"
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessageBubble({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-emerald-600 text-white'
            : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
        }`}
      >
        {isUser ? <User className="size-4" /> : <Sparkles className="size-3.5" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-emerald-600 text-white rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          {message.content}
        </div>
        <p
          className={`text-[10px] text-muted-foreground ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}

export function TypingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
        <Bot className="size-4" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
        <TypingIndicator />
      </div>
    </motion.div>
  )
}
