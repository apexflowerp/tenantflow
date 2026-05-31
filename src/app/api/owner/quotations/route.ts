import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/owner/quotations - List all quotations with full client info
export async function GET() {
  try {
    const quotations = await db.quotation.findMany({
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

    return NextResponse.json({ quotations })
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 })
  }
}

// POST /api/owner/quotations - Create a new quotation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.clientId || !body.subject || !body.validUntil) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, subject, validUntil' },
        { status: 400 }
      )
    }

    // Generate quotation number: QUO-YYYYMMDD-XXXX
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const rand = Math.floor(1000 + Math.random() * 9000)
    const quotationNumber = `QUO-${dateStr}-${rand}`

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

    const quotation = await db.quotation.create({
      data: {
        quotationNumber,
        clientId: body.clientId,
        status: body.status || 'draft',
        subject: body.subject,
        validUntil: new Date(body.validUntil),
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
        currency: body.currency || 'USD',
        items: body.items
          ? typeof body.items === 'string'
            ? body.items
            : JSON.stringify(body.items)
          : null,
        notes: body.notes || null,
        terms: body.terms || null,
        introMessage: body.introMessage || null,
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

    return NextResponse.json({ quotation }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating quotation:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Quotation number collision, please try again' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 })
  }
}
