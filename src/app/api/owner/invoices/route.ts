import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/owner/invoices - List all invoices with full client info
export async function GET() {
  try {
    const invoices = await db.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            plan: true,
            status: true,
            taxId: true,
          },
        },
      },
    })

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

// POST /api/owner/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate invoice number: INV-YYYYMMDD-XXXX
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const rand = Math.floor(1000 + Math.random() * 9000)
    const invoiceNumber = `INV-${dateStr}-${rand}`

    // Calculate amounts from items if provided
    let subtotal = body.subtotal || 0
    const taxRate = body.taxRate || 0
    const discount = body.discount || 0

    if (body.items) {
      const items = typeof body.items === 'string' ? JSON.parse(body.items) : body.items
      subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
    }

    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount - discount

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        clientId: body.clientId,
        workspaceId: body.workspaceId || null,
        type: body.type || 'subscription',
        status: body.status || 'draft',
        issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 30 * 86400000),
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
        paidAmount: 0,
        currency: body.currency || 'USD',
        notes: body.notes || null,
        terms: body.terms || null,
        items: body.items ? (typeof body.items === 'string' ? body.items : JSON.stringify(body.items)) : null,
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            plan: true,
            status: true,
            taxId: true,
          },
        },
      },
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating invoice:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Invoice number collision, please try again' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
