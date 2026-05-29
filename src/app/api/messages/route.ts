import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const direction = searchParams.get('direction')

    const where: Record<string, unknown> = { workspaceId: workspace.id }
    if (type) where.type = type
    if (direction) where.direction = direction

    const messages = await db.message.findMany({
      where,
      include: {
        tenant: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const stats = {
      total: messages.length,
      unread: messages.filter((m) => m.status === 'sent' && m.direction === 'inbound').length,
      email: messages.filter((m) => m.type === 'email').length,
      sms: messages.filter((m) => m.type === 'sms').length,
      announcement: messages.filter((m) => m.type === 'announcement').length,
    }

    return NextResponse.json({ messages, stats })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const body = await request.json()
    const { subject, content, type, direction, tenantId } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const message = await db.message.create({
      data: {
        subject: subject || null,
        content,
        type: type || 'email',
        direction: direction || 'outbound',
        status: 'sent',
        tenantId: tenantId || null,
        workspaceId: workspace.id,
      },
      include: {
        tenant: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Create message API error:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}
