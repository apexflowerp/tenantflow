import { create } from 'zustand'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatStore {
  // Data
  messages: ChatMessage[]

  // State
  isLoading: boolean
  isOpen: boolean
  error: string | null

  // Actions
  sendMessage: (content: string) => Promise<void>
  toggleChat: () => void
  setOpen: (open: boolean) => void
  clearChat: () => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () =>
  Math.random().toString(36).substring(2, 11) + Date.now().toString(36)

// ── Store ────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  isOpen: false,
  error: null,

  sendMessage: async (content: string) => {
    if (!content.trim() || get().isLoading) return

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          history: get().messages.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.response ?? data.message ?? data.content ?? data.reply ?? 'I apologize, but I was unable to process your request.',
        timestamp: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      })

      // Add error message as assistant response so the user sees it inline
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, errorMessage],
      }))
    }
  },

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),

  clearChat: () => set({ messages: [], error: null }),
}))
