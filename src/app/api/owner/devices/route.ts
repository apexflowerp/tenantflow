import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/owner/devices - List all devices with client info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    // Find workspaces that belong to the client
    const whereClause: any = {}
    if (clientId) {
      whereClause.workspace = { clientId }
    }

    const devices = await db.device.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            clientId: true,
            client: { select: { id: true, companyName: true, plan: true } },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        licenseKeys: {
          select: { id: true, key: true, status: true, plan: true },
        },
      },
    })

    return NextResponse.json({ devices })
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 })
  }
}
