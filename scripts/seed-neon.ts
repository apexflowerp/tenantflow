/**
 * Standalone Neon Database Seed Script
 * Run: npx tsx scripts/seed-neon.ts
 * 
 * Seeds the new Neon PostgreSQL database with essential data
 * including the owner license key and demo data.
 */

import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL },
  },
})

async function main() {
  console.log('🔄 Seeding Neon PostgreSQL database...')
  
  // Check if data already exists
  const existingClient = await prisma.client.findFirst()
  if (existingClient) {
    console.log('⚠️  Database already has data. Checking owner key...')
    console.log('   Existing client:', existingClient.companyName)
    
    // Check for the owner key
    const ownerKey = await prisma.licenseKey.findUnique({ where: { key: 'TFOW-OWNR-180H-XK9Z' } })
    if (ownerKey) {
      console.log('✅ Owner key TFOW-OWNR-180H-XK9Z already exists')
    } else {
      console.log('❌ Owner key TFOW-OWNR-180H-XK9Z NOT found - creating it...')
      await createOwnerKey(existingClient.id)
    }
    
    await prisma.$disconnect()
    return
  }
  
  console.log('📋 Creating default client...')
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
      databaseUrl: DATABASE_URL,
      databaseName: 'neondb',
      dbStatus: 'active',
    },
  })
  console.log('✅ Default client created:', defaultClient.id)
  
  console.log('📋 Creating workspace...')
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
  console.log('✅ Workspace created:', workspace.id)
  
  console.log('📋 Creating admin user...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@apexflow.cloud',
      name: 'Sarah Chen',
      role: 'admin',
      department: 'Operations',
      phone: '(212) 555-0101',
      isActive: true,
      lastLogin: new Date(),
      workspaceId: workspace.id,
    },
  })
  console.log('✅ Admin user created:', admin.id)
  
  console.log('📋 Creating additional users...')
  await prisma.user.create({ data: { email: 'marcus.johnson@tenantflow.io', name: 'Marcus Johnson', role: 'manager', department: 'Leasing', phone: '(212) 555-0102', lastLogin: new Date(Date.now() - 86400000), workspaceId: workspace.id } })
  await prisma.user.create({ data: { email: 'emily.rodriguez@tenantflow.io', name: 'Emily Rodriguez', role: 'member', department: 'Maintenance', phone: '(212) 555-0103', lastLogin: new Date(Date.now() - 172800000), workspaceId: workspace.id } })
  await prisma.user.create({ data: { email: 'david.kim@tenantflow.io', name: 'David Kim', role: 'member', department: 'Finance', phone: '(212) 555-0104', lastLogin: new Date(Date.now() - 259200000), workspaceId: workspace.id } })
  await prisma.user.create({ data: { email: 'rachel.patel@tenantflow.io', name: 'Rachel Patel', role: 'member', department: 'Tenant Relations', phone: '(212) 555-0105', lastLogin: new Date(Date.now() - 86400000), workspaceId: workspace.id } })
  console.log('✅ Additional users created')
  
  // Create owner license key
  await createOwnerKey(defaultClient.id)
  
  // Create demo clients with license keys
  console.log('📋 Creating demo clients and license keys...')
  
  const meridian = await prisma.client.create({
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
      plan: 'enterprise',
      billingCycle: 'monthly',
      monthlyFee: 199,
      maxProperties: 100,
      maxUsers: 50,
      maxDevices: 20,
      databaseUrl: DATABASE_URL,
      databaseName: 'neondb',
      dbStatus: 'active',
    },
  })
  
  await prisma.workspace.create({
    data: {
      name: 'Meridian Properties',
      slug: 'meridian-properties',
      industry: 'Property Management',
      currency: 'USD',
      timezone: 'America/New_York',
      plan: 'enterprise',
      clientId: meridian.id,
    },
  })
  
  const pacificCoast = await prisma.client.create({
    data: {
      companyName: 'Pacific Coast Management',
      contactName: 'Linda Nakamura',
      email: 'linda@pacificcoast.com',
      phone: '(415) 555-3001',
      address: '500 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'US',
      industry: 'Real Estate',
      companySize: '1-10',
      status: 'trial',
      plan: 'professional',
      billingCycle: 'monthly',
      monthlyFee: 49,
      maxProperties: 25,
      maxUsers: 10,
      maxDevices: 5,
      trialStart: new Date(),
      trialEnd: new Date(Date.now() + 14 * 86400000),
      databaseUrl: DATABASE_URL,
      databaseName: 'neondb',
      dbStatus: 'active',
    },
  })
  
  await prisma.workspace.create({
    data: {
      name: 'Pacific Coast Mgmt',
      slug: 'pacific-coast-mgmt',
      industry: 'Real Estate',
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      plan: 'professional',
      clientId: pacificCoast.id,
    },
  })
  
  const urbanLiving = await prisma.client.create({
    data: {
      companyName: 'Urban Living Solutions',
      contactName: 'Mike Torres',
      email: 'mike@urbanliving.com',
      phone: '(312) 555-4001',
      address: '800 Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611',
      country: 'US',
      industry: 'Rental Management',
      companySize: '11-50',
      status: 'suspended',
      plan: 'starter',
      billingCycle: 'monthly',
      monthlyFee: 49,
      maxProperties: 10,
      maxUsers: 5,
      maxDevices: 3,
      databaseUrl: DATABASE_URL,
      databaseName: 'neondb',
      dbStatus: 'active',
    },
  })
  
  await prisma.workspace.create({
    data: {
      name: 'Urban Living Solutions',
      slug: 'urban-living-solutions',
      industry: 'Rental Management',
      currency: 'USD',
      timezone: 'America/Chicago',
      plan: 'starter',
      clientId: urbanLiving.id,
    },
  })
  
  // Create license keys for demo clients
  const licenseKeys = [
    { key: 'TFOL-ENT-2024-7A3B', type: 'enterprise', plan: 'enterprise', maxDevices: 20, maxUsers: 50, clientId: meridian.id, status: 'activated' },
    { key: 'TFOL-ENT-2024-8C4D', type: 'enterprise', plan: 'enterprise', maxDevices: 10, maxUsers: 25, clientId: meridian.id, status: 'available' },
    { key: 'TFOL-PRO-2024-1E2F', type: 'professional', plan: 'professional', maxDevices: 5, maxUsers: 10, clientId: pacificCoast.id, status: 'available' },
    { key: 'TFOL-STD-2024-3G4H', type: 'standard', plan: 'starter', maxDevices: 3, maxUsers: 5, clientId: urbanLiving.id, status: 'available' },
    { key: 'TFOL-PRO-2024-5I6J', type: 'professional', plan: 'professional', maxDevices: 5, maxUsers: 10, clientId: pacificCoast.id, status: 'available' },
    { key: 'TFOL-ENT-2024-9K0L', type: 'enterprise', plan: 'enterprise', maxDevices: 20, maxUsers: 50, clientId: meridian.id, status: 'available' },
    { key: 'TFOL-STD-2024-2M3N', type: 'standard', plan: 'starter', maxDevices: 1, maxUsers: 5, clientId: urbanLiving.id, status: 'expired', expiresAt: new Date(Date.now() - 30 * 86400000) },
  ]
  
  for (const lk of licenseKeys) {
    await prisma.licenseKey.create({ data: lk })
  }
  console.log('✅ License keys created:', licenseKeys.length)
  
  // Create sample properties
  console.log('📋 Creating sample properties...')
  const wsId = workspace.id
  
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
  console.log('✅ Properties created: 6')
  
  // Create units
  console.log('📋 Creating units...')
  const units = [
    // Skyline Tower
    { unitNumber: '12A', propertyId: skyline.id, floor: 12, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1200, rent: 3200, deposit: 3200, status: 'occupied', amenities: 'Gym,Pool,Concierge' },
    { unitNumber: '15B', propertyId: skyline.id, floor: 15, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 850, rent: 2400, deposit: 2400, status: 'occupied', amenities: 'Gym,Pool' },
    { unitNumber: '22C', propertyId: skyline.id, floor: 22, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2800, rent: 4500, deposit: 4500, status: 'occupied', amenities: 'Gym,Pool,Concierge,Rooftop' },
    { unitNumber: '8A', propertyId: skyline.id, floor: 8, type: 'studio', bedrooms: 0, bathrooms: 1, area: 550, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Gym' },
    { unitNumber: '18D', propertyId: skyline.id, floor: 18, type: 'apartment', bedrooms: 2, bathrooms: 1, area: 1050, rent: 2900, deposit: 2900, status: 'occupied', amenities: 'Gym,Pool' },
    { unitNumber: '5A', propertyId: skyline.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 500, rent: 1650, deposit: 1650, status: 'vacant', amenities: 'Gym' },
    // Harbor View
    { unitNumber: '3B', propertyId: harbor.id, floor: 3, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Bay View,Pool,Gym' },
    { unitNumber: '7A', propertyId: harbor.id, floor: 7, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 780, rent: 2800, deposit: 2800, status: 'occupied', amenities: 'Bay View,Gym' },
    { unitNumber: '10C', propertyId: harbor.id, floor: 10, type: 'penthouse', bedrooms: 3, bathrooms: 2, area: 2200, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Bay View,Pool,Rooftop' },
    { unitNumber: '5D', propertyId: harbor.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 600, rent: 2200, deposit: 2200, status: 'vacant', amenities: 'Gym' },
    // Metro Commercial
    { unitNumber: '101', propertyId: metro.id, floor: 1, type: 'office', bedrooms: 0, bathrooms: 2, area: 5000, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Parking,Conference Rooms' },
    { unitNumber: '201', propertyId: metro.id, floor: 2, type: 'retail', bedrooms: 0, bathrooms: 1, area: 3500, rent: 3500, deposit: 3500, status: 'occupied', amenities: 'Street Access,Storage' },
    { unitNumber: '301', propertyId: metro.id, floor: 3, type: 'office', bedrooms: 0, bathrooms: 2, area: 4000, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Parking,Kitchen' },
    { unitNumber: '401', propertyId: metro.id, floor: 4, type: 'office', bedrooms: 0, bathrooms: 1, area: 2500, rent: 2800, deposit: 2800, status: 'vacant', amenities: 'Parking' },
    // Greenfield
    { unitNumber: 'A1', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' },
    { unitNumber: 'A2', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 800, rent: 1400, deposit: 1400, status: 'occupied', amenities: 'Garden,Parking' },
    { unitNumber: 'B1', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 3, bathrooms: 2, area: 1400, rent: 2200, deposit: 2200, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' },
    { unitNumber: 'B2', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 750, rent: 1300, deposit: 1300, status: 'occupied', amenities: 'Garden' },
    // Pacific Heights
    { unitNumber: '2A', propertyId: pacific.id, floor: 2, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1300, rent: 3600, deposit: 3600, status: 'occupied', amenities: 'Gym,Parking,City View' },
    { unitNumber: '4B', propertyId: pacific.id, floor: 4, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 900, rent: 2600, deposit: 2600, status: 'occupied', amenities: 'Gym,City View' },
    { unitNumber: '6P', propertyId: pacific.id, floor: 6, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2400, rent: 4200, deposit: 4200, status: 'vacant', amenities: 'Gym,Rooftop,Panoramic View' },
    // Downtown Lofts
    { unitNumber: 'L1', propertyId: downtown.id, floor: 1, type: 'loft', bedrooms: 1, bathrooms: 1, area: 1400, rent: 1500, deposit: 1500, status: 'occupied', amenities: 'Exposed Brick,High Ceilings' },
    { unitNumber: 'L2', propertyId: downtown.id, floor: 2, type: 'loft', bedrooms: 2, bathrooms: 1, area: 1600, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Exposed Brick,High Ceilings,Parking' },
    { unitNumber: 'L3', propertyId: downtown.id, floor: 3, type: 'retail', bedrooms: 0, bathrooms: 1, area: 2000, rent: 2000, deposit: 2000, status: 'occupied', amenities: 'Street Access,Storage' },
  ]
  
  const createdUnits: any[] = []
  for (const unit of units) {
    createdUnits.push(await prisma.unit.create({ data: unit }))
  }
  console.log('✅ Units created:', createdUnits.length)
  
  // Create tenants
  console.log('📋 Creating tenants...')
  const monthsAgo = (months: number) => { const d = new Date(); d.setMonth(d.getMonth() - months); return d }
  
  const tenants = [
    { name: 'James Mitchell', email: 'james.mitchell@email.com', phone: '(917) 555-1001', type: 'individual', moveInDate: monthsAgo(14), status: 'active', emergencyName: 'Lisa Mitchell', emergencyPhone: '(917) 555-1002', workspaceId: wsId },
    { name: 'Sophia Chang', email: 'sophia.chang@email.com', phone: '(415) 555-2001', type: 'individual', moveInDate: monthsAgo(10), status: 'active', emergencyName: 'David Chang', emergencyPhone: '(415) 555-2002', workspaceId: wsId },
    { name: 'TechVista Solutions Inc.', email: 'leasing@techvista.com', phone: '(404) 555-3001', type: 'corporate', company: 'TechVista Solutions Inc.', moveInDate: monthsAgo(18), status: 'active', workspaceId: wsId },
    { name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(512) 555-4001', type: 'individual', moveInDate: monthsAgo(8), status: 'active', emergencyName: 'Mark Bennett', emergencyPhone: '(512) 555-4002', workspaceId: wsId },
    { name: 'Nathan Brooks', email: 'nathan.brooks@email.com', phone: '(415) 555-5001', type: 'individual', moveInDate: monthsAgo(6), status: 'active', emergencyName: 'Amy Brooks', emergencyPhone: '(415) 555-5002', workspaceId: wsId },
    { name: 'Greenleaf Café LLC', email: 'info@greenleafcafe.com', phone: '(404) 555-6001', type: 'corporate', company: 'Greenleaf Café LLC', moveInDate: monthsAgo(12), status: 'active', workspaceId: wsId },
    { name: 'Isabella Torres', email: 'isabella.torres@email.com', phone: '(917) 555-7001', type: 'individual', moveInDate: monthsAgo(4), status: 'active', emergencyName: 'Carlos Torres', emergencyPhone: '(917) 555-7002', workspaceId: wsId },
    { name: 'Ethan Williams', email: 'ethan.williams@email.com', phone: '(212) 555-8001', type: 'individual', moveInDate: monthsAgo(9), status: 'active', emergencyName: 'Julie Williams', emergencyPhone: '(212) 555-8002', workspaceId: wsId },
    { name: 'Innovate Partners LLC', email: 'office@innovatepartners.com', phone: '(404) 555-9001', type: 'corporate', company: 'Innovate Partners LLC', moveInDate: monthsAgo(15), status: 'active', workspaceId: wsId },
    { name: 'Mia Hernandez', email: 'mia.hernandez@email.com', phone: '(512) 555-1001', type: 'individual', moveInDate: monthsAgo(7), status: 'active', emergencyName: 'Rosa Hernandez', emergencyPhone: '(512) 555-1002', workspaceId: wsId },
    { name: "Liam O'Connor", email: 'liam.oconnor@email.com', phone: '(314) 555-1001', type: 'individual', moveInDate: monthsAgo(5), status: 'active', emergencyName: "Siobhan O'Connor", emergencyPhone: '(314) 555-1002', workspaceId: wsId },
    { name: 'Urban Art Gallery', email: 'hello@urbanartgallery.com', phone: '(314) 555-2001', type: 'corporate', company: 'Urban Art Gallery', moveInDate: monthsAgo(11), status: 'active', workspaceId: wsId },
    { name: 'Ava Patel', email: 'ava.patel@email.com', phone: '(415) 555-8001', type: 'individual', moveInDate: monthsAgo(3), status: 'active', emergencyName: 'Raj Patel', emergencyPhone: '(415) 555-8002', workspaceId: wsId },
    { name: 'Daniel Foster', email: 'daniel.foster@email.com', phone: '(212) 555-3001', type: 'individual', moveInDate: monthsAgo(2), status: 'active', emergencyName: 'Karen Foster', emergencyPhone: '(212) 555-3002', workspaceId: wsId },
    { name: 'Meridian Consulting Group', email: 'admin@meridiancg.com', phone: '(404) 555-4001', type: 'corporate', company: 'Meridian Consulting Group', moveInDate: monthsAgo(20), status: 'active', notes: 'Long-term commercial tenant', workspaceId: wsId },
  ]
  
  const createdTenants: any[] = []
  for (const t of tenants) {
    createdTenants.push(await prisma.tenant.create({ data: t }))
  }
  console.log('✅ Tenants created:', createdTenants.length)
  
  // Create leases
  console.log('📋 Creating leases...')
  const daysFromNow = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return d }
  
  const t1 = createdTenants[0] // James Mitchell
  const t2 = createdTenants[1] // Sophia Chang
  const t3 = createdTenants[2] // TechVista
  const t4 = createdTenants[3] // Olivia Bennett
  const t5 = createdTenants[4] // Nathan Brooks
  const t6 = createdTenants[5] // Greenleaf
  const t7 = createdTenants[6] // Isabella
  const t8 = createdTenants[7] // Ethan
  const t9 = createdTenants[8] // Innovate
  const t14 = createdTenants[13] // Daniel
  
  const st1 = createdUnits[0]  // 12A
  const st2 = createdUnits[1]  // 15B
  const st3 = createdUnits[2]  // 22C
  const st4 = createdUnits[3]  // 8A
  const st5 = createdUnits[4]  // 18D
  const hv1 = createdUnits[6]  // 3B Harbor
  const hv3 = createdUnits[8]  // 10C Harbor
  const mc1 = createdUnits[10] // 101 Metro
  const mc2 = createdUnits[11] // 201 Metro
  const mc3 = createdUnits[12] // 301 Metro
  const gg1 = createdUnits[14] // A1 Greenfield
  
  const leases = [
    { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(14), endDate: monthsAgo(2), monthlyRent: 3200, deposit: 3200, status: 'expired', type: 'residential', workspaceId: wsId },
    { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(2), endDate: daysFromNow(304), monthlyRent: 3300, deposit: 3300, status: 'active', type: 'residential', renewalDate: daysFromNow(60), workspaceId: wsId },
    { propertyId: skyline.id, unitId: st2.id, tenantId: t8.id, startDate: monthsAgo(9), endDate: daysFromNow(90), monthlyRent: 2400, deposit: 2400, status: 'active', type: 'residential', workspaceId: wsId },
    { propertyId: skyline.id, unitId: st3.id, tenantId: t7.id, startDate: monthsAgo(4), endDate: daysFromNow(245), monthlyRent: 4500, deposit: 4500, status: 'active', type: 'residential', workspaceId: wsId },
    { propertyId: skyline.id, unitId: st4.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId },
    { propertyId: skyline.id, unitId: st5.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 2900, deposit: 2900, status: 'expiring', type: 'residential', renewalDate: daysFromNow(30), workspaceId: wsId },
    { propertyId: harbor.id, unitId: hv1.id, tenantId: t2.id, startDate: monthsAgo(10), endDate: daysFromNow(60), monthlyRent: 3800, deposit: 3800, status: 'expiring', type: 'residential', renewalDate: daysFromNow(15), workspaceId: wsId },
    { propertyId: harbor.id, unitId: hv3.id, tenantId: t5.id, startDate: monthsAgo(6), endDate: daysFromNow(185), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'residential', workspaceId: wsId },
    { propertyId: metro.id, unitId: mc1.id, tenantId: t3.id, startDate: monthsAgo(18), endDate: daysFromNow(180), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'commercial', workspaceId: wsId },
    { propertyId: metro.id, unitId: mc2.id, tenantId: t6.id, startDate: monthsAgo(12), endDate: daysFromNow(240), monthlyRent: 3500, deposit: 3500, status: 'active', type: 'commercial', workspaceId: wsId },
    { propertyId: metro.id, unitId: mc3.id, tenantId: t9.id, startDate: monthsAgo(15), endDate: daysFromNow(150), monthlyRent: 3800, deposit: 3800, status: 'active', type: 'commercial', workspaceId: wsId },
    { propertyId: greenfield.id, unitId: gg1.id, tenantId: t4.id, startDate: monthsAgo(8), endDate: daysFromNow(250), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId },
  ]
  
  const createdLeases: any[] = []
  for (const l of leases) {
    createdLeases.push(await prisma.lease.create({ data: l }))
  }
  console.log('✅ Leases created:', createdLeases.length)
  
  // Create payments
  console.log('📋 Creating payments...')
  const payments = [
    // James Mitchell - current lease
    { leaseId: createdLeases[1].id, tenantId: t1.id, amount: 3200, type: 'rent', status: 'paid', dueDate: monthsAgo(5), paidDate: monthsAgo(5), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[1].id, tenantId: t1.id, amount: 3200, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(4), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[1].id, tenantId: t1.id, amount: 3200, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[1].id, tenantId: t1.id, amount: 3200, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[1].id, tenantId: t1.id, amount: 3200, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[1].id, tenantId: t1.id, amount: 3300, type: 'rent', status: 'pending', dueDate: daysFromNow(15), workspaceId: wsId },
    // Ethan Williams
    { leaseId: createdLeases[2].id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'credit_card', workspaceId: wsId },
    { leaseId: createdLeases[2].id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'credit_card', workspaceId: wsId },
    { leaseId: createdLeases[2].id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), lateFee: 75, workspaceId: wsId },
    { leaseId: createdLeases[2].id, tenantId: t8.id, amount: 2400, type: 'rent', status: 'pending', dueDate: daysFromNow(15), workspaceId: wsId },
    // Isabella Torres
    { leaseId: createdLeases[3].id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[3].id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[3].id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[3].id, tenantId: t7.id, amount: 4500, type: 'rent', status: 'pending', dueDate: daysFromNow(10), workspaceId: wsId },
    // Sophia Chang
    { leaseId: createdLeases[6].id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'check', workspaceId: wsId },
    { leaseId: createdLeases[6].id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'check', workspaceId: wsId },
    { leaseId: createdLeases[6].id, tenantId: t2.id, amount: 3800, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), lateFee: 100, workspaceId: wsId },
    // TechVista
    { leaseId: createdLeases[8].id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(5), paidDate: monthsAgo(5), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[8].id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(4), paidDate: monthsAgo(4), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[8].id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(3), paidDate: monthsAgo(3), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[8].id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[8].id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[8].id, tenantId: t3.id, amount: 4200, type: 'rent', status: 'pending', dueDate: daysFromNow(5), workspaceId: wsId },
    // Greenleaf Café
    { leaseId: createdLeases[9].id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', workspaceId: wsId },
    { leaseId: createdLeases[9].id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'overdue', dueDate: monthsAgo(1), lateFee: 150, workspaceId: wsId },
    { leaseId: createdLeases[9].id, tenantId: t6.id, amount: 3500, type: 'rent', status: 'pending', dueDate: daysFromNow(12), workspaceId: wsId },
    // Olivia Bennett
    { leaseId: createdLeases[11].id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'paid', dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'credit_card', workspaceId: wsId },
    { leaseId: createdLeases[11].id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'paid', dueDate: monthsAgo(1), paidDate: monthsAgo(1), method: 'credit_card', workspaceId: wsId },
    { leaseId: createdLeases[11].id, tenantId: t4.id, amount: 1800, type: 'rent', status: 'pending', dueDate: daysFromNow(8), workspaceId: wsId },
  ]
  
  for (const p of payments) {
    await prisma.payment.create({ data: p })
  }
  console.log('✅ Payments created:', payments.length)
  
  // Create maintenance tickets
  console.log('📋 Creating maintenance tickets...')
  const tickets = [
    { title: 'Leaking kitchen faucet', description: 'Kitchen faucet in unit 12A has been dripping for 3 days', category: 'plumbing', priority: 'medium', status: 'in_progress', propertyId: skyline.id, tenantId: t1.id, assignedTo: 'Emily Rodriguez', dueDate: daysFromNow(3), workspaceId: wsId },
    { title: 'AC not cooling', description: 'Air conditioning unit not cooling properly in unit 15B', category: 'hvac', priority: 'high', status: 'open', propertyId: skyline.id, tenantId: t8.id, dueDate: daysFromNow(1), workspaceId: wsId },
    { title: 'Broken window lock', description: 'Window lock on bedroom window is broken - security concern', category: 'general', priority: 'high', status: 'open', propertyId: harbor.id, tenantId: t2.id, dueDate: daysFromNow(2), workspaceId: wsId },
    { title: 'Elevator maintenance', description: 'Annual elevator inspection and maintenance due', category: 'general', priority: 'medium', status: 'scheduled', propertyId: skyline.id, dueDate: daysFromNow(14), workspaceId: wsId },
    { title: 'Smoke detector replacement', description: 'Smoke detector needs battery replacement', category: 'electrical', priority: 'low', status: 'resolved', propertyId: pacific.id, tenantId: t5.id, completedAt: new Date(), workspaceId: wsId },
    { title: 'Parking lot pothole', description: 'Large pothole in parking lot near entrance', category: 'general', priority: 'medium', status: 'open', propertyId: greenfield.id, dueDate: daysFromNow(7), workspaceId: wsId },
    { title: 'Roof leak', description: 'Water stain on ceiling of unit 201 - possible roof leak', category: 'plumbing', priority: 'critical', status: 'in_progress', propertyId: metro.id, assignedTo: 'Emily Rodriguez', dueDate: daysFromNow(1), workspaceId: wsId },
  ]
  
  for (const ticket of tickets) {
    await prisma.maintenanceTicket.create({ data: ticket })
  }
  console.log('✅ Maintenance tickets created:', tickets.length)
  
  // Create vendors
  console.log('📋 Creating vendors...')
  const vendors = [
    { name: 'AllPro Plumbing Services', email: 'info@allproplumbing.com', phone: '(212) 555-9001', company: 'AllPro Plumbing', category: 'plumbing', specialty: 'Emergency plumbing, pipe repair, drain cleaning', licenseNumber: 'PLB-2024-1234', rating: 4.8, totalJobs: 45, address: '89 Industrial Blvd', city: 'New York', state: 'NY', zipCode: '10001', status: 'active', workspaceId: wsId },
    { name: 'CoolBreeze HVAC', email: 'service@coolbreeze.com', phone: '(212) 555-9002', company: 'CoolBreeze HVAC Inc.', category: 'hvac', specialty: 'HVAC installation, repair, maintenance', licenseNumber: 'HVC-2024-5678', rating: 4.5, totalJobs: 32, address: '456 Climate Ave', city: 'New York', state: 'NY', zipCode: '10002', status: 'active', workspaceId: wsId },
    { name: 'Spark Electric Co.', email: 'support@sparkelectric.com', phone: '(212) 555-9003', company: 'Spark Electric Co.', category: 'electrical', specialty: 'Electrical repair, wiring, panel upgrades', licenseNumber: 'ELC-2024-9012', rating: 4.9, totalJobs: 58, address: '22 Volt Street', city: 'New York', state: 'NY', zipCode: '10003', status: 'active', workspaceId: wsId },
    { name: 'GreenScape Landscaping', email: 'hello@greenscape.com', phone: '(512) 555-9004', company: 'GreenScape Landscaping LLC', category: 'landscaping', specialty: 'Lawn care, tree trimming, irrigation', rating: 4.3, totalJobs: 21, address: '100 Garden Way', city: 'Austin', state: 'TX', zipCode: '78701', status: 'active', workspaceId: wsId },
    { name: 'SecureLock Services', email: 'admin@securelock.com', phone: '(415) 555-9005', company: 'SecureLock Services', category: 'security', specialty: 'Lock repair, rekeying, access control', rating: 4.7, totalJobs: 36, address: '789 Safety Dr', city: 'San Francisco', state: 'CA', zipCode: '94102', status: 'active', workspaceId: wsId },
  ]
  
  for (const v of vendors) {
    await prisma.vendor.create({ data: v })
  }
  console.log('✅ Vendors created:', vendors.length)
  
  // Create invoices for owner dashboard
  console.log('📋 Creating invoices...')
  const invoicesData = [
    { invoiceNumber: 'INV-2024-001', clientId: meridian.id, type: 'subscription', status: 'paid', issueDate: monthsAgo(1), dueDate: monthsAgo(1), paidDate: monthsAgo(1), subtotal: 199, taxRate: 0, taxAmount: 0, total: 199, paidAmount: 199, currency: 'USD', workspaceId: wsId },
    { invoiceNumber: 'INV-2024-002', clientId: pacificCoast.id, type: 'subscription', status: 'paid', issueDate: monthsAgo(1), dueDate: monthsAgo(1), paidDate: monthsAgo(1), subtotal: 49, taxRate: 0, taxAmount: 0, total: 49, paidAmount: 49, currency: 'USD', workspaceId: wsId },
    { invoiceNumber: 'INV-2024-003', clientId: urbanLiving.id, type: 'subscription', status: 'overdue', issueDate: monthsAgo(2), dueDate: monthsAgo(1), subtotal: 49, taxRate: 0, taxAmount: 0, total: 49, paidAmount: 0, currency: 'USD', workspaceId: wsId },
    { invoiceNumber: 'INV-2024-004', clientId: meridian.id, type: 'subscription', status: 'pending', issueDate: new Date(), dueDate: daysFromNow(30), subtotal: 199, taxRate: 0, taxAmount: 0, total: 199, paidAmount: 0, currency: 'USD', workspaceId: wsId },
    { invoiceNumber: 'INV-2024-005', clientId: defaultClient.id, type: 'subscription', status: 'pending', issueDate: new Date(), dueDate: daysFromNow(30), subtotal: 99, taxRate: 0, taxAmount: 0, total: 99, paidAmount: 0, currency: 'USD', workspaceId: wsId },
    { invoiceNumber: 'INV-2024-006', clientId: pacificCoast.id, type: 'subscription', status: 'pending', issueDate: new Date(), dueDate: daysFromNow(30), subtotal: 49, taxRate: 0, taxAmount: 0, total: 49, paidAmount: 0, currency: 'USD', workspaceId: wsId },
  ]
  
  for (const inv of invoicesData) {
    await prisma.invoice.create({ data: inv })
  }
  console.log('✅ Invoices created:', invoicesData.length)
  
  // Create activities
  console.log('📋 Creating activities...')
  const activitiesData = [
    { type: 'lease', title: 'New Lease Signed', description: 'James Mitchell renewed lease for Unit 12A at Skyline Tower', userId: admin.id, workspaceId: wsId },
    { type: 'payment', title: 'Payment Received', description: '$3,300 rent payment from James Mitchell', userId: admin.id, workspaceId: wsId },
    { type: 'maintenance', title: 'Maintenance Request', description: 'Leaking kitchen faucet reported at Skyline Tower', userId: admin.id, workspaceId: wsId },
    { type: 'tenant', title: 'New Tenant Added', description: 'Ava Patel moved into Pacific Heights Unit 2A', userId: admin.id, workspaceId: wsId },
    { type: 'payment', title: 'Payment Overdue', description: 'Ethan Williams - $2,400 rent overdue by 30 days', userId: admin.id, workspaceId: wsId },
    { type: 'lease', title: 'Lease Expiring Soon', description: 'Sophia Chang lease at Harbor View expires in 15 days', userId: admin.id, workspaceId: wsId },
    { type: 'property', title: 'Property Updated', description: 'Greenfield Gardens pet policy updated', userId: admin.id, workspaceId: wsId },
  ]
  
  for (const a of activitiesData) {
    await prisma.activity.create({ data: a })
  }
  console.log('✅ Activities created:', activitiesData.length)
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('🎉 DATABASE SEEDED SUCCESSFULLY!')
  console.log('='.repeat(60))
  console.log('')
  console.log('🔑 Owner License Key: TFOW-OWNR-180H-XK9Z')
  console.log('👤 Admin Email: admin@apexflow.cloud')
  console.log('🔒 Admin Password: Admin@180H')
  console.log('')
  console.log('📊 Summary:')
  console.log('   - Clients: 4')
  console.log('   - Workspaces: 4')
  console.log('   - Users: 6')
  console.log('   - Properties: 6')
  console.log('   - Units: 25')
  console.log('   - Tenants: 15')
  console.log('   - Leases: 12')
  console.log('   - Payments: 29')
  console.log('   - Maintenance Tickets: 7')
  console.log('   - Vendors: 5')
  console.log('   - Invoices: 6')
  console.log('   - License Keys: 8')
  console.log('   - Activities: 7')
  console.log('')
}

async function createOwnerKey(clientId: string) {
  const existingKey = await prisma.licenseKey.findUnique({ where: { key: 'TFOW-OWNR-180H-XK9Z' } })
  if (existingKey) {
    console.log('✅ Owner key already exists')
    return
  }
  
  await prisma.licenseKey.create({
    data: {
      key: 'TFOW-OWNR-180H-XK9Z',
      type: 'owner',
      plan: 'enterprise',
      maxDevices: 999,
      maxUsers: 999,
      status: 'available',
      clientId: clientId,
    },
  })
  console.log('✅ Owner license key created: TFOW-OWNR-180H-XK9Z')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
