import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `You are an AI assistant for TenantFlow OS, a rental management platform. Help users with property management questions, analytics, tenant communications, and operational tasks. Be concise and professional. You have expertise in:
- Property management best practices
- Lease management and compliance
- Tenant relations and communication
- Financial reporting and rent collection
- Maintenance operations and workflows
- Market analysis and occupancy optimization
Provide actionable, specific advice when possible.`

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history if provided
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content })
        }
      }
    }

    messages.push({ role: 'user', content: message })

    const client = await ZAI.create()
    const response = await client.chat.completions.create({
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    })

    const aiMessage = response.choices?.[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.'

    return NextResponse.json({ response: aiMessage })
  } catch (error) {
    console.error('AI Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response', details: String(error) },
      { status: 500 }
    )
  }
}
