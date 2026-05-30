import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const tickets = await db.maintenanceTicket.findMany({
      where: { workspaceId: workspace.id },
      include: {
        property: { select: { id: true, name: true, address: true, city: true } },
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Summary
    const summary = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in_progress').length,
      scheduled: tickets.filter((t) => t.status === 'scheduled').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      highPriority: tickets.filter((t) => t.priority === 'high' && t.status !== 'resolved').length,
      byCategory: {
        plumbing: tickets.filter((t) => t.category === 'plumbing').length,
        electrical: tickets.filter((t) => t.category === 'electrical').length,
        hvac: tickets.filter((t) => t.category === 'hvac').length,
        structural: tickets.filter((t) => t.category === 'structural').length,
        general: tickets.filter((t) => t.category === 'general').length,
      },
    }

    return NextResponse.json({ tickets, summary })
  } catch (error) {
    console.error('Maintenance API error:', error)
    return NextResponse.json({ error: 'Failed to fetch maintenance tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const workspace = await db.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, category, priority, propertyId, tenantId, assignedTo, dueDate } = body

    if (!title || !propertyId) {
      return NextResponse.json({ error: 'Title and property are required' }, { status: 400 })
    }

    const ticket = await db.maintenanceTicket.create({
      data: {
        title,
        description: description || null,
        category: category || 'general',
        priority: priority || 'medium',
        propertyId,
        tenantId: tenantId || null,
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error) {
    console.error('Ticket creation error:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, priority, assignedTo, dueDate, completedAt } = body

    if (!id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (completedAt !== undefined) updateData.completedAt = completedAt ? new Date(completedAt) : null

    const ticket = await db.maintenanceTicket.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Ticket update error:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
