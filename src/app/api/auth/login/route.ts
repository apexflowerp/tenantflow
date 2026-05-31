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

    // Find user by email, include workspace with clientId
    const user = await db.user.findUnique({
      where: { email },
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

    // Password validation:
    // - Admin user (admin@tenantflow.io) requires password 'Admin@180H'
    // - Demo user (demo@tenantflow.io) any password works
    // - Other users with null passwordHash accept any password
    // - Users with passwordHash must match exactly
    const isAdminUser = email === 'admin@tenantflow.io'
    const isDemoUser = email === 'demo@tenantflow.io'
    const isPasswordValid = isAdminUser
      ? password === 'Admin@180H'
      : isDemoUser
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
