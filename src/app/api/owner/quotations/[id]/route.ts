import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/owner/quotations/[id] - Update quotation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Fetch existing quotation to check conversion state
    const existing = await db.quotation.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
    }

    // Recalculate amounts if items or rates are being updated
    let subtotal = body.subtotal !== undefined ? body.subtotal : existing.subtotal
    const taxRate = body.taxRate !== undefined ? body.taxRate : existing.taxRate
    const discount = body.discount !== undefined ? body.discount : existing.discount

    if (body.items) {
      const items = typeof body.items === 'string' ? JSON.parse(body.items) : body.items
      subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
    }

    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount - discount

    const quotation = await db.quotation.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.validUntil !== undefined && { validUntil: new Date(body.validUntil) }),
        ...(body.items !== undefined && {
          items: typeof body.items === 'string' ? body.items : JSON.stringify(body.items),
        }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.terms !== undefined && { terms: body.terms }),
        ...(body.introMessage !== undefined && { introMessage: body.introMessage }),
        ...(body.currency !== undefined && { currency: body.currency }),
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
      },
      include: {
        client: { select: { id: true, companyName: true, plan: true, status: true } },
      },
    })

    // If status changed to "accepted" and not already converted, optionally create an invoice
    let createdInvoice: Record<string, any> | null = null
    if (
      body.status === 'accepted' &&
      !existing.convertedToInvoice &&
      body.createInvoice !== false
    ) {
      // Generate invoice number: INV-YYYYMMDD-XXXX
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
      const rand = Math.floor(1000 + Math.random() * 9000)
      const invoiceNumber = `INV-${dateStr}-${rand}`

      createdInvoice = await db.invoice.create({
        data: {
          invoiceNumber,
          clientId: existing.clientId,
          type: 'subscription',
          status: 'draft',
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 86400000),
          subtotal: existing.subtotal,
          taxRate: existing.taxRate,
          taxAmount: existing.taxAmount,
          discount: existing.discount,
          total: existing.total,
          paidAmount: 0,
          currency: existing.currency,
          notes: existing.notes,
          terms: existing.terms,
          items: existing.items,
        },
        include: {
          client: { select: { id: true, companyName: true, plan: true, status: true } },
        },
      })

      // Mark quotation as converted
      await db.quotation.update({
        where: { id },
        data: {
          convertedToInvoice: true,
          convertedInvoiceId: createdInvoice.id,
        },
      })
    }

    const response: Record<string, any> = { quotation }
    if (createdInvoice) {
      response.invoice = createdInvoice
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error updating quotation:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update quotation' }, { status: 500 })
  }
}

// DELETE /api/owner/quotations/[id] - Delete a quotation
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.quotation.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting quotation:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete quotation' }, { status: 500 })
  }
}
