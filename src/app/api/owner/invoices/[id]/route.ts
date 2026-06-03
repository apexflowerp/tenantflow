import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/owner/invoices/[id] - Update invoice
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Recalculate amounts if items or rates are being updated
    const existing = await db.invoice.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    let subtotal = body.subtotal !== undefined ? body.subtotal : existing.subtotal
    const taxRate = body.taxRate !== undefined ? body.taxRate : existing.taxRate
    const discount = body.discount !== undefined ? body.discount : existing.discount

    if (body.items) {
      const items = typeof body.items === 'string' ? JSON.parse(body.items) : body.items
      subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
    }

    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount - discount

    // Build update data
    const updateData: any = {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.issueDate !== undefined && { issueDate: new Date(body.issueDate) }),
      ...(body.dueDate !== undefined && { dueDate: new Date(body.dueDate) }),
      ...(body.paidDate !== undefined && { paidDate: new Date(body.paidDate) }),
      ...(body.paidAmount !== undefined && { paidAmount: body.paidAmount }),
      ...(body.currency !== undefined && { currency: body.currency }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.terms !== undefined && { terms: body.terms }),
      ...(body.items !== undefined && {
        items: typeof body.items === 'string' ? body.items : JSON.stringify(body.items),
      }),
    }

    // Only recalculate financials if relevant fields changed
    if (body.items !== undefined || body.subtotal !== undefined || body.taxRate !== undefined || body.discount !== undefined) {
      updateData.subtotal = subtotal
      updateData.taxRate = taxRate
      updateData.taxAmount = taxAmount
      updateData.discount = discount
      updateData.total = total
    }

    // Set paidDate automatically when status changes to "paid"
    if (body.status === 'paid' && !existing.paidDate) {
      updateData.paidDate = new Date()
      updateData.paidAmount = total
    }

    const invoice = await db.invoice.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { id: true, companyName: true, plan: true, status: true } },
      },
    })

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error('Error updating invoice:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}

// DELETE /api/owner/invoices/[id] - Delete an invoice
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.invoice.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting invoice:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }
}
