import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get the first active client (owner's primary client)
    // In a full implementation, this would be based on the authenticated user's clientId
    const client = await db.client.findFirst({
      where: { status: 'active' },
      select: {
        id: true,
        companyName: true,
        plan: true,
        status: true,
        billingCycle: true,
        monthlyFee: true,
        currency: true,
        maxProperties: true,
        maxUsers: true,
        maxDevices: true,
        contractEnd: true,
      },
    })

    if (!client) {
      return NextResponse.json({ client: null })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Failed to fetch client info:', error)
    return NextResponse.json({ client: null }, { status: 500 })
  }
}
