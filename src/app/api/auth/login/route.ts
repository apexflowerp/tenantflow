import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

function generateToken(): string {
  return 'tf-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // ── Owner Auto-Provisioning ──────────────────────────────────────────────
    // If logging in as admin@apexflow.cloud with correct password, ensure user exists
    const isOwnerEmail = normalizedEmail === 'admin@apexflow.cloud'
    const isOwnerPassword = password === 'Admin@180H'

    if (isOwnerEmail && isOwnerPassword) {
      let user = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
      })

      if (!user) {
        // Auto-provision the owner user — find or create workspace
        let workspace = await db.workspace.findFirst({ where: { slug: 'tenantflow-hq' } })

        if (!workspace) {
          let client = await db.client.findFirst({ where: { companyName: 'TenantFlow HQ Corp' } })
          if (!client) {
            client = await db.client.create({
              data: {
                companyName: 'TenantFlow HQ Corp',
                contactName: 'Sarah Chen',
                email: 'admin@apexflow.cloud',
                phone: '(212) 555-0100',
                address: '450 Park Avenue',
                city: 'New York',
                state: 'NY',
                zipCode: '10022',
                country: 'US',
                industry: 'Rental Management',
                companySize: '11-50',
                status: 'active',
                plan: 'enterprise',
                billingCycle: 'monthly',
                monthlyFee: 99,
                maxProperties: 999,
                maxUsers: 999,
                maxDevices: 999,
                databaseUrl: process.env.DATABASE_URL,
                databaseName: 'neondb',
                dbStatus: 'active',
              },
            })
          }

          workspace = await db.workspace.create({
            data: {
              name: 'TenantFlow HQ',
              slug: 'tenantflow-hq',
              industry: 'Rental Management',
              currency: 'USD',
              timezone: 'America/New_York',
              plan: 'enterprise',
              clientId: client.id,
            },
          })
        }

        user = await db.user.create({
          data: {
            email: normalizedEmail,
            name: 'Sarah Chen',
            role: 'admin',
            department: 'Operations',
            phone: '(212) 555-0101',
            isActive: true,
            lastLogin: new Date(),
            workspaceId: workspace.id,
          },
          include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
        })
      } else if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated. Please contact your administrator.' },
          { status: 403 }
        )
      } else {
        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })
      }

      // Generate session token
      const token = generateToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const session = await db.session.create({
        data: {
          userId: user.id,
          token,
          isActive: true,
          expiresAt,
        },
      })

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
          clientId: user.workspace.clientId,
          workspace: {
            id: user.workspace.id,
            name: user.workspace.name,
            slug: user.workspace.slug,
            plan: user.workspace.plan,
            clientId: user.workspace.clientId,
          },
        },
        token: session.token,
        expiresAt: session.expiresAt,
      })
    }

    // ── Normal Login Flow ────────────────────────────────────────────────────
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: { workspace: { select: { id: true, name: true, slug: true, plan: true, clientId: true } } },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact your administrator.' },
        { status: 403 }
      )
    }

    // Password validation
    const isDemoUser = normalizedEmail === 'demo@tenantflow.io'
    const isPasswordValid = isDemoUser
      ? true
      : user.passwordHash === null || user.passwordHash === password

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate session token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 day expiry

    // Create session
    const session = await db.session.create({
      data: {
        userId: user.id,
        token,
        isActive: true,
        expiresAt,
      },
    })

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
        clientId: user.workspace.clientId,
        workspace: {
          id: user.workspace.id,
          name: user.workspace.name,
          slug: user.workspace.slug,
          plan: user.workspace.plan,
          clientId: user.workspace.clientId,
        },
      },
      token: session.token,
      expiresAt: session.expiresAt,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
