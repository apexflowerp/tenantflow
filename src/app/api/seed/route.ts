import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if force reseed is requested
    const forceReseed = new URL(request.url).searchParams.get('force') === 'true'
    
    // Check if data already exists
    const existingWorkspace = await db.workspace.findFirst()
    const existingUsers = await db.user.count()
    const existingAuditLogs = await db.auditLog.count()
    if (existingWorkspace && existingUsers > 0 && existingAuditLogs > 0 && !forceReseed) {
      return NextResponse.json({ message: 'Database already seeded. Skipping.', workspace: existingWorkspace.name })
    }

    // If force reseed, clear all data first using Prisma deleteMany (PostgreSQL compatible)
    if (forceReseed && existingWorkspace) {
      // Delete in correct order respecting foreign key constraints
      await db.auditLog.deleteMany()
      await db.licenseKey.deleteMany()
      await db.invoice.deleteMany()
      await db.session.deleteMany()
      await db.document.deleteMany()
      await db.message.deleteMany()
      await db.activity.deleteMany()
      await db.maintenanceTicket.deleteMany()
      await db.payment.deleteMany()
      await db.lease.deleteMany()
      await db.tenant.deleteMany()
      await db.unit.deleteMany()
      await db.device.deleteMany()
      await db.vendor.deleteMany()
      await db.inspection.deleteMany()
      await db.transaction.deleteMany()
      await db.account.deleteMany()
      await db.insurancePolicy.deleteMany()
      await db.calendarEvent.deleteMany()
      await db.listing.deleteMany()
      await db.application.deleteMany()
      await db.property.deleteMany()
      await db.user.deleteMany()
      // Workspace references Client, so delete Workspace before Client
      await db.workspace.deleteMany()
      await db.client.deleteMany()
    }

    const now = new Date()
    const monthsAgo = (months: number) => {
      const d = new Date(now)
      d.setMonth(d.getMonth() - months)
      return d
    }
    const daysAgo = (days: number) => {
      const d = new Date(now)
      d.setDate(d.getDate() - days)
      return d
    }
    const daysFromNow = (days: number) => {
      const d = new Date(now)
      d.setDate(d.getDate() + days)
      return d
    }

    // If workspace and users exist but audit logs don't, just add audit logs
    if (existingWorkspace && existingUsers > 0 && existingAuditLogs === 0) {
      const wsId = existingWorkspace.id
      const users = await db.user.findMany({ where: { workspaceId: wsId } })
      const admin = users.find(u => u.role === 'admin') || users[0]
      const user3 = users.find(u => u.department === 'Maintenance') || users[2]
      const properties = await db.property.findMany({ where: { workspaceId: wsId } })
      const tenants = await db.tenant.findMany({ where: { workspaceId: wsId } })
      const leases = await db.lease.findMany({ where: { workspaceId: wsId } })
      const clients = await db.client.findMany()
      const skyline = properties.find(p => p.name === 'Skyline Tower')
      const greenfield = properties.find(p => p.name === 'Greenfield Gardens')
      const metro = properties.find(p => p.name === 'Metro Commercial Hub')
      const pacific = properties.find(p => p.name === 'Pacific Heights')
      const t1 = tenants.find(t => t.name === 'James Mitchell')
      const t13 = tenants.find(t => t.name === 'Ava Patel')
      const l1 = leases.find(l => l.status === 'expired')
      const l2 = leases.find(l => l.propertyId === skyline?.id && l.status === 'active')
      const defaultClient = clients.find(c => c.companyName === 'TenantFlow HQ Corp')
      const client1 = clients.find(c => c.companyName === 'Meridian Properties LLC')
      const client3 = clients.find(c => c.companyName === 'Pacific Coast Management')
      const client4 = clients.find(c => c.status === 'suspended')

      const auditNow = new Date()
      const auditDaysAgo = (days: number) => { const d = new Date(auditNow); d.setDate(d.getDate() - days); return d }

      const auditLogData = [
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: defaultClient?.id || null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Admin login from office network', severity: 'info', createdAt: auditDaysAgo(0) },
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: defaultClient?.id || null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Admin login successful', severity: 'info', createdAt: auditDaysAgo(0) },
        { action: 'property.created', entity: 'property', entityId: skyline?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: JSON.stringify({ name: 'Skyline Tower', type: 'residential', units: 6 }), severity: 'info', createdAt: auditDaysAgo(1) },
        { action: 'tenant.updated', entity: 'tenant', entityId: t1?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Updated emergency contact information for James Mitchell', severity: 'info', createdAt: auditDaysAgo(1) },
        { action: 'payment.received', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ amount: 4500, tenant: 'Isabella Torres', method: 'bank_transfer' }), severity: 'info', createdAt: auditDaysAgo(1) },
        { action: 'ticket.created', entity: 'ticket', entityId: null, userId: user3?.id || null, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', details: 'New maintenance ticket: Leaking kitchen faucet at Skyline Tower', severity: 'info', createdAt: auditDaysAgo(2) },
        { action: 'client.onboarded', entity: 'client', entityId: client1?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: JSON.stringify({ company: 'Meridian Properties LLC', plan: 'enterprise' }), severity: 'info', createdAt: auditDaysAgo(2) },
        { action: 'device.activated', entity: 'device', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.15', userAgent: 'TenantFlow-Desktop/2.1.0', details: 'Device activated with serial key TFOW-2024-XKCD-7A3B', severity: 'info', createdAt: auditDaysAgo(2) },
        { action: 'invoice.sent', entity: 'invoice', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ invoiceNumber: 'INV-2024-001', client: 'Skyline Real Estate Group', amount: 1047 }), severity: 'info', createdAt: auditDaysAgo(3) },
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '203.0.113.42', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: 'Login from new IP address - flagged for review', severity: 'warning', createdAt: auditDaysAgo(3) },
        { action: 'lease.created', entity: 'lease', entityId: l2?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'James Mitchell', property: 'Skyline Tower', unit: '12A', rent: 3300 }), severity: 'info', createdAt: auditDaysAgo(3) },
        { action: 'payment.overdue', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Ethan Williams', amount: 2400, daysOverdue: 30 }), severity: 'warning', createdAt: auditDaysAgo(3) },
        { action: 'property.updated', entity: 'property', entityId: greenfield?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Updated property details for Greenfield Gardens - added pet policy', severity: 'info', createdAt: auditDaysAgo(4) },
        { action: 'ticket.resolved', entity: 'ticket', entityId: null, userId: user3?.id || null, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', details: 'Smoke detector issue resolved at Pacific Heights', severity: 'info', createdAt: auditDaysAgo(4) },
        { action: 'user.failed_login', entity: 'user', entityId: null, userId: null, workspaceId: wsId, clientId: null, ipAddress: '45.33.32.156', userAgent: 'python-requests/2.28.0', details: 'Failed login attempt for admin@apexflow.cloud - invalid password', severity: 'warning', createdAt: auditDaysAgo(5) },
        { action: 'payment.received', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ amount: 4200, tenant: 'TechVista Solutions', method: 'bank_transfer' }), severity: 'info', createdAt: auditDaysAgo(5) },
        { action: 'lease.renewed', entity: 'lease', entityId: l2?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'James Mitchell', newRent: 3300, renewedFor: 12 }), severity: 'info', createdAt: auditDaysAgo(6) },
        { action: 'client.suspended', entity: 'client', entityId: client4?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ company: 'Urban Living Solutions', reason: 'Payment default - 60 days overdue' }), severity: 'warning', createdAt: auditDaysAgo(7) },
        { action: 'ticket.escalated', entity: 'ticket', entityId: null, userId: user3?.id || null, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', details: 'Roof leak at Metro Commercial Hub escalated to high priority', severity: 'warning', createdAt: auditDaysAgo(7) },
        { action: 'tenant.created', entity: 'tenant', entityId: t13?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ name: 'Ava Patel', property: 'Pacific Heights', unit: '2A' }), severity: 'info', createdAt: auditDaysAgo(8) },
        { action: 'device.blocked', entity: 'device', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Device blocked due to suspicious activity - TFOW-2024-YMDE-9C5D', severity: 'error', createdAt: auditDaysAgo(9) },
        { action: 'payment.late_fee', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Greenleaf Café', lateFee: 150, daysLate: 30 }), severity: 'warning', createdAt: auditDaysAgo(9) },
        { action: 'invoice.overdue', entity: 'invoice', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ client: 'Urban Living Solutions', invoiceNumber: 'INV-2024-005', amount: 49, daysOverdue: 45 }), severity: 'warning', createdAt: auditDaysAgo(10) },
        { action: 'property.inspection', entity: 'property', entityId: metro?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: 'Quarterly inspection completed for Metro Commercial Hub', severity: 'info', createdAt: auditDaysAgo(10) },
        { action: 'lease.created', entity: 'lease', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Innovate Partners', property: 'Metro Commercial Hub', type: 'commercial' }), severity: 'info', createdAt: auditDaysAgo(12) },
        { action: 'data.export', entity: 'workspace', entityId: wsId, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Full data export initiated by admin - 2.4MB CSV', severity: 'warning', createdAt: auditDaysAgo(14) },
        { action: 'user.permission_change', entity: 'user', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Changed role for Rachel Patel from member to manager', severity: 'info', createdAt: auditDaysAgo(15) },
        { action: 'system.error', entity: 'workspace', entityId: wsId, userId: null, workspaceId: wsId, clientId: null, ipAddress: null, userAgent: 'TenantFlow-Server/2.1.0', details: JSON.stringify({ error: 'Database connection timeout', duration: '45s', retries: 3 }), severity: 'error', createdAt: auditDaysAgo(18) },
        { action: 'client.onboarded', entity: 'client', entityId: client3?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ company: 'Pacific Coast Management', plan: 'professional', trial: true }), severity: 'info', createdAt: auditDaysAgo(20) },
        { action: 'security.breach_attempt', entity: 'user', entityId: null, userId: null, workspaceId: wsId, clientId: null, ipAddress: '185.220.101.34', userAgent: 'curl/7.68.0', details: JSON.stringify({ type: 'SQL injection attempt', endpoint: '/api/auth/login', blocked: true }), severity: 'critical', createdAt: auditDaysAgo(22) },
        { action: 'system.critical', entity: 'workspace', entityId: wsId, userId: null, workspaceId: wsId, clientId: null, ipAddress: null, userAgent: 'TenantFlow-Server/2.1.0', details: JSON.stringify({ error: 'Payment gateway integration failure', provider: 'Stripe', duration: '2h 15m', affectedPayments: 3 }), severity: 'critical', createdAt: auditDaysAgo(25) },
        { action: 'lease.terminated', entity: 'lease', entityId: l1?.id || null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Former tenant', property: 'Skyline Tower', unit: '8A', reason: 'Non-renewal' }), severity: 'info', createdAt: auditDaysAgo(25) },
        { action: 'backup.completed', entity: 'workspace', entityId: wsId, userId: null, workspaceId: wsId, clientId: null, ipAddress: null, userAgent: 'TenantFlow-Cron/1.0', details: 'Automated daily backup completed - 45.2MB', severity: 'info', createdAt: auditDaysAgo(28) },
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '172.16.0.50', userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', details: 'Admin login from mobile device', severity: 'info', createdAt: auditDaysAgo(29) },
        { action: 'license.generated', entity: 'device', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ key: 'TFOL-PRO-2024-AAAA', plan: 'professional', maxDevices: 10 }), severity: 'info', createdAt: auditDaysAgo(30) },
      ]
      let auditLogCount = 0
      for (const al of auditLogData) {
        await db.auditLog.create({ data: al })
        auditLogCount++
      }
      return NextResponse.json({ message: 'Audit logs seeded successfully', auditLogs: auditLogCount })
    }

    
      // ── Default Client (multi-tenant owner) ──
      const defaultClient = await db.client.create({
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
          plan: 'professional',
          billingCycle: 'monthly',
          monthlyFee: 99,
          setupFee: 0,
          maxProperties: 50,
          maxUsers: 25,
          maxDevices: 10,
          databaseUrl: process.env.DATABASE_URL,
          databaseName: 'neondb',
          dbStatus: 'active',
        },
      })

      // ── Workspace ──
      const workspace = await db.workspace.create({
        data: {
          name: 'TenantFlow HQ',
          slug: 'tenantflow-hq',
          industry: 'Rental Management',
          currency: 'USD',
          timezone: 'America/New_York',
          plan: 'professional',
          clientId: defaultClient.id,
        },
      })
      const wsId = workspace.id

      // ── Users ──
      const admin = await db.user.create({
        data: { email: 'sarah.chen@tenantflow.io', name: 'Sarah Chen', role: 'admin', department: 'Operations', phone: '(212) 555-0101', lastLogin: daysAgo(0), workspaceId: wsId },
      })
      await db.user.create({ data: { email: 'marcus.johnson@tenantflow.io', name: 'Marcus Johnson', role: 'manager', department: 'Leasing', phone: '(212) 555-0102', lastLogin: daysAgo(1), workspaceId: wsId } })
      const user3 = await db.user.create({
        data: { email: 'emily.rodriguez@tenantflow.io', name: 'Emily Rodriguez', role: 'member', department: 'Maintenance', phone: '(212) 555-0103', lastLogin: daysAgo(2), workspaceId: wsId },
      })
      await db.user.create({ data: { email: 'david.kim@tenantflow.io', name: 'David Kim', role: 'member', department: 'Finance', phone: '(212) 555-0104', lastLogin: daysAgo(3), workspaceId: wsId } })
      await db.user.create({ data: { email: 'rachel.patel@tenantflow.io', name: 'Rachel Patel', role: 'member', department: 'Tenant Relations', phone: '(212) 555-0105', lastLogin: daysAgo(1), workspaceId: wsId } })

      // ── Properties ──
      const skyline = await db.property.create({
        data: { name: 'Skyline Tower', slug: 'skyline-tower', type: 'residential', address: '450 Park Avenue', city: 'New York', state: 'NY', zipCode: '10022', country: 'US', floors: 32, yearBuilt: 2018, totalArea: 85000, totalUnits: 6, occupiedUnits: 5, status: 'active', workspaceId: wsId },
      })
      const harbor = await db.property.create({
        data: { name: 'Harbor View Residences', slug: 'harbor-view-residences', type: 'residential', address: '789 Waterfront Dr', city: 'San Francisco', state: 'CA', zipCode: '94111', country: 'US', floors: 12, yearBuilt: 2020, totalArea: 52000, totalUnits: 4, occupiedUnits: 3, status: 'active', workspaceId: wsId },
      })
      const metro = await db.property.create({
        data: { name: 'Metro Commercial Hub', slug: 'metro-commercial-hub', type: 'commercial', address: '200 Peachtree St NE', city: 'Atlanta', state: 'GA', zipCode: '30303', country: 'US', floors: 8, yearBuilt: 2015, totalArea: 120000, totalUnits: 4, occupiedUnits: 3, status: 'active', workspaceId: wsId },
      })
      const greenfield = await db.property.create({
        data: { name: 'Greenfield Gardens', slug: 'greenfield-gardens', type: 'residential', address: '1550 Oak Valley Rd', city: 'Austin', state: 'TX', zipCode: '78701', country: 'US', floors: 3, yearBuilt: 2019, totalArea: 38000, totalUnits: 4, occupiedUnits: 4, status: 'active', workspaceId: wsId },
      })
      const pacific = await db.property.create({
        data: { name: 'Pacific Heights', slug: 'pacific-heights', type: 'residential', address: '2850 Broadway', city: 'San Francisco', state: 'CA', zipCode: '94115', country: 'US', floors: 6, yearBuilt: 2017, totalArea: 45000, totalUnits: 3, occupiedUnits: 2, status: 'active', workspaceId: wsId },
      })
      const downtown = await db.property.create({
        data: { name: 'Downtown Lofts', slug: 'downtown-lofts', type: 'mixed', address: '920 Washington Ave', city: 'St. Louis', state: 'MO', zipCode: '63101', country: 'US', floors: 5, yearBuilt: 2016, totalArea: 40000, totalUnits: 3, occupiedUnits: 3, status: 'active', workspaceId: wsId },
      })

      // ── Units (Unit model does NOT have workspaceId) ──
      const st1 = await db.unit.create({ data: { unitNumber: '12A', propertyId: skyline.id, floor: 12, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1200, rent: 3200, deposit: 3200, status: 'occupied', amenities: 'Gym,Pool,Concierge' } })
      const st2 = await db.unit.create({ data: { unitNumber: '15B', propertyId: skyline.id, floor: 15, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 850, rent: 2400, deposit: 2400, status: 'occupied', amenities: 'Gym,Pool' } })
      const st3 = await db.unit.create({ data: { unitNumber: '22C', propertyId: skyline.id, floor: 22, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2800, rent: 4500, deposit: 4500, status: 'occupied', amenities: 'Gym,Pool,Concierge,Rooftop' } })
      const st4 = await db.unit.create({ data: { unitNumber: '8A', propertyId: skyline.id, floor: 8, type: 'studio', bedrooms: 0, bathrooms: 1, area: 550, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Gym' } })
      const st5 = await db.unit.create({ data: { unitNumber: '18D', propertyId: skyline.id, floor: 18, type: 'apartment', bedrooms: 2, bathrooms: 1, area: 1050, rent: 2900, deposit: 2900, status: 'occupied', amenities: 'Gym,Pool' } })
      await db.unit.create({ data: { unitNumber: '5A', propertyId: skyline.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 500, rent: 1650, deposit: 1650, status: 'vacant', amenities: 'Gym' } })

      const hv1 = await db.unit.create({ data: { unitNumber: '3B', propertyId: harbor.id, floor: 3, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Bay View,Pool,Gym' } })
      await db.unit.create({ data: { unitNumber: '7A', propertyId: harbor.id, floor: 7, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 780, rent: 2800, deposit: 2800, status: 'occupied', amenities: 'Bay View,Gym' } })
      const hv3 = await db.unit.create({ data: { unitNumber: '10C', propertyId: harbor.id, floor: 10, type: 'penthouse', bedrooms: 3, bathrooms: 2, area: 2200, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Bay View,Pool,Rooftop' } })
      await db.unit.create({ data: { unitNumber: '5D', propertyId: harbor.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 600, rent: 2200, deposit: 2200, status: 'vacant', amenities: 'Gym' } })

      const mc1 = await db.unit.create({ data: { unitNumber: '101', propertyId: metro.id, floor: 1, type: 'office', bedrooms: 0, bathrooms: 2, area: 5000, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Parking,Conference Rooms' } })
      const mc2 = await db.unit.create({ data: { unitNumber: '201', propertyId: metro.id, floor: 2, type: 'retail', bedrooms: 0, bathrooms: 1, area: 3500, rent: 3500, deposit: 3500, status: 'occupied', amenities: 'Street Access,Storage' } })
      const mc3 = await db.unit.create({ data: { unitNumber: '301', propertyId: metro.id, floor: 3, type: 'office', bedrooms: 0, bathrooms: 2, area: 4000, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Parking,Kitchen' } })
      await db.unit.create({ data: { unitNumber: '401', propertyId: metro.id, floor: 4, type: 'office', bedrooms: 0, bathrooms: 1, area: 2500, rent: 2800, deposit: 2800, status: 'vacant', amenities: 'Parking' } })

      const gg1 = await db.unit.create({ data: { unitNumber: 'A1', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' } })
      await db.unit.create({ data: { unitNumber: 'A2', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 800, rent: 1400, deposit: 1400, status: 'occupied', amenities: 'Garden,Parking' } })
      await db.unit.create({ data: { unitNumber: 'B1', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 3, bathrooms: 2, area: 1400, rent: 2200, deposit: 2200, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' } })
      await db.unit.create({ data: { unitNumber: 'B2', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 750, rent: 1300, deposit: 1300, status: 'occupied', amenities: 'Garden' } })

      await db.unit.create({ data: { unitNumber: '2A', propertyId: pacific.id, floor: 2, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1300, rent: 3600, deposit: 3600, status: 'occupied', amenities: 'Gym,Parking,City View' } })
      await db.unit.create({ data: { unitNumber: '4B', propertyId: pacific.id, floor: 4, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 900, rent: 2600, deposit: 2600, status: 'occupied', amenities: 'Gym,City View' } })
      await db.unit.create({ data: { unitNumber: '6P', propertyId: pacific.id, floor: 6, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2400, rent: 4200, deposit: 4200, status: 'vacant', amenities: 'Gym,Rooftop,Panoramic View' } })

      await db.unit.create({ data: { unitNumber: 'L1', propertyId: downtown.id, floor: 1, type: 'loft', bedrooms: 1, bathrooms: 1, area: 1400, rent: 1500, deposit: 1500, status: 'occupied', amenities: 'Exposed Brick,High Ceilings' } })
      await db.unit.create({ data: { unitNumber: 'L2', propertyId: downtown.id, floor: 2, type: 'loft', bedrooms: 2, bathrooms: 1, area: 1600, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Exposed Brick,High Ceilings,Parking' } })
      await db.unit.create({ data: { unitNumber: 'L3', propertyId: downtown.id, floor: 3, type: 'retail', bedrooms: 0, bathrooms: 1, area: 2000, rent: 2000, deposit: 2000, status: 'occupied', amenities: 'Street Access,Storage' } })

      // ── Tenants ──
      const t1 = await db.tenant.create({ data: { name: 'James Mitchell', email: 'james.mitchell@email.com', phone: '(917) 555-1001', type: 'individual', moveInDate: monthsAgo(14), status: 'active', emergencyName: 'Lisa Mitchell', emergencyPhone: '(917) 555-1002', workspaceId: wsId } })
      const t2 = await db.tenant.create({ data: { name: 'Sophia Chang', email: 'sophia.chang@email.com', phone: '(415) 555-2001', type: 'individual', moveInDate: monthsAgo(10), status: 'active', emergencyName: 'David Chang', emergencyPhone: '(415) 555-2002', workspaceId: wsId } })
      const t3 = await db.tenant.create({ data: { name: 'TechVista Solutions Inc.', email: 'leasing@techvista.com', phone: '(404) 555-3001', type: 'corporate', company: 'TechVista Solutions Inc.', moveInDate: monthsAgo(18), status: 'active', workspaceId: wsId } })
      const t4 = await db.tenant.create({ data: { name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(512) 555-4001', type: 'individual', moveInDate: monthsAgo(8), status: 'active', emergencyName: 'Mark Bennett', emergencyPhone: '(512) 555-4002', workspaceId: wsId } })
      const t5 = await db.tenant.create({ data: { name: 'Nathan Brooks', email: 'nathan.brooks@email.com', phone: '(415) 555-5001', type: 'individual', moveInDate: monthsAgo(6), status: 'active', emergencyName: 'Amy Brooks', emergencyPhone: '(415) 555-5002', workspaceId: wsId } })
      const t6 = await db.tenant.create({ data: { name: 'Greenleaf Café LLC', email: 'info@greenleafcafe.com', phone: '(404) 555-6001', type: 'corporate', company: 'Greenleaf Café LLC', moveInDate: monthsAgo(12), status: 'active', workspaceId: wsId } })
      const t7 = await db.tenant.create({ data: { name: 'Isabella Torres', email: 'isabella.torres@email.com', phone: '(917) 555-7001', type: 'individual', moveInDate: monthsAgo(4), status: 'active', emergencyName: 'Carlos Torres', emergencyPhone: '(917) 555-7002', workspaceId: wsId } })
      const t8 = await db.tenant.create({ data: { name: 'Ethan Williams', email: 'ethan.williams@email.com', phone: '(212) 555-8001', type: 'individual', moveInDate: monthsAgo(9), status: 'active', emergencyName: 'Julie Williams', emergencyPhone: '(212) 555-8002', workspaceId: wsId } })
      const t9 = await db.tenant.create({ data: { name: 'Innovate Partners LLC', email: 'office@innovatepartners.com', phone: '(404) 555-9001', type: 'corporate', company: 'Innovate Partners LLC', moveInDate: monthsAgo(15), status: 'active', workspaceId: wsId } })
      const t10 = await db.tenant.create({ data: { name: 'Mia Hernandez', email: 'mia.hernandez@email.com', phone: '(512) 555-1001', type: 'individual', moveInDate: monthsAgo(7), status: 'active', emergencyName: 'Rosa Hernandez', emergencyPhone: '(512) 555-1002', workspaceId: wsId } })
      const t11 = await db.tenant.create({ data: { name: "Liam O'Connor", email: 'liam.oconnor@email.com', phone: '(314) 555-1001', type: 'individual', moveInDate: monthsAgo(5), status: 'active', emergencyName: "Siobhan O'Connor", emergencyPhone: '(314) 555-1002', workspaceId: wsId } })
      const t12 = await db.tenant.create({ data: { name: 'Urban Art Gallery', email: 'hello@urbanartgallery.com', phone: '(314) 555-2001', type: 'corporate', company: 'Urban Art Gallery', moveInDate: monthsAgo(11), status: 'active', workspaceId: wsId } })
      const t13 = await db.tenant.create({ data: { name: 'Ava Patel', email: 'ava.patel@email.com', phone: '(415) 555-8001', type: 'individual', moveInDate: monthsAgo(3), status: 'active', emergencyName: 'Raj Patel', emergencyPhone: '(415) 555-8002', workspaceId: wsId } })
      const t14 = await db.tenant.create({ data: { name: 'Daniel Foster', email: 'daniel.foster@email.com', phone: '(212) 555-3001', type: 'individual', moveInDate: monthsAgo(2), status: 'active', emergencyName: 'Karen Foster', emergencyPhone: '(212) 555-3002', workspaceId: wsId } })
      await db.tenant.create({ data: { name: 'Meridian Consulting Group', email: 'admin@meridiancg.com', phone: '(404) 555-4001', type: 'corporate', company: 'Meridian Consulting Group', moveInDate: monthsAgo(20), status: 'active', notes: 'Long-term commercial tenant, considering expansion', workspaceId: wsId } })

      // ── Leases ──
      const l1 = await db.lease.create({ data: { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(14), endDate: monthsAgo(2), monthlyRent: 3200, deposit: 3200, status: 'expired', type: 'residential', workspaceId: wsId } })
      const l2 = await db.lease.create({ data: { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(2), endDate: daysFromNow(304), monthlyRent: 3300, deposit: 3300, status: 'active', type: 'residential', renewalDate: daysFromNow(60), workspaceId: wsId } })
      const l3 = await db.lease.create({ data: { propertyId: skyline.id, unitId: st2.id, tenantId: t8.id, startDate: monthsAgo(9), endDate: daysFromNow(90), monthlyRent: 2400, deposit: 2400, status: 'active', type: 'residential', workspaceId: wsId } })
      const l4 = await db.lease.create({ data: { propertyId: skyline.id, unitId: st3.id, tenantId: t7.id, startDate: monthsAgo(4), endDate: daysFromNow(245), monthlyRent: 4500, deposit: 4500, status: 'active', type: 'residential', workspaceId: wsId } })
      const l5 = await db.lease.create({ data: { propertyId: skyline.id, unitId: st4.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId } })
      await db.lease.create({ data: { propertyId: skyline.id, unitId: st5.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 2900, deposit: 2900, status: 'expiring', type: 'residential', renewalDate: daysFromNow(30), workspaceId: wsId } })
      const l7 = await db.lease.create({ data: { propertyId: harbor.id, unitId: hv1.id, tenantId: t2.id, startDate: monthsAgo(10), endDate: daysFromNow(60), monthlyRent: 3800, deposit: 3800, status: 'expiring', type: 'residential', renewalDate: daysFromNow(15), workspaceId: wsId } })
      const l8 = await db.lease.create({ data: { propertyId: harbor.id, unitId: hv3.id, tenantId: t5.id, startDate: monthsAgo(6), endDate: daysFromNow(185), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'residential', workspaceId: wsId } })
      const l9 = await db.lease.create({ data: { propertyId: metro.id, unitId: mc1.id, tenantId: t3.id, startDate: monthsAgo(18), endDate: daysFromNow(180), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'commercial', workspaceId: wsId } })
      const l10 = await db.lease.create({ data: { propertyId: metro.id, unitId: mc2.id, tenantId: t6.id, startDate: monthsAgo(12), endDate: daysFromNow(240), monthlyRent: 3500, deposit: 3500, status: 'active', type: 'commercial', workspaceId: wsId } })
      await db.lease.create({ data: { propertyId: metro.id, unitId: mc3.id, tenantId: t9.id, startDate: monthsAgo(15), endDate: daysFromNow(150), monthlyRent: 3800, deposit: 3800, status: 'active', type: 'commercial', workspaceId: wsId } })
      const l12 = await db.lease.create({ data: { propertyId: greenfield.id, unitId: gg1.id, tenantId: t4.id, startDate: monthsAgo(8), endDate: daysFromNow(250), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId } })

      // ── Payments ──
      const paymentData: Array<{ leaseId: string; tenantId: string; amount: number; type: string; status: string; dueDate: Date; paidDate: Date | null; method: string | null; lateFee: number | null }> = []

      // Lease 2 - James Mitchell (current)
      for (let m = 5; m >= 0; m--) {
        paymentData.push({ leaseId: l2.id, tenantId: t1.id, amount: m === 0 ? 3300 : 3200, type: 'rent', status: m === 0 ? 'pending' : 'paid', dueDate: monthsAgo(m), paidDate: m > 0 ? monthsAgo(m) : null, method: m > 0 ? 'bank_transfer' : null, lateFee: null })
      }

      // Lease 3 - Ethan Williams - some late
      paymentData.push({ leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(5), paidDate: monthsAgo(5), method: 'credit_card', lateFee: null })
      paymentData.push({ leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(3), method: 'credit_card', lateFee: 50 })
      paymentData.push({ leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'credit_card', lateFee: null })
      paymentData.push({ leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'credit_card', lateFee: null })
      paymentData.push({ leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), paidDate: null, method: null, lateFee: 75 })
      paymentData.push({ leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'pending', dueDate: daysFromNow(15), paidDate: null, method: null, lateFee: null })

      // Lease 4 - Isabella Torres
      paymentData.push({ leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'pending', dueDate: daysFromNow(10), paidDate: null, method: null, lateFee: null })

      // Lease 7 - Sophia Chang - expiring
      paymentData.push({ leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(4), method: 'check', lateFee: null })
      paymentData.push({ leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'check', lateFee: null })
      paymentData.push({ leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'check', lateFee: null })
      paymentData.push({ leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), paidDate: null, method: null, lateFee: 100 })

      // Lease 9 - TechVista Solutions - commercial
      paymentData.push({ leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(5), paidDate: monthsAgo(5), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(4), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'pending', dueDate: daysFromNow(5), paidDate: null, method: null, lateFee: null })

      // Lease 10 - Greenleaf Café
      paymentData.push({ leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), paidDate: null, method: null, lateFee: 150 })
      paymentData.push({ leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'pending', dueDate: daysFromNow(12), paidDate: null, method: null, lateFee: null })

      // Lease 12 - Olivia Bennett
      paymentData.push({ leaseId: l12.id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'credit_card', lateFee: null })
      paymentData.push({ leaseId: l12.id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'credit_card', lateFee: null })
      paymentData.push({ leaseId: l12.id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'pending', dueDate: daysFromNow(8), paidDate: null, method: null, lateFee: null })

      // Deposit payments
      paymentData.push({ leaseId: l2.id, tenantId: t1.id, amount: 3300, type: 'deposit', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'deposit', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(4), method: 'bank_transfer', lateFee: null })
      paymentData.push({ leaseId: l5.id, tenantId: t14.id, amount: 1800, type: 'deposit', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null })

      let paymentCount = 0
      for (const p of paymentData) {
        await db.payment.create({ data: { ...p, workspaceId: wsId } })
        paymentCount++
      }

      // ── Maintenance Tickets ──
      const ticketData = [
        { title: 'Leaking kitchen faucet', description: 'The kitchen faucet has been dripping constantly for the past 2 days. Getting worse.', category: 'plumbing', priority: 'high', status: 'in_progress', propertyId: skyline.id, tenantId: t1.id, assignedTo: user3.id, dueDate: daysFromNow(2), workspaceId: wsId },
        { title: 'AC not cooling unit 15B', description: 'Air conditioning is running but not cooling the apartment. Temperature stays at 78°F.', category: 'hvac', priority: 'high', status: 'open', propertyId: skyline.id, tenantId: t8.id, dueDate: daysFromNow(1), workspaceId: wsId },
        { title: 'Broken window latch', description: "The bedroom window latch is broken and won't secure properly. Safety concern.", category: 'structural', priority: 'medium', status: 'open', propertyId: harbor.id, tenantId: t2.id, workspaceId: wsId },
        { title: 'Elevator maintenance required', description: 'Elevator making unusual noises during operation. Needs inspection.', category: 'general', priority: 'medium', status: 'scheduled', propertyId: skyline.id, tenantId: null, assignedTo: user3.id, dueDate: daysFromNow(7), workspaceId: wsId },
        { title: 'Electrical outlet not working', description: 'Two outlets in the living room have no power. Circuit breaker was checked and is fine.', category: 'electrical', priority: 'high', status: 'in_progress', propertyId: harbor.id, tenantId: t5.id, assignedTo: user3.id, workspaceId: wsId },
        { title: 'Common area light replacement', description: 'Hallway light on floor 3 is flickering and needs replacement.', category: 'electrical', priority: 'low', status: 'resolved', propertyId: skyline.id, tenantId: null, assignedTo: user3.id, completedAt: daysAgo(2), workspaceId: wsId },
        { title: 'Bathroom drain clogged', description: 'Master bathroom shower drain is completely clogged. Water backing up.', category: 'plumbing', priority: 'medium', status: 'resolved', propertyId: greenfield.id, tenantId: t4.id, assignedTo: user3.id, completedAt: daysAgo(5), workspaceId: wsId },
        { title: 'Roof leak in storage area', description: 'Water damage noticed in the storage area after recent rain. Ceiling tile stained.', category: 'structural', priority: 'high', status: 'open', propertyId: metro.id, tenantId: null, workspaceId: wsId },
        { title: 'Parking garage gate stuck', description: 'The parking garage entrance gate is stuck in the open position. Security concern.', category: 'general', priority: 'medium', status: 'in_progress', propertyId: metro.id, tenantId: null, assignedTo: user3.id, workspaceId: wsId },
        { title: 'Dishwasher not draining', description: 'Dishwasher cycle completes but water remains at the bottom.', category: 'plumbing', priority: 'low', status: 'open', propertyId: greenfield.id, tenantId: t10.id, workspaceId: wsId },
        { title: 'Smoke detector beeping', description: 'Smoke detector in hallway beeps intermittently even after battery replacement.', category: 'electrical', priority: 'high', status: 'resolved', propertyId: pacific.id, tenantId: t13.id, assignedTo: user3.id, completedAt: daysAgo(1), workspaceId: wsId },
        { title: 'Heating system inspection', description: 'Annual heating system inspection and maintenance due.', category: 'hvac', priority: 'medium', status: 'scheduled', propertyId: pacific.id, tenantId: null, assignedTo: user3.id, dueDate: daysFromNow(14), workspaceId: wsId },
        { title: 'Lobby carpet stain removal', description: 'Large stain in lobby area from spilled coffee. Needs professional cleaning.', category: 'general', priority: 'low', status: 'resolved', propertyId: downtown.id, tenantId: null, assignedTo: user3.id, completedAt: daysAgo(3), workspaceId: wsId },
        { title: 'Garbage disposal jammed', description: 'Kitchen garbage disposal is jammed and making humming noise but not working.', category: 'plumbing', priority: 'medium', status: 'open', propertyId: downtown.id, tenantId: t11.id, workspaceId: wsId },
        { title: 'Fire extinguisher replacement', description: 'Fire extinguishers on floors 1-3 are expired and need replacement.', category: 'general', priority: 'high', status: 'in_progress', propertyId: skyline.id, tenantId: null, assignedTo: user3.id, dueDate: daysFromNow(3), workspaceId: wsId },
      ]
      let ticketCount = 0
      for (const td of ticketData) {
        await db.maintenanceTicket.create({ data: td })
        ticketCount++
      }

      // ── Activities ──
      const activityData = [
        { type: 'lease', title: 'Lease signed', description: 'New lease signed by James Mitchell for Unit 12A at Skyline Tower', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(1) },
        { type: 'payment', title: 'Payment received', description: 'Rent payment of $4,500 received from Isabella Torres', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(1) },
        { type: 'ticket', title: 'Ticket created', description: 'New maintenance request: Leaking kitchen faucet at Skyline Tower', userId: user3.id, workspaceId: wsId, createdAt: daysAgo(2) },
        { type: 'tenant', title: 'New tenant onboarded', description: 'Daniel Foster has been onboarded as a new tenant', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(2) },
        { type: 'lease', title: 'Lease expiring soon', description: "Sophia Chang's lease at Harbor View expires in 60 days", userId: admin.id, workspaceId: wsId, createdAt: daysAgo(3) },
        { type: 'payment', title: 'Payment overdue', description: 'Ethan Williams rent payment is 30 days overdue', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(3) },
        { type: 'ticket', title: 'Ticket resolved', description: 'Smoke detector issue at Pacific Heights has been resolved', userId: user3.id, workspaceId: wsId, createdAt: daysAgo(4) },
        { type: 'property', title: 'Property inspection completed', description: 'Quarterly inspection completed for Metro Commercial Hub', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(5) },
        { type: 'payment', title: 'Payment received', description: 'Rent payment of $4,200 received from TechVista Solutions', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(5) },
        { type: 'lease', title: 'Lease renewed', description: 'James Mitchell renewed lease for Unit 12A at Skyline Tower', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(6) },
        { type: 'ticket', title: 'Ticket escalated', description: 'Roof leak at Metro Commercial Hub escalated to high priority', userId: user3.id, workspaceId: wsId, createdAt: daysAgo(7) },
        { type: 'tenant', title: 'Tenant move-in', description: 'Ava Patel moved into Pacific Heights, Unit 2A', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(8) },
        { type: 'payment', title: 'Late fee applied', description: 'Late fee of $150 applied to Greenleaf Café overdue payment', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(9) },
        { type: 'property', title: 'Property updated', description: 'Greenfield Gardens property details updated', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(10) },
        { type: 'lease', title: 'Lease signed', description: 'New commercial lease signed with Innovate Partners at Metro Commercial Hub', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(12) },
        { type: 'ticket', title: 'Ticket assigned', description: 'Electrical issue at Harbor View assigned to Emily Rodriguez', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(14) },
        { type: 'payment', title: 'Deposit collected', description: 'Security deposit of $4,500 collected from Isabella Torres', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(15) },
        { type: 'tenant', title: 'Tenant notes updated', description: 'Notes updated for Meridian Consulting Group - considering expansion', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(18) },
        { type: 'property', title: 'New property added', description: 'Downtown Lofts added to portfolio', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(20) },
        { type: 'lease', title: 'Lease terminated', description: 'Lease for Unit 8A at Skyline Tower - tenant moved out', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(25) },
      ]
      let activityCount = 0
      for (const ad of activityData) {
        await db.activity.create({ data: ad })
        activityCount++
      }

      // ── Messages ──
      const messageData = [
        { subject: 'Lease Renewal Discussion', content: "Hi Sophia, your lease at Harbor View Residences is expiring soon. Would you like to schedule a meeting to discuss renewal options?", type: 'email', direction: 'outbound', status: 'sent', tenantId: t2.id, workspaceId: wsId },
        { subject: 'Maintenance Update - Kitchen Faucet', content: "Hi James, we've scheduled a plumber to fix the kitchen faucet this Thursday between 9-11 AM. Please ensure someone is available to provide access.", type: 'email', direction: 'outbound', status: 'sent', tenantId: t1.id, workspaceId: wsId },
        { subject: 'Rent Payment Reminder', content: 'Dear Ethan, this is a friendly reminder that your rent payment of $2,400 is past due. Please submit payment as soon as possible to avoid additional late fees.', type: 'email', direction: 'outbound', status: 'sent', tenantId: t8.id, workspaceId: wsId },
        { subject: 'Re: AC Issue Unit 15B', content: "I wanted to let you know the AC is still not working. It's been 3 days now and it's getting uncomfortable. Can we get an update?", type: 'email', direction: 'inbound', status: 'read', tenantId: t8.id, workspaceId: wsId },
        { subject: 'Move-in Instructions', content: 'Hi Ava, welcome to Pacific Heights! Here are your move-in instructions and key pickup details for Unit 2A.', type: 'email', direction: 'outbound', status: 'sent', tenantId: t13.id, workspaceId: wsId },
        { subject: 'Community Event Invitation', content: 'Dear residents, you are invited to our annual community barbecue on March 15th at the pool area. Please RSVP by March 10th.', type: 'email', direction: 'outbound', status: 'sent', tenantId: null, workspaceId: wsId },
        { subject: 'Parking Garage Notice', content: 'Attention all tenants: The parking garage gate is currently under repair. Please use the temporary access cards available at the front desk.', type: 'sms', direction: 'outbound', status: 'delivered', tenantId: null, workspaceId: wsId },
        { subject: 'Fire Extinguisher Replacement', content: 'We will be replacing fire extinguishers on floors 1-3 this week. Please expect brief interruptions in hallway access during the replacement.', type: 'email', direction: 'outbound', status: 'sent', tenantId: null, workspaceId: wsId },
        { subject: 'Lease Inquiry', content: "Hello, I'm interested in the available studio at Skyline Tower. Could you provide more details about the unit and application process?", type: 'email', direction: 'inbound', status: 'read', tenantId: null, workspaceId: wsId },
        { subject: 'Quarterly Property Report', content: 'Please find attached the Q4 property performance report for all managed properties. Key highlights: 92% occupancy rate, $847K revenue collected.', type: 'email', direction: 'outbound', status: 'sent', tenantId: null, workspaceId: wsId },
      ]
      let messageCount = 0
      for (const md of messageData) {
        await db.message.create({ data: md })
        messageCount++
      }

      // ── Documents ──
      const documentData = [
        { name: 'Skyline Tower - Master Insurance Policy', type: 'insurance', category: 'property', size: 2450000, propertyId: skyline.id, workspaceId: wsId },
        { name: 'Lease Agreement - James Mitchell', type: 'lease', category: 'tenant', size: 520000, tenantId: t1.id, propertyId: skyline.id, workspaceId: wsId },
        { name: 'Metro Commercial Hub - Building Inspection Report', type: 'inspection', category: 'property', size: 3800000, propertyId: metro.id, workspaceId: wsId },
        { name: 'Tenant Application - Daniel Foster', type: 'application', category: 'tenant', size: 340000, tenantId: t14.id, workspaceId: wsId },
        { name: 'Harbor View Residences - Floor Plans', type: 'general', category: 'property', size: 8900000, propertyId: harbor.id, workspaceId: wsId },
      ]
      let documentCount = 0
      for (const dd of documentData) {
        await db.document.create({ data: dd })
        documentCount++
      }

      // ── SaaS Clients (Multi-Tenant Demo) ──
      const client1 = await db.client.create({
        data: {
          companyName: 'Meridian Properties LLC', contactName: 'Robert Hayes', email: 'robert.hayes@meridianprops.com',
          phone: '(305) 555-2001', address: '1200 Brickell Ave', city: 'Miami', state: 'FL', zipCode: '33131',
          country: 'US', website: 'https://meridianprops.com', industry: 'property-management', companySize: '51-200',
          taxId: 'EIN-84-2839102', status: 'active', plan: 'enterprise', billingCycle: 'annually',
          monthlyFee: 799, setupFee: 2500, discountPercent: 15,
          contractStart: monthsAgo(10), contractEnd: daysFromNow(245),
          maxProperties: 50, maxUsers: 100, maxDevices: 25,
          notes: 'Enterprise client, VIP support tier',
          primaryColor: '#059669', customDomain: 'app.meridianprops.com',
          features: JSON.stringify(['Analytics', 'API Access', 'Custom Branding', 'Priority Support', 'SSO']),
          databaseUrl: null,
          databaseName: 'tf_meridian',
          dbStatus: 'pending',
        },
      })
      const client2 = await db.client.create({
        data: {
          companyName: 'Skyline Real Estate Group', contactName: 'Amanda Foster', email: 'amanda.foster@skylinereg.com',
          phone: '(415) 555-3002', address: '500 Market St', city: 'San Francisco', state: 'CA', zipCode: '94105',
          country: 'US', website: 'https://skylinereg.com', industry: 'real-estate', companySize: '11-50',
          taxId: 'EIN-92-1847293', status: 'active', plan: 'business', billingCycle: 'quarterly',
          monthlyFee: 349, setupFee: 1000, discountPercent: 10,
          contractStart: monthsAgo(6), contractEnd: daysFromNow(180),
          maxProperties: 25, maxUsers: 50, maxDevices: 10,
          notes: 'Expanding to 3 new markets in Q3',
          primaryColor: '#d97706',
          features: JSON.stringify(['Analytics', 'Custom Branding', 'Multi-location']),
          databaseUrl: null,
          databaseName: 'tf_skyline',
          dbStatus: 'provisioning',
        },
      })
      const client3 = await db.client.create({
        data: {
          companyName: 'Pacific Coast Management', contactName: 'David Nakamura', email: 'david.n@pacificcoastmgmt.com',
          phone: '(206) 555-4003', address: '800 Pike St', city: 'Seattle', state: 'WA', zipCode: '98101',
          country: 'US', website: 'https://pacificcoastmgmt.com', industry: 'property-management', companySize: '11-50',
          status: 'trial', plan: 'professional', billingCycle: 'monthly',
          monthlyFee: 149, setupFee: 0, discountPercent: 0,
          trialStart: daysAgo(14), trialEnd: daysFromNow(16),
          maxProperties: 15, maxUsers: 25, maxDevices: 5,
          notes: 'Evaluating platform for full migration from AppFolio',
          features: JSON.stringify(['Analytics', 'Import Tool']),
          databaseUrl: null,
          databaseName: null,
          dbStatus: 'pending',
        },
      })
      const client4 = await db.client.create({
        data: {
          companyName: 'Urban Living Solutions', contactName: 'Jennifer Park', email: 'jpark@urbanlivingsol.com',
          phone: '(512) 555-5004', address: '200 Congress Ave', city: 'Austin', state: 'TX', zipCode: '78701',
          country: 'US', website: 'https://urbanlivingsol.com', industry: 'residential', companySize: '1-10',
          status: 'suspended', plan: 'starter', billingCycle: 'monthly',
          monthlyFee: 49, setupFee: 0, discountPercent: 0,
          contractStart: monthsAgo(4), contractEnd: monthsAgo(1),
          maxProperties: 5, maxUsers: 10, maxDevices: 3,
          notes: 'Payment failed 3 times, suspended until billing resolved',
          features: JSON.stringify(['Basic Analytics']),
          databaseUrl: null,
          databaseName: 'tf_urban_living',
          dbStatus: 'error',
        },
      })
      const client5 = await db.client.create({
        data: {
          companyName: 'Greenfield Holdings', contactName: 'Marcus Green', email: 'mgreen@greenfieldholdings.com',
          phone: '(303) 555-6005', address: '1400 Larimer St', city: 'Denver', state: 'CO', zipCode: '80202',
          country: 'US', website: 'https://greenfieldholdings.com', industry: 'commercial', companySize: '51-200',
          status: 'churned', plan: 'business', billingCycle: 'annually',
          monthlyFee: 349, setupFee: 1000, discountPercent: 5,
          contractStart: monthsAgo(14), contractEnd: monthsAgo(2),
          maxProperties: 30, maxUsers: 60, maxDevices: 15,
          notes: 'Churned - moved to Buildium. Possible win-back opportunity in Q4.',
          features: JSON.stringify(['Analytics', 'Custom Branding', 'API Access']),
          databaseUrl: null,
          databaseName: null,
          dbStatus: 'pending',
        },
      })

      // ── Devices ──
      const d1 = await db.device.create({
        data: { serialKey: 'TF-MBP2024-A3KF92', deviceName: "Jordan's MacBook Pro", deviceType: 'laptop', os: 'macOS Sonoma 14.3', browser: 'Chrome 121', ipAddress: '192.168.1.101', macAddress: 'A4:83:E7:2F:6B:01', status: 'active', activatedAt: daysAgo(45), lastSeenAt: daysAgo(0), userId: admin.id, workspaceId: wsId },
      })
      const d2 = await db.device.create({
        data: { serialKey: 'TF-PC2024-B7GH34', deviceName: 'Office Desktop PC', deviceType: 'desktop', os: 'Windows 11 Pro', browser: 'Firefox 122', ipAddress: '192.168.1.102', macAddress: 'B8:27:EB:3C:9D:44', status: 'active', activatedAt: daysAgo(90), lastSeenAt: daysAgo(1), userId: user3.id, workspaceId: wsId },
      })
      const d3 = await db.device.create({
        data: { serialKey: 'TF-TP2024-C5MN78', deviceName: "Sarah's ThinkPad", deviceType: 'laptop', os: 'Ubuntu 22.04 LTS', browser: 'Chrome 121', ipAddress: '192.168.1.103', macAddress: 'C0:3F:D5:7A:E2:88', status: 'active', activatedAt: daysAgo(30), lastSeenAt: daysAgo(2), workspaceId: wsId },
      })
      const d4 = await db.device.create({
        data: { serialKey: 'TF-IPAD2024-D2PQ56', deviceName: 'Reception iPad', deviceType: 'tablet', os: 'iPadOS 17.3', browser: 'Safari 17', ipAddress: '192.168.1.104', macAddress: 'D4:61:9E:1B:F5:CC', status: 'blocked', activatedAt: daysAgo(60), lastSeenAt: daysAgo(14), workspaceId: wsId },
      })
      const d5 = await db.device.create({
        data: { serialKey: 'TF-LT2024-E8RS90', deviceName: 'Field Laptop', deviceType: 'laptop', os: 'Windows 11 Pro', browser: 'Edge 121', ipAddress: '10.0.0.55', macAddress: 'E6:B4:C8:5D:3A:FF', status: 'pending', workspaceId: wsId },
      })

      // ── Demo activation devices (for login flow) ──
      await db.device.create({
        data: { serialKey: 'TFOW-2024-XKCD-7A3B', deviceName: 'Demo Desktop Alpha', deviceType: 'desktop', os: 'Windows 11', browser: 'Chrome', status: 'active', activatedAt: daysAgo(10), lastSeenAt: daysAgo(0), workspaceId: wsId },
      })
      await db.device.create({
        data: { serialKey: 'TFOW-2024-YMDE-9C5D', deviceName: 'Demo Laptop Beta', deviceType: 'laptop', os: 'macOS Ventura', browser: 'Safari', status: 'active', activatedAt: daysAgo(5), lastSeenAt: daysAgo(0), workspaceId: wsId },
      })
      await db.device.create({
        data: { serialKey: 'TFOW-2024-ZNRF-2E8F', deviceName: 'Demo Tablet Gamma', deviceType: 'tablet', os: 'iPadOS 17', browser: 'Safari', status: 'active', activatedAt: daysAgo(2), lastSeenAt: daysAgo(0), workspaceId: wsId },
      })

      // ── Sessions ──
      await db.session.create({ data: { userId: admin.id, deviceId: d1.id, token: 'ses_active_001', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', isActive: true, expiresAt: daysFromNow(1), createdAt: daysAgo(0) } })
      await db.session.create({ data: { userId: admin.id, deviceId: d1.id, token: 'ses_active_002', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', isActive: true, expiresAt: daysFromNow(2), createdAt: daysAgo(1) } })
      await db.session.create({ data: { userId: user3.id, deviceId: d2.id, token: 'ses_active_003', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/122.0', isActive: true, expiresAt: daysFromNow(1), createdAt: daysAgo(0) } })
      await db.session.create({ data: { userId: admin.id, deviceId: d3.id, token: 'ses_active_004', ipAddress: '192.168.1.103', userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Chrome/121.0', isActive: true, expiresAt: daysFromNow(3), createdAt: daysAgo(2) } })
      await db.session.create({ data: { userId: admin.id, deviceId: d4.id, token: 'ses_active_005', ipAddress: '192.168.1.104', userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_3) Safari/604.1', isActive: true, expiresAt: daysFromNow(1), createdAt: daysAgo(1) } })
      await db.session.create({ data: { userId: admin.id, deviceId: d1.id, token: 'ses_expired_001', ipAddress: '192.168.1.101', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', isActive: false, expiresAt: daysAgo(5), createdAt: daysAgo(7) } })
      await db.session.create({ data: { userId: user3.id, deviceId: d2.id, token: 'ses_expired_002', ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', isActive: false, expiresAt: daysAgo(3), createdAt: daysAgo(10) } })
      await db.session.create({ data: { userId: admin.id, deviceId: d3.id, token: 'ses_expired_003', ipAddress: '192.168.1.103', userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64)', isActive: false, expiresAt: daysAgo(1), createdAt: daysAgo(8) } })

      // ── License Keys ──
      // Client 1 - Meridian Properties (enterprise)
      await db.licenseKey.create({ data: { key: 'TF-ENT1-A3KF-B7GH-C5MN', type: 'enterprise', plan: 'enterprise', maxDevices: 25, maxUsers: 100, status: 'activated', activatedAt: daysAgo(45), expiresAt: daysFromNow(320), clientId: client1.id, deviceId: d1.id } })
      await db.licenseKey.create({ data: { key: 'TF-ENT1-D2PQ-E8RS-F1TU', type: 'enterprise', plan: 'enterprise', maxDevices: 25, maxUsers: 100, status: 'activated', activatedAt: daysAgo(90), expiresAt: daysFromNow(275), clientId: client1.id, deviceId: d2.id } })
      // Client 2 - Skyline Real Estate (business)
      await db.licenseKey.create({ data: { key: 'TF-BIZ2-G4VW-H6XY-J8ZA', type: 'professional', plan: 'business', maxDevices: 10, maxUsers: 50, status: 'activated', activatedAt: daysAgo(60), expiresAt: daysFromNow(305), clientId: client2.id } })
      await db.licenseKey.create({ data: { key: 'TF-BIZ2-K2BC-L4DE-M6FG', type: 'professional', plan: 'business', maxDevices: 10, maxUsers: 50, status: 'available', expiresAt: daysFromNow(365), clientId: client2.id } })
      // Client 3 - Pacific Coast (trial)
      await db.licenseKey.create({ data: { key: 'TF-TRL3-N8HI-P0JK-Q2LM', type: 'trial', plan: 'professional', maxDevices: 5, maxUsers: 25, status: 'activated', activatedAt: daysAgo(14), expiresAt: daysFromNow(16), clientId: client3.id } })
      // Client 4 - Urban Living (suspended - expired key)
      await db.licenseKey.create({ data: { key: 'TF-STD4-R4ST-T6UV-V8WX', type: 'standard', plan: 'starter', maxDevices: 3, maxUsers: 10, status: 'expired', activatedAt: daysAgo(120), expiresAt: daysAgo(30), clientId: client4.id } })
      // Client 5 - Greenfield (churned - revoked key)
      await db.licenseKey.create({ data: { key: 'TF-BIZ5-X0YZ-Z2AB-C4CD', type: 'professional', plan: 'business', maxDevices: 15, maxUsers: 60, status: 'revoked', activatedAt: daysAgo(200), expiresAt: daysAgo(60), clientId: client5.id } })
      await db.licenseKey.create({ data: { key: 'TF-BIZ5-E6FG-H8IJ-K0LM', type: 'professional', plan: 'business', maxDevices: 15, maxUsers: 60, status: 'revoked', activatedAt: daysAgo(150), expiresAt: daysAgo(45), clientId: client5.id } })

      // ── Demo activation license keys (for login flow) ──
      await db.licenseKey.create({ data: { key: 'TFOL-PRO-2024-AAAA', type: 'professional', plan: 'professional', maxDevices: 10, maxUsers: 25, status: 'available', expiresAt: daysFromNow(365), clientId: defaultClient.id } })
      await db.licenseKey.create({ data: { key: 'TFOL-ENT-2024-BBBB', type: 'enterprise', plan: 'enterprise', maxDevices: 50, maxUsers: 100, status: 'available', expiresAt: daysFromNow(365), clientId: defaultClient.id } })

      // ── SaaS Client Invoices (Owner Module) ──
      // Client 1 - Meridian Properties (active, enterprise)
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-001', clientId: client1.id, type: 'subscription', status: 'paid', issueDate: monthsAgo(10), dueDate: monthsAgo(9), paidDate: monthsAgo(9), subtotal: 9588, taxRate: 0, taxAmount: 0, discount: 1438, total: 8150, paidAmount: 8150, currency: 'USD', notes: 'Annual subscription - Enterprise plan', terms: 'Net 30', items: JSON.stringify([{ description: 'Enterprise Plan - Annual', quantity: 1, unitPrice: 9588, amount: 9588 }]), workspaceId: wsId } })
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-002', clientId: client1.id, type: 'addon', status: 'paid', issueDate: monthsAgo(3), dueDate: monthsAgo(2), paidDate: monthsAgo(2), subtotal: 500, taxRate: 0, taxAmount: 0, discount: 0, total: 500, paidAmount: 500, currency: 'USD', notes: 'Additional device license pack', terms: 'Net 30', items: JSON.stringify([{ description: 'Device License Pack (5)', quantity: 1, unitPrice: 500, amount: 500 }]), workspaceId: wsId } })
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-003', clientId: client1.id, type: 'subscription', status: 'sent', issueDate: daysAgo(5), dueDate: daysFromNow(25), subtotal: 9588, taxRate: 0, taxAmount: 0, discount: 1438, total: 8150, paidAmount: 0, currency: 'USD', notes: 'Annual renewal - Enterprise plan', terms: 'Net 30', items: JSON.stringify([{ description: 'Enterprise Plan - Annual Renewal', quantity: 1, unitPrice: 9588, amount: 9588 }]), workspaceId: wsId } })
      // Client 2 - Skyline Real Estate (active, business)
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-004', clientId: client2.id, type: 'subscription', status: 'paid', issueDate: monthsAgo(6), dueDate: monthsAgo(5), paidDate: monthsAgo(5), subtotal: 1047, taxRate: 8.5, taxAmount: 89, discount: 105, total: 1031, paidAmount: 1031, currency: 'USD', notes: 'Q1 Business Plan', terms: 'Net 30', items: JSON.stringify([{ description: 'Business Plan - Quarterly', quantity: 1, unitPrice: 1047, amount: 1047 }]), workspaceId: wsId } })
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-005', clientId: client2.id, type: 'subscription', status: 'paid', issueDate: monthsAgo(3), dueDate: monthsAgo(2), paidDate: monthsAgo(2), subtotal: 1047, taxRate: 8.5, taxAmount: 89, discount: 105, total: 1031, paidAmount: 1031, currency: 'USD', notes: 'Q2 Business Plan', terms: 'Net 30', items: JSON.stringify([{ description: 'Business Plan - Quarterly', quantity: 1, unitPrice: 1047, amount: 1047 }]), workspaceId: wsId } })
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-006', clientId: client2.id, type: 'upgrade', status: 'draft', issueDate: daysAgo(1), dueDate: daysFromNow(29), subtotal: 200, taxRate: 8.5, taxAmount: 17, discount: 0, total: 217, paidAmount: 0, currency: 'USD', notes: 'Upgrade from Business to Enterprise', terms: 'Net 30', items: JSON.stringify([{ description: 'Plan Upgrade Fee', quantity: 1, unitPrice: 200, amount: 200 }]), workspaceId: wsId } })
      // Client 3 - Pacific Coast (trial)
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-007', clientId: client3.id, type: 'subscription', status: 'draft', issueDate: daysAgo(1), dueDate: daysFromNow(29), subtotal: 149, taxRate: 10, taxAmount: 15, discount: 0, total: 164, paidAmount: 0, currency: 'USD', notes: 'First month after trial ends', terms: 'Net 15', items: JSON.stringify([{ description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 149, amount: 149 }]), workspaceId: wsId } })
      // Client 4 - Urban Living (suspended)
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-008', clientId: client4.id, type: 'subscription', status: 'overdue', issueDate: monthsAgo(2), dueDate: monthsAgo(1), subtotal: 49, taxRate: 0, taxAmount: 0, discount: 0, total: 49, paidAmount: 0, currency: 'USD', notes: 'Overdue - 30+ days', terms: 'Net 15', items: JSON.stringify([{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 49, amount: 49 }]), workspaceId: wsId } })
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-009', clientId: client4.id, type: 'subscription', status: 'overdue', issueDate: monthsAgo(1), dueDate: daysAgo(15), subtotal: 49, taxRate: 0, taxAmount: 0, discount: 0, total: 49, paidAmount: 0, currency: 'USD', notes: 'Overdue - 15+ days', terms: 'Net 15', items: JSON.stringify([{ description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 49, amount: 49 }]), workspaceId: wsId } })
      // Client 5 - Greenfield (churned)
      await db.invoice.create({ data: { invoiceNumber: 'INV-2024-010', clientId: client5.id, type: 'subscription', status: 'paid', issueDate: monthsAgo(12), dueDate: monthsAgo(11), paidDate: monthsAgo(11), subtotal: 4188, taxRate: 0, taxAmount: 0, discount: 209, total: 3979, paidAmount: 3979, currency: 'USD', notes: 'Annual Business Plan (final)', terms: 'Net 30', items: JSON.stringify([{ description: 'Business Plan - Annual', quantity: 1, unitPrice: 4188, amount: 4188 }]), workspaceId: wsId } })

      // ── Audit Logs ──
      const auditLogData = [
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: defaultClient.id, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Admin login from office network', severity: 'info', createdAt: daysAgo(0) },
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: defaultClient.id, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Admin login successful', severity: 'info', createdAt: daysAgo(0) },
        { action: 'property.created', entity: 'property', entityId: skyline.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: JSON.stringify({ name: 'Skyline Tower', type: 'residential', units: 6 }), severity: 'info', createdAt: daysAgo(1) },
        { action: 'tenant.updated', entity: 'tenant', entityId: t1.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Updated emergency contact information for James Mitchell', severity: 'info', createdAt: daysAgo(1) },
        { action: 'payment.received', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ amount: 4500, tenant: 'Isabella Torres', method: 'bank_transfer' }), severity: 'info', createdAt: daysAgo(1) },
        { action: 'ticket.created', entity: 'ticket', entityId: null, userId: user3.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', details: 'New maintenance ticket: Leaking kitchen faucet at Skyline Tower', severity: 'info', createdAt: daysAgo(2) },
        { action: 'client.onboarded', entity: 'client', entityId: client1.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: JSON.stringify({ company: 'Meridian Properties LLC', plan: 'enterprise' }), severity: 'info', createdAt: daysAgo(2) },
        { action: 'device.activated', entity: 'device', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.15', userAgent: 'TenantFlow-Desktop/2.1.0', details: 'Device activated with serial key TFOW-2024-XKCD-7A3B', severity: 'info', createdAt: daysAgo(2) },
        { action: 'invoice.sent', entity: 'invoice', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ invoiceNumber: 'INV-2024-001', client: 'Skyline Real Estate Group', amount: 1047 }), severity: 'info', createdAt: daysAgo(3) },
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '203.0.113.42', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: 'Login from new IP address - flagged for review', severity: 'warning', createdAt: daysAgo(3) },
        { action: 'lease.created', entity: 'lease', entityId: l2.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'James Mitchell', property: 'Skyline Tower', unit: '12A', rent: 3300 }), severity: 'info', createdAt: daysAgo(3) },
        { action: 'payment.overdue', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Ethan Williams', amount: 2400, daysOverdue: 30 }), severity: 'warning', createdAt: daysAgo(3) },
        { action: 'property.updated', entity: 'property', entityId: greenfield.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Updated property details for Greenfield Gardens - added pet policy', severity: 'info', createdAt: daysAgo(4) },
        { action: 'ticket.resolved', entity: 'ticket', entityId: null, userId: user3.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', details: 'Smoke detector issue resolved at Pacific Heights', severity: 'info', createdAt: daysAgo(4) },
        { action: 'user.failed_login', entity: 'user', entityId: null, userId: null, workspaceId: wsId, clientId: null, ipAddress: '45.33.32.156', userAgent: 'python-requests/2.28.0', details: 'Failed login attempt for admin@apexflow.cloud - invalid password', severity: 'warning', createdAt: daysAgo(5) },
        { action: 'payment.received', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ amount: 4200, tenant: 'TechVista Solutions', method: 'bank_transfer' }), severity: 'info', createdAt: daysAgo(5) },
        { action: 'lease.renewed', entity: 'lease', entityId: l2.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'James Mitchell', newRent: 3300, renewedFor: 12 }), severity: 'info', createdAt: daysAgo(6) },
        { action: 'client.suspended', entity: 'client', entityId: client4.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ company: 'Urban Living Solutions', reason: 'Payment default - 60 days overdue' }), severity: 'warning', createdAt: daysAgo(7) },
        { action: 'ticket.escalated', entity: 'ticket', entityId: null, userId: user3.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.102', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', details: 'Roof leak at Metro Commercial Hub escalated to high priority', severity: 'warning', createdAt: daysAgo(7) },
        { action: 'tenant.created', entity: 'tenant', entityId: t13.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ name: 'Ava Patel', property: 'Pacific Heights', unit: '2A' }), severity: 'info', createdAt: daysAgo(8) },
        { action: 'device.blocked', entity: 'device', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Device blocked due to suspicious activity - TFOW-2024-YMDE-9C5D', severity: 'error', createdAt: daysAgo(9) },
        { action: 'payment.late_fee', entity: 'payment', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Greenleaf Café', lateFee: 150, daysLate: 30 }), severity: 'warning', createdAt: daysAgo(9) },
        { action: 'invoice.overdue', entity: 'invoice', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '10.0.0.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ client: 'Urban Living Solutions', invoiceNumber: 'INV-2024-005', amount: 49, daysOverdue: 45 }), severity: 'warning', createdAt: daysAgo(10) },
        { action: 'property.inspection', entity: 'property', entityId: metro.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', details: 'Quarterly inspection completed for Metro Commercial Hub', severity: 'info', createdAt: daysAgo(10) },
        { action: 'lease.created', entity: 'lease', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Innovate Partners', property: 'Metro Commercial Hub', type: 'commercial' }), severity: 'info', createdAt: daysAgo(12) },
        { action: 'data.export', entity: 'workspace', entityId: wsId, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Full data export initiated by admin - 2.4MB CSV', severity: 'warning', createdAt: daysAgo(14) },
        { action: 'user.permission_change', entity: 'user', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: 'Changed role for Rachel Patel from member to manager', severity: 'info', createdAt: daysAgo(15) },
        { action: 'system.error', entity: 'workspace', entityId: wsId, userId: null, workspaceId: wsId, clientId: null, ipAddress: null, userAgent: 'TenantFlow-Server/2.1.0', details: JSON.stringify({ error: 'Database connection timeout', duration: '45s', retries: 3 }), severity: 'error', createdAt: daysAgo(18) },
        { action: 'client.onboarded', entity: 'client', entityId: client3.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ company: 'Pacific Coast Management', plan: 'professional', trial: true }), severity: 'info', createdAt: daysAgo(20) },
        { action: 'security.breach_attempt', entity: 'user', entityId: null, userId: null, workspaceId: wsId, clientId: null, ipAddress: '185.220.101.34', userAgent: 'curl/7.68.0', details: JSON.stringify({ type: 'SQL injection attempt', endpoint: '/api/auth/login', blocked: true }), severity: 'critical', createdAt: daysAgo(22) },
        { action: 'system.critical', entity: 'workspace', entityId: wsId, userId: null, workspaceId: wsId, clientId: null, ipAddress: null, userAgent: 'TenantFlow-Server/2.1.0', details: JSON.stringify({ error: 'Payment gateway integration failure', provider: 'Stripe', duration: '2h 15m', affectedPayments: 3 }), severity: 'critical', createdAt: daysAgo(25) },
        { action: 'lease.terminated', entity: 'lease', entityId: l1.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ tenant: 'Former tenant', property: 'Skyline Tower', unit: '8A', reason: 'Non-renewal' }), severity: 'info', createdAt: daysAgo(25) },
        { action: 'backup.completed', entity: 'workspace', entityId: wsId, userId: null, workspaceId: wsId, clientId: null, ipAddress: null, userAgent: 'TenantFlow-Cron/1.0', details: 'Automated daily backup completed - 45.2MB', severity: 'info', createdAt: daysAgo(28) },
        { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '172.16.0.50', userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', details: 'Admin login from mobile device', severity: 'info', createdAt: daysAgo(29) },
        { action: 'license.generated', entity: 'device', entityId: null, userId: admin.id, workspaceId: wsId, clientId: null, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', details: JSON.stringify({ key: 'TFOL-PRO-2024-AAAA', plan: 'professional', maxDevices: 10 }), severity: 'info', createdAt: daysAgo(30) },
      ]
      let auditLogCount = 0
      for (const al of auditLogData) {
        await db.auditLog.create({ data: al })
        auditLogCount++
      }

      return NextResponse.json({
        workspace: workspace.name,
        users: 5,
        properties: 6,
        units: 24,
        tenants: 15,
        leases: 12,
        payments: paymentCount,
        tickets: ticketCount,
        activities: activityCount,
        messages: messageCount,
        documents: documentCount,
        auditLogs: auditLogCount,
        devices: 5,
        sessions: 8,
        clients: 6,
        licenseKeys: 9,
        invoices: 10,
      })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 })
  }
}
