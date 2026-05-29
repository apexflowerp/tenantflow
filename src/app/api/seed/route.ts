import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if data already exists
    const existingWorkspace = await db.workspace.findFirst()
    if (existingWorkspace) {
      return NextResponse.json({ message: 'Database already seeded. Skipping.', workspace: existingWorkspace.name })
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

    const result = await db.$transaction(async (tx) => {
      // ── Workspace ──
      const workspace = await tx.workspace.create({
        data: {
          name: 'TenantFlow HQ',
          slug: 'tenantflow-hq',
          industry: 'Property Management',
          currency: 'USD',
          timezone: 'America/New_York',
          plan: 'professional',
        },
      })
      const wsId = workspace.id

      // ── Users ──
      const admin = await tx.user.create({
        data: { email: 'sarah.chen@tenantflow.io', name: 'Sarah Chen', role: 'admin', department: 'Operations', phone: '(212) 555-0101', lastLogin: daysAgo(0), workspaceId: wsId },
      })
      await tx.user.create({ data: { email: 'marcus.johnson@tenantflow.io', name: 'Marcus Johnson', role: 'manager', department: 'Leasing', phone: '(212) 555-0102', lastLogin: daysAgo(1), workspaceId: wsId } })
      const user3 = await tx.user.create({
        data: { email: 'emily.rodriguez@tenantflow.io', name: 'Emily Rodriguez', role: 'member', department: 'Maintenance', phone: '(212) 555-0103', lastLogin: daysAgo(2), workspaceId: wsId },
      })
      await tx.user.create({ data: { email: 'david.kim@tenantflow.io', name: 'David Kim', role: 'member', department: 'Finance', phone: '(212) 555-0104', lastLogin: daysAgo(3), workspaceId: wsId } })
      await tx.user.create({ data: { email: 'rachel.patel@tenantflow.io', name: 'Rachel Patel', role: 'member', department: 'Tenant Relations', phone: '(212) 555-0105', lastLogin: daysAgo(1), workspaceId: wsId } })

      // ── Properties ──
      const skyline = await tx.property.create({
        data: { name: 'Skyline Tower', slug: 'skyline-tower', type: 'residential', address: '450 Park Avenue', city: 'New York', state: 'NY', zipCode: '10022', country: 'US', floors: 32, yearBuilt: 2018, totalArea: 85000, totalUnits: 6, occupiedUnits: 5, status: 'active', workspaceId: wsId },
      })
      const harbor = await tx.property.create({
        data: { name: 'Harbor View Residences', slug: 'harbor-view-residences', type: 'residential', address: '789 Waterfront Dr', city: 'San Francisco', state: 'CA', zipCode: '94111', country: 'US', floors: 12, yearBuilt: 2020, totalArea: 52000, totalUnits: 4, occupiedUnits: 3, status: 'active', workspaceId: wsId },
      })
      const metro = await tx.property.create({
        data: { name: 'Metro Commercial Hub', slug: 'metro-commercial-hub', type: 'commercial', address: '200 Peachtree St NE', city: 'Atlanta', state: 'GA', zipCode: '30303', country: 'US', floors: 8, yearBuilt: 2015, totalArea: 120000, totalUnits: 4, occupiedUnits: 3, status: 'active', workspaceId: wsId },
      })
      const greenfield = await tx.property.create({
        data: { name: 'Greenfield Gardens', slug: 'greenfield-gardens', type: 'residential', address: '1550 Oak Valley Rd', city: 'Austin', state: 'TX', zipCode: '78701', country: 'US', floors: 3, yearBuilt: 2019, totalArea: 38000, totalUnits: 4, occupiedUnits: 4, status: 'active', workspaceId: wsId },
      })
      const pacific = await tx.property.create({
        data: { name: 'Pacific Heights', slug: 'pacific-heights', type: 'residential', address: '2850 Broadway', city: 'San Francisco', state: 'CA', zipCode: '94115', country: 'US', floors: 6, yearBuilt: 2017, totalArea: 45000, totalUnits: 3, occupiedUnits: 2, status: 'active', workspaceId: wsId },
      })
      const downtown = await tx.property.create({
        data: { name: 'Downtown Lofts', slug: 'downtown-lofts', type: 'mixed', address: '920 Washington Ave', city: 'St. Louis', state: 'MO', zipCode: '63101', country: 'US', floors: 5, yearBuilt: 2016, totalArea: 40000, totalUnits: 3, occupiedUnits: 3, status: 'active', workspaceId: wsId },
      })

      // ── Units (Unit model does NOT have workspaceId) ──
      const st1 = await tx.unit.create({ data: { unitNumber: '12A', propertyId: skyline.id, floor: 12, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1200, rent: 3200, deposit: 3200, status: 'occupied', amenities: 'Gym,Pool,Concierge' } })
      const st2 = await tx.unit.create({ data: { unitNumber: '15B', propertyId: skyline.id, floor: 15, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 850, rent: 2400, deposit: 2400, status: 'occupied', amenities: 'Gym,Pool' } })
      const st3 = await tx.unit.create({ data: { unitNumber: '22C', propertyId: skyline.id, floor: 22, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2800, rent: 4500, deposit: 4500, status: 'occupied', amenities: 'Gym,Pool,Concierge,Rooftop' } })
      const st4 = await tx.unit.create({ data: { unitNumber: '8A', propertyId: skyline.id, floor: 8, type: 'studio', bedrooms: 0, bathrooms: 1, area: 550, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Gym' } })
      const st5 = await tx.unit.create({ data: { unitNumber: '18D', propertyId: skyline.id, floor: 18, type: 'apartment', bedrooms: 2, bathrooms: 1, area: 1050, rent: 2900, deposit: 2900, status: 'occupied', amenities: 'Gym,Pool' } })
      await tx.unit.create({ data: { unitNumber: '5A', propertyId: skyline.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 500, rent: 1650, deposit: 1650, status: 'vacant', amenities: 'Gym' } })

      const hv1 = await tx.unit.create({ data: { unitNumber: '3B', propertyId: harbor.id, floor: 3, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Bay View,Pool,Gym' } })
      await tx.unit.create({ data: { unitNumber: '7A', propertyId: harbor.id, floor: 7, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 780, rent: 2800, deposit: 2800, status: 'occupied', amenities: 'Bay View,Gym' } })
      const hv3 = await tx.unit.create({ data: { unitNumber: '10C', propertyId: harbor.id, floor: 10, type: 'penthouse', bedrooms: 3, bathrooms: 2, area: 2200, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Bay View,Pool,Rooftop' } })
      await tx.unit.create({ data: { unitNumber: '5D', propertyId: harbor.id, floor: 5, type: 'studio', bedrooms: 0, bathrooms: 1, area: 600, rent: 2200, deposit: 2200, status: 'vacant', amenities: 'Gym' } })

      const mc1 = await tx.unit.create({ data: { unitNumber: '101', propertyId: metro.id, floor: 1, type: 'office', bedrooms: 0, bathrooms: 2, area: 5000, rent: 4200, deposit: 4200, status: 'occupied', amenities: 'Parking,Conference Rooms' } })
      const mc2 = await tx.unit.create({ data: { unitNumber: '201', propertyId: metro.id, floor: 2, type: 'retail', bedrooms: 0, bathrooms: 1, area: 3500, rent: 3500, deposit: 3500, status: 'occupied', amenities: 'Street Access,Storage' } })
      const mc3 = await tx.unit.create({ data: { unitNumber: '301', propertyId: metro.id, floor: 3, type: 'office', bedrooms: 0, bathrooms: 2, area: 4000, rent: 3800, deposit: 3800, status: 'occupied', amenities: 'Parking,Kitchen' } })
      await tx.unit.create({ data: { unitNumber: '401', propertyId: metro.id, floor: 4, type: 'office', bedrooms: 0, bathrooms: 1, area: 2500, rent: 2800, deposit: 2800, status: 'vacant', amenities: 'Parking' } })

      const gg1 = await tx.unit.create({ data: { unitNumber: 'A1', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' } })
      await tx.unit.create({ data: { unitNumber: 'A2', propertyId: greenfield.id, floor: 1, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 800, rent: 1400, deposit: 1400, status: 'occupied', amenities: 'Garden,Parking' } })
      await tx.unit.create({ data: { unitNumber: 'B1', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 3, bathrooms: 2, area: 1400, rent: 2200, deposit: 2200, status: 'occupied', amenities: 'Garden,Parking,Pet Friendly' } })
      await tx.unit.create({ data: { unitNumber: 'B2', propertyId: greenfield.id, floor: 2, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 750, rent: 1300, deposit: 1300, status: 'occupied', amenities: 'Garden' } })

      await tx.unit.create({ data: { unitNumber: '2A', propertyId: pacific.id, floor: 2, type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1300, rent: 3600, deposit: 3600, status: 'occupied', amenities: 'Gym,Parking,City View' } })
      await tx.unit.create({ data: { unitNumber: '4B', propertyId: pacific.id, floor: 4, type: 'apartment', bedrooms: 1, bathrooms: 1, area: 900, rent: 2600, deposit: 2600, status: 'occupied', amenities: 'Gym,City View' } })
      await tx.unit.create({ data: { unitNumber: '6P', propertyId: pacific.id, floor: 6, type: 'penthouse', bedrooms: 3, bathrooms: 3, area: 2400, rent: 4200, deposit: 4200, status: 'vacant', amenities: 'Gym,Rooftop,Panoramic View' } })

      await tx.unit.create({ data: { unitNumber: 'L1', propertyId: downtown.id, floor: 1, type: 'loft', bedrooms: 1, bathrooms: 1, area: 1400, rent: 1500, deposit: 1500, status: 'occupied', amenities: 'Exposed Brick,High Ceilings' } })
      await tx.unit.create({ data: { unitNumber: 'L2', propertyId: downtown.id, floor: 2, type: 'loft', bedrooms: 2, bathrooms: 1, area: 1600, rent: 1800, deposit: 1800, status: 'occupied', amenities: 'Exposed Brick,High Ceilings,Parking' } })
      await tx.unit.create({ data: { unitNumber: 'L3', propertyId: downtown.id, floor: 3, type: 'retail', bedrooms: 0, bathrooms: 1, area: 2000, rent: 2000, deposit: 2000, status: 'occupied', amenities: 'Street Access,Storage' } })

      // ── Tenants ──
      const t1 = await tx.tenant.create({ data: { name: 'James Mitchell', email: 'james.mitchell@email.com', phone: '(917) 555-1001', type: 'individual', moveInDate: monthsAgo(14), status: 'active', emergencyName: 'Lisa Mitchell', emergencyPhone: '(917) 555-1002', workspaceId: wsId } })
      const t2 = await tx.tenant.create({ data: { name: 'Sophia Chang', email: 'sophia.chang@email.com', phone: '(415) 555-2001', type: 'individual', moveInDate: monthsAgo(10), status: 'active', emergencyName: 'David Chang', emergencyPhone: '(415) 555-2002', workspaceId: wsId } })
      const t3 = await tx.tenant.create({ data: { name: 'TechVista Solutions Inc.', email: 'leasing@techvista.com', phone: '(404) 555-3001', type: 'corporate', company: 'TechVista Solutions Inc.', moveInDate: monthsAgo(18), status: 'active', workspaceId: wsId } })
      const t4 = await tx.tenant.create({ data: { name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(512) 555-4001', type: 'individual', moveInDate: monthsAgo(8), status: 'active', emergencyName: 'Mark Bennett', emergencyPhone: '(512) 555-4002', workspaceId: wsId } })
      const t5 = await tx.tenant.create({ data: { name: 'Nathan Brooks', email: 'nathan.brooks@email.com', phone: '(415) 555-5001', type: 'individual', moveInDate: monthsAgo(6), status: 'active', emergencyName: 'Amy Brooks', emergencyPhone: '(415) 555-5002', workspaceId: wsId } })
      const t6 = await tx.tenant.create({ data: { name: 'Greenleaf Café LLC', email: 'info@greenleafcafe.com', phone: '(404) 555-6001', type: 'corporate', company: 'Greenleaf Café LLC', moveInDate: monthsAgo(12), status: 'active', workspaceId: wsId } })
      const t7 = await tx.tenant.create({ data: { name: 'Isabella Torres', email: 'isabella.torres@email.com', phone: '(917) 555-7001', type: 'individual', moveInDate: monthsAgo(4), status: 'active', emergencyName: 'Carlos Torres', emergencyPhone: '(917) 555-7002', workspaceId: wsId } })
      const t8 = await tx.tenant.create({ data: { name: 'Ethan Williams', email: 'ethan.williams@email.com', phone: '(212) 555-8001', type: 'individual', moveInDate: monthsAgo(9), status: 'active', emergencyName: 'Julie Williams', emergencyPhone: '(212) 555-8002', workspaceId: wsId } })
      const t9 = await tx.tenant.create({ data: { name: 'Innovate Partners LLC', email: 'office@innovatepartners.com', phone: '(404) 555-9001', type: 'corporate', company: 'Innovate Partners LLC', moveInDate: monthsAgo(15), status: 'active', workspaceId: wsId } })
      const t10 = await tx.tenant.create({ data: { name: 'Mia Hernandez', email: 'mia.hernandez@email.com', phone: '(512) 555-1001', type: 'individual', moveInDate: monthsAgo(7), status: 'active', emergencyName: 'Rosa Hernandez', emergencyPhone: '(512) 555-1002', workspaceId: wsId } })
      const t11 = await tx.tenant.create({ data: { name: "Liam O'Connor", email: 'liam.oconnor@email.com', phone: '(314) 555-1001', type: 'individual', moveInDate: monthsAgo(5), status: 'active', emergencyName: "Siobhan O'Connor", emergencyPhone: '(314) 555-1002', workspaceId: wsId } })
      const t12 = await tx.tenant.create({ data: { name: 'Urban Art Gallery', email: 'hello@urbanartgallery.com', phone: '(314) 555-2001', type: 'corporate', company: 'Urban Art Gallery', moveInDate: monthsAgo(11), status: 'active', workspaceId: wsId } })
      const t13 = await tx.tenant.create({ data: { name: 'Ava Patel', email: 'ava.patel@email.com', phone: '(415) 555-8001', type: 'individual', moveInDate: monthsAgo(3), status: 'active', emergencyName: 'Raj Patel', emergencyPhone: '(415) 555-8002', workspaceId: wsId } })
      const t14 = await tx.tenant.create({ data: { name: 'Daniel Foster', email: 'daniel.foster@email.com', phone: '(212) 555-3001', type: 'individual', moveInDate: monthsAgo(2), status: 'active', emergencyName: 'Karen Foster', emergencyPhone: '(212) 555-3002', workspaceId: wsId } })
      await tx.tenant.create({ data: { name: 'Meridian Consulting Group', email: 'admin@meridiancg.com', phone: '(404) 555-4001', type: 'corporate', company: 'Meridian Consulting Group', moveInDate: monthsAgo(20), status: 'active', notes: 'Long-term commercial tenant, considering expansion', workspaceId: wsId } })

      // ── Leases ──
      const l1 = await tx.lease.create({ data: { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(14), endDate: monthsAgo(2), monthlyRent: 3200, deposit: 3200, status: 'expired', type: 'residential', workspaceId: wsId } })
      const l2 = await tx.lease.create({ data: { propertyId: skyline.id, unitId: st1.id, tenantId: t1.id, startDate: monthsAgo(2), endDate: daysFromNow(304), monthlyRent: 3300, deposit: 3300, status: 'active', type: 'residential', renewalDate: daysFromNow(60), workspaceId: wsId } })
      const l3 = await tx.lease.create({ data: { propertyId: skyline.id, unitId: st2.id, tenantId: t8.id, startDate: monthsAgo(9), endDate: daysFromNow(90), monthlyRent: 2400, deposit: 2400, status: 'active', type: 'residential', workspaceId: wsId } })
      const l4 = await tx.lease.create({ data: { propertyId: skyline.id, unitId: st3.id, tenantId: t7.id, startDate: monthsAgo(4), endDate: daysFromNow(245), monthlyRent: 4500, deposit: 4500, status: 'active', type: 'residential', workspaceId: wsId } })
      const l5 = await tx.lease.create({ data: { propertyId: skyline.id, unitId: st4.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId } })
      await tx.lease.create({ data: { propertyId: skyline.id, unitId: st5.id, tenantId: t14.id, startDate: monthsAgo(2), endDate: daysFromNow(305), monthlyRent: 2900, deposit: 2900, status: 'expiring', type: 'residential', renewalDate: daysFromNow(30), workspaceId: wsId } })
      const l7 = await tx.lease.create({ data: { propertyId: harbor.id, unitId: hv1.id, tenantId: t2.id, startDate: monthsAgo(10), endDate: daysFromNow(60), monthlyRent: 3800, deposit: 3800, status: 'expiring', type: 'residential', renewalDate: daysFromNow(15), workspaceId: wsId } })
      const l8 = await tx.lease.create({ data: { propertyId: harbor.id, unitId: hv3.id, tenantId: t5.id, startDate: monthsAgo(6), endDate: daysFromNow(185), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'residential', workspaceId: wsId } })
      const l9 = await tx.lease.create({ data: { propertyId: metro.id, unitId: mc1.id, tenantId: t3.id, startDate: monthsAgo(18), endDate: daysFromNow(180), monthlyRent: 4200, deposit: 4200, status: 'active', type: 'commercial', workspaceId: wsId } })
      const l10 = await tx.lease.create({ data: { propertyId: metro.id, unitId: mc2.id, tenantId: t6.id, startDate: monthsAgo(12), endDate: daysFromNow(240), monthlyRent: 3500, deposit: 3500, status: 'active', type: 'commercial', workspaceId: wsId } })
      await tx.lease.create({ data: { propertyId: metro.id, unitId: mc3.id, tenantId: t9.id, startDate: monthsAgo(15), endDate: daysFromNow(150), monthlyRent: 3800, deposit: 3800, status: 'active', type: 'commercial', workspaceId: wsId } })
      const l12 = await tx.lease.create({ data: { propertyId: greenfield.id, unitId: gg1.id, tenantId: t4.id, startDate: monthsAgo(8), endDate: daysFromNow(250), monthlyRent: 1800, deposit: 1800, status: 'active', type: 'residential', workspaceId: wsId } })

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
        await tx.payment.create({ data: { ...p, workspaceId: wsId } })
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
        await tx.maintenanceTicket.create({ data: td })
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
        await tx.activity.create({ data: ad })
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
        await tx.message.create({ data: md })
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
        await tx.document.create({ data: dd })
        documentCount++
      }

      return {
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
      }
    })

    return NextResponse.json({ message: 'Database seeded successfully', data: result })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 })
  }
}
