import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
    },
  },
})

async function main() {
  console.log('🌱 Seeding new Neon database...')

  // Check if data already exists
  const existingClient = await prisma.client.findFirst()
  if (existingClient) {
    console.log('Database already has data. Force reseed needed. Clearing...')
    // Delete in correct order
    await prisma.auditLog.deleteMany()
    await prisma.licenseKey.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.session.deleteMany()
    await prisma.document.deleteMany()
    await prisma.message.deleteMany()
    await prisma.activity.deleteMany()
    await prisma.maintenanceTicket.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.lease.deleteMany()
    await prisma.tenant.deleteMany()
    await prisma.unit.deleteMany()
    await prisma.device.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.inspection.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.account.deleteMany()
    await prisma.insurancePolicy.deleteMany()
    await prisma.calendarEvent.deleteMany()
    await prisma.listing.deleteMany()
    await prisma.application.deleteMany()
    await prisma.property.deleteMany()
    await prisma.user.deleteMany()
    await prisma.workspace.deleteMany()
    await prisma.client.deleteMany()
    console.log('Cleared all existing data.')
  }

  const now = new Date()
  const monthsAgo = (months: number) => { const d = new Date(now); d.setMonth(d.getMonth() - months); return d }
  const daysAgo = (days: number) => { const d = new Date(now); d.setDate(d.getDate() - days); return d }
  const daysFromNow = (days: number) => { const d = new Date(now); d.setDate(d.getDate() + days); return d }

  // ── Default Client ──
  const defaultClient = await prisma.client.create({
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
      setupFee: 0,
      maxProperties: 999,
      maxUsers: 999,
      maxDevices: 999,
      databaseUrl: 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
      databaseName: 'neondb',
      dbStatus: 'active',
    },
  })
  console.log('✅ Created default client:', defaultClient.companyName)

  // ── Workspace ──
  const workspace = await prisma.workspace.create({
    data: {
      name: 'TenantFlow HQ',
      slug: 'tenantflow-hq',
      industry: 'Rental Management',
      currency: 'USD',
      timezone: 'America/New_York',
      plan: 'enterprise',
      clientId: defaultClient.id,
    },
  })
  const wsId = workspace.id
  console.log('✅ Created workspace:', workspace.name)

  // ── Users ──
  const admin = await prisma.user.create({
    data: { email: 'admin@apexflow.cloud', name: 'Sarah Chen', role: 'admin', department: 'Operations', phone: '(212) 555-0101', lastLogin: daysAgo(0), workspaceId: wsId, passwordHash: '$2a$12$placeholder.hash.for.admin', isActive: true },
  })
  await prisma.user.create({ data: { email: 'marcus.johnson@tenantflow.io', name: 'Marcus Johnson', role: 'manager', department: 'Leasing', phone: '(212) 555-0102', lastLogin: daysAgo(1), workspaceId: wsId, passwordHash: '$2a$12$placeholder.hash' } })
  await prisma.user.create({ data: { email: 'emily.rodriguez@tenantflow.io', name: 'Emily Rodriguez', role: 'member', department: 'Maintenance', phone: '(212) 555-0103', lastLogin: daysAgo(2), workspaceId: wsId, passwordHash: '$2a$12$placeholder.hash' } })
  await prisma.user.create({ data: { email: 'david.kim@tenantflow.io', name: 'David Kim', role: 'member', department: 'Finance', phone: '(212) 555-0104', lastLogin: daysAgo(3), workspaceId: wsId, passwordHash: '$2a$12$placeholder.hash' } })
  await prisma.user.create({ data: { email: 'rachel.patel@tenantflow.io', name: 'Rachel Patel', role: 'member', department: 'Tenant Relations', phone: '(212) 555-0105', lastLogin: daysAgo(1), workspaceId: wsId, passwordHash: '$2a$12$placeholder.hash' } })
  console.log('✅ Created 5 users')

  // ── Owner Device (TFOW-OWNR-180H-XK9Z) ──
  const ownerDevice = await prisma.device.create({
    data: {
      serialKey: 'TFOW-OWNR-180H-XK9Z',
      deviceName: 'TenantFlow Owner Device',
      deviceType: 'desktop',
      status: 'active',
      activatedAt: new Date(),
      lastSeenAt: new Date(),
      workspaceId: wsId,
    },
  })
  console.log('✅ Created owner device:', ownerDevice.serialKey)

  // ── Owner License Key ──
  await prisma.licenseKey.create({
    data: {
      key: 'TFOW-OWNR-180H-XK9Z',
      type: 'owner',
      plan: 'enterprise',
      maxDevices: 999,
      maxUsers: 999,
      status: 'activated',
      activatedAt: new Date(),
      clientId: defaultClient.id,
      deviceId: ownerDevice.id,
    },
  })
  console.log('✅ Created owner license key: TFOW-OWNR-180H-XK9Z')

  // ── Additional License Keys ──
  const client1 = await prisma.client.create({
    data: {
      companyName: 'Meridian Properties LLC',
      contactName: 'Robert Hayes',
      email: 'robert@meridianprops.com',
      phone: '(305) 555-2001',
      address: '1200 Brickell Ave',
      city: 'Miami',
      state: 'FL',
      zipCode: '33131',
      country: 'US',
      industry: 'Property Management',
      companySize: '11-50',
      status: 'active',
      plan: 'professional',
      billingCycle: 'monthly',
      monthlyFee: 79,
      maxProperties: 25,
      maxUsers: 15,
      maxDevices: 5,
      dbStatus: 'active',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      companyName: 'Skyline Real Estate Group',
      contactName: 'Michael Torres',
      email: 'michael@skylinerealestate.com',
      phone: '(212) 555-3001',
      address: '1 World Trade Center',
      city: 'New York',
      state: 'NY',
      zipCode: '10007',
      country: 'US',
      industry: 'Real Estate',
      companySize: '51-200',
      status: 'active',
      plan: 'enterprise',
      billingCycle: 'annual',
      monthlyFee: 149,
      maxProperties: 100,
      maxUsers: 50,
      maxDevices: 20,
      dbStatus: 'active',
    },
  })

  const client3 = await prisma.client.create({
    data: {
      companyName: 'Pacific Coast Management',
      contactName: 'Lisa Nakamura',
      email: 'lisa@pacificcoastmgmt.com',
      phone: '(415) 555-4001',
      address: '500 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'US',
      industry: 'Property Management',
      companySize: '1-10',
      status: 'trial',
      plan: 'starter',
      billingCycle: 'monthly',
      monthlyFee: 29,
      trialStart: daysAgo(10),
      trialEnd: daysFromNow(20),
      maxProperties: 5,
      maxUsers: 3,
      maxDevices: 2,
      dbStatus: 'pending',
    },
  })

  const client4 = await prisma.client.create({
    data: {
      companyName: 'Urban Living Solutions',
      contactName: 'Derek Washington',
      email: 'derek@urbanlivingsol.com',
      phone: '(312) 555-5001',
      address: '233 S Wacker Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60606',
      country: 'US',
      industry: 'Real Estate',
      companySize: '11-50',
      status: 'suspended',
      plan: 'professional',
      billingCycle: 'monthly',
      monthlyFee: 79,
      maxProperties: 15,
      maxUsers: 10,
      maxDevices: 3,
      dbStatus: 'error',
    },
  })
  console.log('✅ Created 4 additional clients')

  // License keys for each client
  await prisma.licenseKey.create({ data: { key: 'TFOL-PRO-2024-MER1', type: 'professional', plan: 'professional', maxDevices: 5, maxUsers: 15, status: 'activated', activatedAt: daysAgo(60), clientId: client1.id } })
  await prisma.licenseKey.create({ data: { key: 'TFOL-STD-2024-MER2', type: 'standard', plan: 'starter', maxDevices: 2, maxUsers: 5, status: 'available', clientId: client1.id } })
  await prisma.licenseKey.create({ data: { key: 'TFOL-ENT-2024-SKY1', type: 'enterprise', plan: 'enterprise', maxDevices: 20, maxUsers: 50, status: 'activated', activatedAt: daysAgo(90), clientId: client2.id } })
  await prisma.licenseKey.create({ data: { key: 'TFOL-PRO-2024-SKY2', type: 'professional', plan: 'professional', maxDevices: 10, maxUsers: 25, status: 'available', clientId: client2.id } })
  await prisma.licenseKey.create({ data: { key: 'TFOL-STD-2024-PAC1', type: 'standard', plan: 'starter', maxDevices: 2, maxUsers: 3, status: 'available', clientId: client3.id, expiresAt: daysFromNow(20) } })
  await prisma.licenseKey.create({ data: { key: 'TFOL-PRO-2024-URB1', type: 'professional', plan: 'professional', maxDevices: 3, maxUsers: 10, status: 'revoked', clientId: client4.id } })
  console.log('✅ Created 6 additional license keys')

  // ── Properties ──
  const skyline = await prisma.property.create({
    data: { name: 'Skyline Tower', slug: 'skyline-tower', type: 'residential', address: '450 Park Avenue', city: 'New York', state: 'NY', zipCode: '10022', country: 'US', floors: 32, yearBuilt: 2018, totalArea: 85000, totalUnits: 6, occupiedUnits: 5, status: 'active', workspaceId: wsId },
  })
  const harbor = await prisma.property.create({
    data: { name: 'Harbor View Residences', slug: 'harbor-view-residences', type: 'residential', address: '789 Waterfront Dr', city: 'San Francisco', state: 'CA', zipCode: '94111', country: 'US', floors: 12, yearBuilt: 2020, totalArea: 52000, totalUnits: 4, occupiedUnits: 3, status: 'active', workspaceId: wsId },
  })
  const metro = await prisma.property.create({
    data: { name: 'Metro Commercial Hub', slug: 'metro-commercial-hub', type: 'commercial', address: '200 Peachtree St NE', city: 'Atlanta', state: 'GA', zipCode: '30303', country: 'US', floors: 8, yearBuilt: 2015, totalArea: 120000, totalUnits: 4, occupiedUnits: 3, status: 'active', workspaceId: wsId },
  })
  const greenfield = await prisma.property.create({
    data: { name: 'Greenfield Gardens', slug: 'greenfield-gardens', type: 'residential', address: '1550 Oak Valley Rd', city: 'Austin', state: 'TX', zipCode: '78701', country: 'US', floors: 3, yearBuilt: 2019, totalArea: 38000, totalUnits: 4, occupiedUnits: 4, status: 'active', workspaceId: wsId },
  })
  const pacific = await prisma.property.create({
    data: { name: 'Pacific Heights', slug: 'pacific-heights', type: 'residential', address: '2850 Broadway', city: 'San Francisco', state: 'CA', zipCode: '94115', country: 'US', floors: 6, yearBuilt: 2017, totalArea: 45000, totalUnits: 3, occupiedUnits: 2, status: 'active', workspaceId: wsId },
  })
  const downtown = await prisma.property.create({
    data: { name: 'Downtown Lofts', slug: 'downtown-lofts', type: 'mixed', address: '920 Washington Ave', city: 'St. Louis', state: 'MO', zipCode: '63101', country: 'US', floors: 5, yearBuilt: 2016, totalArea: 40000, totalUnits: 3, occupiedUnits: 3, status: 'active', workspaceId: wsId },
  })
  console.log('✅ Created 6 properties')

  // ── Units ──
  const st1 = await prisma.unit.create({ data: { unitNumber: '12A', propertyId: skyline.id, floor: 12, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1200, rent: 3200, deposit: 3200, status: 'occupied', amenities: 'Gym,Pool,Concierge' } })
  const st2 = await prisma.unit.create({ data: { unitNumber: '15B', propertyId: skyline.id, floor: 15, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 850, rent: 2400, deposit: 2400, status: 'occupied', amenities: 'Gym,Pool' } })
  const st3 = await prisma.unit.create({ data: { unitNumber: '22C', propertyId: skyline.id, floor: 22, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2800, rent: 4500, deposit: 4500, status: 'occupied', amenities: 'Gym,Pool,Concierge,Rooftop' } })
  const st4 = await prisma.unit.create({ data: { unitNumber: '8A', propertyId: skyline.id, floor: 8, type: 'studio', bedrooms: 0, bathrooms: 1, area: 550, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Gym' } })
  const st5 = await prisma.unit.create({ data: { unitNumber: '18D', propertyId: skyline.id, floor: 18, type: 'apartment', bedrooms: 2, bathrooms: 1, area: 1050, rent: 2900, deposit: 2900, status: 'occupied', amenities: 'Gym,Pool' } })
  await prisma.unit.create({ data: { unitNumber: '5A', propertyId: skyline.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 500, rent: 1650, deposit: 1650, status: 'vacant', amenities: 'Gym' } })

  const hv1 = await prisma.unit.create({ data: { unitNumber: '3B', propertyId: harbor.id, floor: 3, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Bay View,Pool,Gym' } })
  await prisma.unit.create({ data: { unitNumber: '7A', propertyId: harbor.id, floor: 7, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 780, rent: 2800, deposit: 2800, status: 'occupied', amenities: 'Bay View,Gym' } })
  const hv3 = await prisma.unit.create({ data: { unitNumber: '10C', propertyId: harbor.id, floor: 10, type: 'penthouse', bedrooms: 3, bathrooms: 2, area: 2200, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Bay View,Pool,Rooftop' } })
  await prisma.unit.create({ data: { unitNumber: '5D', propertyId: harbor.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 600, rent: 2200, deposit: 2200, status: 'vacant', amenities: 'Gym' } })

  const mc1 = await prisma.unit.create({ data: { unitNumber: '101', propertyId: metro.id, floor: 1, type: 'office', bedrooms: 0, bathrooms: 2, area: 5000, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Parking,Conference Rooms' } })
  const mc2 = await prisma.unit.create({ data: { unitNumber: '201', propertyId: metro.id, floor: 2, type: 'retail', bedrooms: 0, bathrooms: 1, area: 3500, rent: 3500, deposit: 3500, status: 'occupied', amenities: 'Street Access,Storage' } })
  const mc3 = await prisma.unit.create({ data: { unitNumber: '301', propertyId: metro.id, floor: 3, type: 'office', bedrooms: 0, bathrooms: 2, area: 4000, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Parking,Kitchen' } })
  await prisma.unit.create({ data: { unitNumber: '401', propertyId: metro.id, floor: 4, type: 'office', bedrooms: 0, bathrooms: 1, area: 2500, rent: 2800, deposit: 2800, status: 'vacant', amenities: 'Parking' } })

  const gg1 = await prisma.unit.create({ data: { unitNumber: 'A1', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' } })
  await prisma.unit.create({ data: { unitNumber: 'A2', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 800, rent: 1400, deposit: 1400, status: 'occupied', amenities: 'Garden,Parking' } })
  await prisma.unit.create({ data: { unitNumber: 'B1', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 3, bathrooms: 2, area: 1400, rent: 2200, deposit: 2200, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' } })
  await prisma.unit.create({ data: { unitNumber: 'B2', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 750, rent: 1300, deposit: 1300, status: 'occupied', amenities: 'Garden' } })

  await prisma.unit.create({ data: { unitNumber: '2A', propertyId: pacific.id, floor: 2, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1300, rent: 3600, deposit: 3600, status: 'occupied', amenities: 'Gym,Parking,City View' } })
  await prisma.unit.create({ data: { unitNumber: '4B', propertyId: pacific.id, floor: 4, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 900, rent: 2600, deposit: 2600, status: 'occupied', amenities: 'Gym,City View' } })
  await prisma.unit.create({ data: { unitNumber: '6P', propertyId: pacific.id, floor: 6, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2400, rent: 4200, deposit: 4200, status: 'vacant', amenities: 'Gym,Rooftop,Panoramic View' } })

  await prisma.unit.create({ data: { unitNumber: 'L1', propertyId: downtown.id, floor: 1, type: 'loft', bedrooms: 1, bathrooms: 1, area: 1400, rent: 1500, deposit: 1500, status: 'occupied', amenities: 'Exposed Brick,High Ceilings' } })
  await prisma.unit.create({ data: { unitNumber: 'L2', propertyId: downtown.id, floor: 2, type: 'loft', bedrooms: 2, bathrooms: 1, area: 1600, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Exposed Brick,High Ceilings,Parking' } })
  await prisma.unit.create({ data: { unitNumber: 'L3', propertyId: downtown.id, floor: 3, type: 'retail', bedrooms: 0, bathrooms: 1, area: 2000, rent: 2000, deposit: 2000, status: 'occupied', amenities: 'Street Access,Storage' } })
  console.log('✅ Created units')

  // ── Tenants ──
  const t1 = await prisma.tenant.create({ data: { name: 'James Mitchell', email: 'james.mitchell@email.com', phone: '(917) 555-1001', type: 'individual', moveInDate: monthsAgo(14), status: 'active', emergencyName: 'Lisa Mitchell', emergencyPhone: '(917) 555-1002', workspaceId: wsId } })
  const t2 = await prisma.tenant.create({ data: { name: 'Sophia Chang', email: 'sophia.chang@email.com', phone: '(415) 555-2001', type: 'individual', moveInDate: monthsAgo(10), status: 'active', emergencyName: 'David Chang', emergencyPhone: '(415) 555-2002', workspaceId: wsId } })
  const t3 = await prisma.tenant.create({ data: { name: 'TechVista Solutions Inc.', email: 'leasing@techvista.com', phone: '(404) 555-3001', type: 'corporate', company: 'TechVista Solutions Inc.', moveInDate: monthsAgo(18), status: 'active', workspaceId: wsId } })
  const t4 = await prisma.tenant.create({ data: { name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(512) 555-4001', type: 'individual', moveInDate: monthsAgo(8), status: 'active', emergencyName: 'Mark Bennett', emergencyPhone: '(512) 555-4002', workspaceId: wsId } })
  const t5 = await prisma.tenant.create({ data: { name: 'Nathan Brooks', email: 'nathan.brooks@email.com', phone: '(415) 555-5001', type: 'individual', moveInDate: monthsAgo(6), status: 'active', emergencyName: 'Amy Brooks', emergencyPhone: '(415) 555-5002', workspaceId: wsId } })
  const t6 = await prisma.tenant.create({ data: { name: 'Greenleaf Café LLC', email: 'info@greenleafcafe.com', phone: '(404) 555-6001', type: 'corporate', company: 'Greenleaf Café LLC', moveInDate: monthsAgo(12), status: 'active', workspaceId: wsId } })
  const t7 = await prisma.tenant.create({ data: { name: 'Isabella Torres', email: 'isabella.torres@email.com', phone: '(917) 555-7001', type: 'individual', moveInDate: monthsAgo(4), status: 'active', emergencyName: 'Carlos Torres', emergencyPhone: '(917) 555-7002', workspaceId: wsId } })
  const t8 = await prisma.tenant.create({ data: { name: 'Ethan Williams', email: 'ethan.williams@email.com', phone: '(212) 555-8001', type: 'individual', moveInDate: monthsAgo(9), status: 'active', emergencyName: 'Julie Williams', emergencyPhone: '(212) 555-8002', workspaceId: wsId } })
  const t9 = await prisma.tenant.create({ data: { name: 'Innovate Partners LLC', email: 'office@innovatepartners.com', phone: '(404) 555-9001', type: 'corporate', company: 'Innovate Partners LLC', moveInDate: monthsAgo(15), status: 'active', workspaceId: wsId } })
  const t10 = await prisma.tenant.create({ data: { name: 'Mia Hernandez', email: 'mia.hernandez@email.com', phone: '(512) 555-1001', type: 'individual', moveInDate: monthsAgo(7), status: 'active', emergencyName: 'Rosa Hernandez', emergencyPhone: '(512) 555-1002', workspaceId: wsId } })
  const t11 = await prisma.tenant.create({ data: { name: "Liam O'Connor", email: 'liam.oconnor@email.com', phone: '(314) 555-1001', type: 'individual', moveInDate: monthsAgo(5), status: 'active', emergencyName: "Siobhan O'Connor", emergencyPhone: '(314) 555-1002', workspaceId: wsId } })
  const t12 = await prisma.tenant.create({ data: { name: 'Urban Art Gallery', email: 'hello@urbanartgallery.com', phone: '(314) 555-2001', type: 'corporate', company: 'Urban Art Gallery', moveInDate: monthsAgo(11), status: 'active', workspaceId: wsId } })
  const t13 = await prisma.tenant.create({ data: { name: 'Ava Patel', email: 'ava.patel@email.com', phone: '(415) 555-8001', type: 'individual', moveInDate: monthsAgo(3), status: 'active', emergencyName: 'Raj Patel', emergencyPhone: '(415) 555-8002', workspaceId: wsId } })
  const t14 = await prisma.tenant.create({ data: { name: 'Daniel Foster', email: 'daniel.foster@email.com', phone: '(212) 555-3001', type: 'individual', moveInDate: monthsAgo(2), status: 'active', emergencyName: 'Karen Foster', emergencyPhone: '(212) 555-3002', workspaceId: wsId } })
  await prisma.tenant.create({ data: { name: 'Meridian Consulting Group', email: 'admin@meridiancg.com', phone: '(404) 555-4001', type: 'corporate', company: 'Meridian Consulting Group', moveInDate: monthsAgo(20), status: 'active', notes: 'Long-term commercial tenant, considering expansion', workspaceId: wsId } })
  console.log('✅ Created 15 tenants')

  // ── Leases ──
  const l1 = await prisma.lease.create({ data: { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(14), endDate: monthsAgo(2), monthlyRent: 3200, deposit: 3200, status: 'expired', type: 'residential', workspaceId: wsId } })
  const l2 = await prisma.lease.create({ data: { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(2), endDate: daysFromNow(304), monthlyRent: 3300, deposit: 3300, status: 'active', type: 'residential', renewalDate: daysFromNow(60), workspaceId: wsId } })
  const l3 = await prisma.lease.create({ data: { propertyId: skyline.id, unitId: st2.id, tenantId: t8.id, startDate: monthsAgo(9), endDate: daysFromNow(90), monthlyRent: 2400, deposit: 2400, status: 'active', type: 'residential', workspaceId: wsId } })
  const l4 = await prisma.lease.create({ data: { propertyId: skyline.id, unitId: st3.id, tenantId: t7.id, startDate: monthsAgo(4), endDate: daysFromNow(245), monthlyRent: 4500, deposit: 4500, status: 'active', type: 'residential', workspaceId: wsId } })
  const l5 = await prisma.lease.create({ data: { propertyId: skyline.id, unitId: st4.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId } })
  await prisma.lease.create({ data: { propertyId: skyline.id, unitId: st5.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 2900, deposit: 2900, status: 'expiring', type: 'residential', renewalDate: daysFromNow(30), workspaceId: wsId } })
  const l7 = await prisma.lease.create({ data: { propertyId: harbor.id, unitId: hv1.id, tenantId: t2.id, startDate: monthsAgo(10), endDate: daysFromNow(60), monthlyRent: 3800, deposit: 3800, status: 'expiring', type: 'residential', renewalDate: daysFromNow(15), workspaceId: wsId } })
  const l8 = await prisma.lease.create({ data: { propertyId: harbor.id, unitId: hv3.id, tenantId: t5.id, startDate: monthsAgo(6), endDate: daysFromNow(185), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'residential', workspaceId: wsId } })
  const l9 = await prisma.lease.create({ data: { propertyId: metro.id, unitId: mc1.id, tenantId: t3.id, startDate: monthsAgo(18), endDate: daysFromNow(180), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'commercial', workspaceId: wsId } })
  const l10 = await prisma.lease.create({ data: { propertyId: metro.id, unitId: mc2.id, tenantId: t6.id, startDate: monthsAgo(12), endDate: daysFromNow(240), monthlyRent: 3500, deposit: 3500, status: 'active', type: 'commercial', workspaceId: wsId } })
  await prisma.lease.create({ data: { propertyId: metro.id, unitId: mc3.id, tenantId: t9.id, startDate: monthsAgo(15), endDate: daysFromNow(150), monthlyRent: 3800, deposit: 3800, status: 'active', type: 'commercial', workspaceId: wsId } })
  const l12 = await prisma.lease.create({ data: { propertyId: greenfield.id, unitId: gg1.id, tenantId: t4.id, startDate: monthsAgo(8), endDate: daysFromNow(250), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId } })
  console.log('✅ Created 12 leases')

  // ── Payments ──
  // James Mitchell current lease payments
  for (let m = 5; m >= 0; m--) {
    await prisma.payment.create({ data: { leaseId: l2.id, tenantId: t1.id, amount: m === 0 ? 3300 : 3200, type: 'rent', status: m === 0 ? 'pending' : 'paid', dueDate: monthsAgo(m), paidDate: m > 0 ? monthsAgo(m) : null, method: m > 0 ? 'bank_transfer' : null, lateFee: null, workspaceId: wsId } })
  }
  // Ethan Williams - some late
  await prisma.payment.create({ data: { leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(5), paidDate: monthsAgo(5), method: 'credit_card', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(3), method: 'credit_card', lateFee: 50, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'credit_card', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'credit_card', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), paidDate: null, method: null, lateFee: 75, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l3.id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'pending', dueDate: daysFromNow(15), paidDate: null, method: null, lateFee: null, workspaceId: wsId } })
  // Isabella Torres
  await prisma.payment.create({ data: { leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l4.id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'pending', dueDate: daysFromNow(10), paidDate: null, method: null, lateFee: null, workspaceId: wsId } })
  // Sophia Chang - expiring
  await prisma.payment.create({ data: { leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(4), method: 'check', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'check', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'check', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l7.id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), paidDate: null, method: null, lateFee: 100, workspaceId: wsId } })
  // TechVista - commercial
  for (let m = 5; m >= 0; m--) {
    await prisma.payment.create({ data: { leaseId: l9.id, tenantId: t3.id, amount: 4200, type: 'rent', status: m === 0 ? 'pending' : 'paid', dueDate: monthsAgo(m), paidDate: m > 0 ? monthsAgo(m) : null, method: m > 0 ? 'bank_transfer' : null, lateFee: null, workspaceId: wsId } })
  }
  // Greenleaf Café
  await prisma.payment.create({ data: { leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), paidDate: null, method: null, lateFee: 150, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l10.id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'pending', dueDate: daysFromNow(12), paidDate: null, method: null, lateFee: null, workspaceId: wsId } })
  // Olivia Bennett
  await prisma.payment.create({ data: { leaseId: l12.id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l12.id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', lateFee: null, workspaceId: wsId } })
  await prisma.payment.create({ data: { leaseId: l12.id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'pending', dueDate: daysFromNow(5), paidDate: null, method: null, lateFee: null, workspaceId: wsId } })
  console.log('✅ Created payments')

  // ── Maintenance Tickets ──
  await prisma.maintenanceTicket.createMany({
    data: [
      { title: 'Leaking kitchen faucet', description: 'Kitchen faucet has been dripping for 3 days', category: 'plumbing', priority: 'medium', status: 'open', propertyId: skyline.id, tenantId: t1.id, workspaceId: wsId },
      { title: 'AC not cooling', description: 'Air conditioning unit not cooling properly', category: 'hvac', priority: 'high', status: 'in_progress', propertyId: skyline.id, tenantId: t8.id, assignedTo: admin.id, workspaceId: wsId },
      { title: 'Broken window latch', description: 'Window latch on bedroom window is broken', category: 'general', priority: 'low', status: 'open', propertyId: harbor.id, tenantId: t2.id, workspaceId: wsId },
      { title: 'Elevator maintenance required', description: 'Elevator making unusual noise on floors 5-10', category: 'general', priority: 'high', status: 'open', propertyId: skyline.id, workspaceId: wsId },
      { title: 'Parking lot light out', description: 'Light in parking lot section B is not working', category: 'electrical', priority: 'medium', status: 'resolved', propertyId: metro.id, tenantId: t3.id, assignedTo: admin.id, completedAt: daysAgo(2), workspaceId: wsId },
      { title: 'Smoke detector beeping', description: 'Smoke detector in hallway keeps beeping', category: 'safety', priority: 'critical', status: 'resolved', propertyId: pacific.id, tenantId: t13.id, assignedTo: admin.id, completedAt: daysAgo(4), workspaceId: wsId },
    ],
  })
  console.log('✅ Created maintenance tickets')

  // ── Vendors ──
  await prisma.vendor.createMany({
    data: [
      { name: 'CoolAir HVAC Services', email: 'service@coolair.com', phone: '(212) 555-9001', company: 'CoolAir HVAC', category: 'hvac', specialty: 'Commercial & Residential HVAC', rating: 4.8, totalJobs: 156, city: 'New York', state: 'NY', status: 'active', workspaceId: wsId },
      { name: 'PipeMaster Plumbing', email: 'info@pipemaster.com', phone: '(212) 555-9002', company: 'PipeMaster', category: 'plumbing', specialty: 'Emergency plumbing, pipe repair', rating: 4.5, totalJobs: 210, city: 'New York', state: 'NY', status: 'active', workspaceId: wsId },
      { name: 'BrightSpark Electric', email: 'service@brightspark.com', phone: '(415) 555-9003', company: 'BrightSpark', category: 'electrical', specialty: 'Electrical repair and installation', rating: 4.7, totalJobs: 98, city: 'San Francisco', state: 'CA', status: 'active', workspaceId: wsId },
      { name: 'GreenScape Landscaping', email: 'quote@greenscape.com', phone: '(512) 555-9004', company: 'GreenScape', category: 'landscaping', specialty: 'Garden and lawn maintenance', rating: 4.3, totalJobs: 75, city: 'Austin', state: 'TX', status: 'active', workspaceId: wsId },
    ],
  })
  console.log('✅ Created vendors')

  // ── Invoices ──
  await prisma.invoice.create({ data: { invoiceNumber: 'INV-2024-001', clientId: client2.id, workspaceId: wsId, type: 'subscription', status: 'paid', issueDate: daysAgo(30), dueDate: daysAgo(20), paidDate: daysAgo(18), subtotal: 149, taxRate: 0, taxAmount: 0, total: 149, paidAmount: 149, currency: 'USD' } })
  await prisma.invoice.create({ data: { invoiceNumber: 'INV-2024-002', clientId: client1.id, workspaceId: wsId, type: 'subscription', status: 'paid', issueDate: daysAgo(25), dueDate: daysAgo(15), paidDate: daysAgo(12), subtotal: 79, taxRate: 0, taxAmount: 0, total: 79, paidAmount: 79, currency: 'USD' } })
  await prisma.invoice.create({ data: { invoiceNumber: 'INV-2024-003', clientId: defaultClient.id, workspaceId: wsId, type: 'subscription', status: 'pending', issueDate: daysAgo(5), dueDate: daysFromNow(25), subtotal: 99, taxRate: 0, taxAmount: 0, total: 99, currency: 'USD' } })
  await prisma.invoice.create({ data: { invoiceNumber: 'INV-2024-004', clientId: client1.id, workspaceId: wsId, type: 'subscription', status: 'pending', issueDate: daysAgo(3), dueDate: daysFromNow(27), subtotal: 79, taxRate: 0, taxAmount: 0, total: 79, currency: 'USD' } })
  await prisma.invoice.create({ data: { invoiceNumber: 'INV-2024-005', clientId: client4.id, workspaceId: wsId, type: 'subscription', status: 'overdue', issueDate: daysAgo(60), dueDate: daysAgo(30), subtotal: 79, taxRate: 0, taxAmount: 0, discount: 0, total: 79, paidAmount: 0, currency: 'USD' } })
  console.log('✅ Created invoices')

  // ── Audit Logs ──
  await prisma.auditLog.createMany({
    data: [
      { action: 'user.login', entity: 'user', entityId: admin.id, userId: admin.id, workspaceId: wsId, clientId: defaultClient.id, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', details: 'Admin login from office network', severity: 'info', createdAt: daysAgo(0) },
      { action: 'property.created', entity: 'property', entityId: skyline.id, userId: admin.id, workspaceId: wsId, ipAddress: '192.168.1.100', details: 'Created Skyline Tower property', severity: 'info', createdAt: daysAgo(1) },
      { action: 'payment.received', entity: 'payment', userId: admin.id, workspaceId: wsId, ipAddress: '10.0.0.45', details: 'Payment of $4500 received from Isabella Torres', severity: 'info', createdAt: daysAgo(1) },
      { action: 'device.activated', entity: 'device', userId: admin.id, workspaceId: wsId, ipAddress: '10.0.0.15', details: 'Device activated with serial key TFOW-OWNR-180H-XK9Z', severity: 'info', createdAt: daysAgo(2) },
      { action: 'client.onboarded', entity: 'client', entityId: client1.id, userId: admin.id, workspaceId: wsId, ipAddress: '192.168.1.100', details: 'Meridian Properties LLC onboarded', severity: 'info', createdAt: daysAgo(3) },
      { action: 'user.failed_login', entity: 'user', workspaceId: wsId, ipAddress: '45.33.32.156', userAgent: 'python-requests/2.28.0', details: 'Failed login attempt for admin', severity: 'warning', createdAt: daysAgo(5) },
      { action: 'client.suspended', entity: 'client', entityId: client4.id, userId: admin.id, workspaceId: wsId, ipAddress: '192.168.1.100', details: 'Urban Living Solutions suspended - Payment default', severity: 'warning', createdAt: daysAgo(7) },
      { action: 'security.breach_attempt', entity: 'user', workspaceId: wsId, ipAddress: '185.220.101.34', userAgent: 'curl/7.68.0', details: 'SQL injection attempt blocked', severity: 'critical', createdAt: daysAgo(22) },
    ],
  })
  console.log('✅ Created audit logs')

  // ── Activities ──
  await prisma.activity.createMany({
    data: [
      { type: 'lease', title: 'New lease signed', description: 'James Mitchell renewed lease for Unit 12A', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(0) },
      { type: 'payment', title: 'Payment received', description: 'Isabella Torres paid $4,500 for rent', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(1) },
      { type: 'maintenance', title: 'Ticket resolved', description: 'Smoke detector issue resolved at Pacific Heights', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(2) },
      { type: 'tenant', title: 'New tenant added', description: 'Ava Patel moved into Unit 2A at Pacific Heights', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(3) },
      { type: 'device', title: 'Device activated', description: 'Owner device activated with TFOW-OWNR-180H-XK9Z', userId: admin.id, workspaceId: wsId, createdAt: daysAgo(4) },
    ],
  })
  console.log('✅ Created activities')

  console.log('\n🎉 Database seeding complete!')
  console.log('Owner serial key: TFOW-OWNR-180H-XK9Z')
  console.log('Admin email: admin@apexflow.cloud')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
