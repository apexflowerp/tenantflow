import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── 1. Create default Client (SaaS owner) ──────────────────────────────────
  const ownerClient = await db.client.upsert({
    where: { email: 'admin@tenantflow.io' },
    update: {},
    create: {
      companyName: 'TenantFlow HQ Corp',
      contactName: 'Admin',
      email: 'admin@tenantflow.io',
      status: 'active',
      plan: 'professional',
      billingCycle: 'monthly',
      monthlyFee: 99,
      dbStatus: 'active',
      databaseName: 'main',
    },
  })
  console.log(`  ✅ Client: ${ownerClient.companyName} (${ownerClient.email})`)

  // ── 2. Create demo client ──────────────────────────────────────────────────
  const demoClient = await db.client.upsert({
    where: { email: 'demo@tenantflow.io' },
    update: {},
    create: {
      companyName: 'TenantFlow Demo',
      contactName: 'Demo User',
      email: 'demo@tenantflow.io',
      status: 'active',
      plan: 'starter',
      dbStatus: 'active',
      databaseName: 'demo',
    },
  })
  console.log(`  ✅ Demo Client: ${demoClient.companyName}`)

  // ── 3. Create Workspaces ───────────────────────────────────────────────────
  const ownerWorkspace = await db.workspace.upsert({
    where: { slug: 'tenantflow-hq' },
    update: {},
    create: {
      name: 'TenantFlow HQ',
      slug: 'tenantflow-hq',
      plan: 'professional',
      clientId: ownerClient.id,
    },
  })
  console.log(`  ✅ Workspace: ${ownerWorkspace.name}`)

  const demoWorkspace = await db.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      plan: 'starter',
      clientId: demoClient.id,
    },
  })
  console.log(`  ✅ Workspace: ${demoWorkspace.name}`)

  // ── 4. Create Users ────────────────────────────────────────────────────────
  const adminUser = await db.user.upsert({
    where: { email: 'admin@tenantflow.io' },
    update: {},
    create: {
      email: 'admin@tenantflow.io',
      name: 'Admin',
      role: 'admin',
      department: 'Operations',
      isActive: true,
      workspaceId: ownerWorkspace.id,
    },
  })
  console.log(`  ✅ Admin User: ${adminUser.email}`)

  const sarahUser = await db.user.upsert({
    where: { email: 'sarah.chen@tenantflow.io' },
    update: {},
    create: {
      email: 'sarah.chen@tenantflow.io',
      name: 'Sarah Chen',
      role: 'admin',
      department: 'Operations',
      isActive: true,
      workspaceId: ownerWorkspace.id,
    },
  })

  const marcusUser = await db.user.upsert({
    where: { email: 'marcus.johnson@tenantflow.io' },
    update: {},
    create: {
      email: 'marcus.johnson@tenantflow.io',
      name: 'Marcus Johnson',
      role: 'manager',
      department: 'Leasing',
      isActive: true,
      workspaceId: ownerWorkspace.id,
    },
  })

  const emilyUser = await db.user.upsert({
    where: { email: 'emily.rodriguez@tenantflow.io' },
    update: {},
    create: {
      email: 'emily.rodriguez@tenantflow.io',
      name: 'Emily Rodriguez',
      role: 'member',
      department: 'Maintenance',
      isActive: true,
      workspaceId: ownerWorkspace.id,
    },
  })

  // ── 5. Create Devices (with the OWNER key) ─────────────────────────────────
  const ownerDevice = await db.device.upsert({
    where: { serialKey: 'TFOW-OWNR-180H-XK9Z' },
    update: {},
    create: {
      serialKey: 'TFOW-OWNR-180H-XK9Z',
      deviceName: 'Owner Desktop',
      deviceType: 'desktop',
      status: 'active',
      activatedAt: new Date(),
      lastSeenAt: new Date(),
      workspaceId: ownerWorkspace.id,
      userId: adminUser.id,
    },
  })
  console.log(`  ✅ Owner Device: ${ownerDevice.serialKey} (${ownerDevice.status})`)

  // Additional devices
  const devices = [
    { serialKey: 'TFOW-2024-XKCD-7A3B', deviceName: 'Desktop Alpha', status: 'active', userId: sarahUser.id },
    { serialKey: 'TFOW-2024-YMDE-9C5D', deviceName: 'Laptop Beta', status: 'active', userId: marcusUser.id },
    { serialKey: 'TFOW-2024-ZNRF-2E8F', deviceName: 'Tablet Gamma', status: 'active', userId: emilyUser.id },
    { serialKey: 'TFOW-MBP2024-A3KF92', deviceName: "Jordan's MacBook Pro", status: 'active', userId: sarahUser.id },
    { serialKey: 'TFOW-PC2024-B7GH34', deviceName: 'Office Desktop PC', status: 'active', userId: marcusUser.id },
    { serialKey: 'TFOW-TP2024-C5MN78', deviceName: "Sarah's ThinkPad", status: 'active', userId: emilyUser.id },
    { serialKey: 'TFOW-IPAD2024-D2PQ56', deviceName: 'Reception iPad', status: 'blocked', userId: null },
    { serialKey: 'TFOW-LT2024-E8RS90', deviceName: 'Field Laptop', status: 'pending', userId: null },
  ]

  for (const d of devices) {
    await db.device.upsert({
      where: { serialKey: d.serialKey },
      update: {},
      create: {
        serialKey: d.serialKey,
        deviceName: d.deviceName,
        deviceType: 'desktop',
        status: d.status as string,
        activatedAt: d.status === 'active' ? new Date() : null,
        lastSeenAt: d.status === 'active' ? new Date() : null,
        workspaceId: ownerWorkspace.id,
        userId: d.userId,
      },
    })
  }
  console.log(`  ✅ ${devices.length} additional devices seeded`)

  // ── 6. Create License Keys ─────────────────────────────────────────────────
  const licenseKeys = [
    { key: 'TFOL-PRO-2024-AAAA', type: 'standard', plan: 'professional', status: 'available' },
    { key: 'TFOL-ENT-2024-BBBB', type: 'standard', plan: 'enterprise', status: 'available' },
    { key: 'TFOL-OWNR-180H-XK9Z', type: 'owner', plan: 'enterprise', status: 'available' },
    { key: 'TF-BIZ2-K2BC-L4DE-M6FG', type: 'standard', plan: 'business', status: 'available' },
  ]

  for (const lk of licenseKeys) {
    await db.licenseKey.upsert({
      where: { key: lk.key },
      update: {},
      create: {
        key: lk.key,
        type: lk.type,
        plan: lk.plan,
        status: lk.status,
        clientId: ownerClient.id,
      },
    })
  }
  console.log(`  ✅ ${licenseKeys.length} license keys seeded`)

  // ── 7. Create Properties ───────────────────────────────────────────────────
  const properties = [
    { name: 'Skyline Tower', slug: 'skyline-tower', address: '450 Park Avenue', city: 'New York', state: 'NY', totalUnits: 8, occupiedUnits: 7, type: 'residential' },
    { name: 'Harbor View Residences', slug: 'harbor-view', address: '200 Seaside Blvd', city: 'San Francisco', state: 'CA', totalUnits: 6, occupiedUnits: 5, type: 'residential' },
    { name: 'Metro Commercial Hub', slug: 'metro-commercial', address: '88 Commerce Way', city: 'Chicago', state: 'IL', totalUnits: 4, occupiedUnits: 4, type: 'commercial' },
    { name: 'Greenfield Gardens', slug: 'greenfield-gardens', address: '15 Meadow Lane', city: 'Austin', state: 'TX', totalUnits: 4, occupiedUnits: 3, type: 'residential' },
    { name: 'Lakeside Business Park', slug: 'lakeside-business', address: '500 Lake Drive', city: 'Seattle', state: 'WA', totalUnits: 3, occupiedUnits: 2, type: 'commercial' },
    { name: 'Riverside Lofts', slug: 'riverside-lofts', address: '72 River Road', city: 'Portland', state: 'OR', totalUnits: 2, occupiedUnits: 2, type: 'residential' },
  ]

  for (const p of properties) {
    await db.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        address: p.address,
        city: p.city,
        state: p.state,
        country: 'US',
        type: p.type,
        totalUnits: p.totalUnits,
        occupiedUnits: p.occupiedUnits,
        status: 'active',
        workspaceId: ownerWorkspace.id,
      },
    })
  }
  console.log(`  ✅ ${properties.length} properties seeded`)

  // ── 8. Create Tenants ──────────────────────────────────────────────────────
  const tenants = [
    { name: 'Alex Thompson', email: 'alex.t@email.com', phone: '+1-555-0101', type: 'individual', status: 'active' },
    { name: 'Maria Garcia', email: 'maria.g@email.com', phone: '+1-555-0102', type: 'individual', status: 'active' },
    { name: 'James Wilson', email: 'james.w@email.com', phone: '+1-555-0103', type: 'individual', status: 'active' },
    { name: 'TechCorp Inc.', email: 'leasing@techcorp.com', phone: '+1-555-0201', type: 'corporate', company: 'TechCorp Inc.', status: 'active' },
    { name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '+1-555-0104', type: 'individual', status: 'active' },
    { name: 'David Brown', email: 'david.b@email.com', phone: '+1-555-0105', type: 'individual', status: 'active' },
    { name: 'Lisa Wang', email: 'lisa.w@email.com', phone: '+1-555-0106', type: 'individual', status: 'active' },
    { name: 'Creative Studios LLC', email: 'office@creativestudios.com', phone: '+1-555-0202', type: 'corporate', company: 'Creative Studios LLC', status: 'active' },
    { name: 'Robert Kim', email: 'robert.k@email.com', phone: '+1-555-0107', type: 'individual', status: 'inactive' },
    { name: 'Emma Davis', email: 'emma.d@email.com', phone: '+1-555-0108', type: 'individual', status: 'pending' },
  ]

  for (const t of tenants) {
    await db.tenant.create({
      data: {
        name: t.name,
        email: t.email,
        phone: t.phone,
        type: t.type,
        company: t.company ?? null,
        status: t.status,
        workspaceId: ownerWorkspace.id,
      },
    })
  }
  console.log(`  ✅ ${tenants.length} tenants seeded`)

  // ── 9. Create sample Vendors ───────────────────────────────────────────────
  const vendors = [
    { name: 'ProFix Maintenance', email: 'info@profix.com', category: 'maintenance', specialty: 'HVAC & Plumbing', rating: 4.8, totalJobs: 142, status: 'active' },
    { name: 'Spark Electric Co.', email: 'service@sparkelectric.com', category: 'electrical', specialty: 'Electrical Systems', rating: 4.5, totalJobs: 89, status: 'active' },
    { name: 'GreenScape Landscaping', email: 'quotes@greenscape.com', category: 'landscaping', specialty: 'Landscape Design', rating: 4.9, totalJobs: 67, status: 'active' },
    { name: 'SecureGuard Security', email: 'admin@secureguard.com', category: 'security', specialty: 'Security Systems', rating: 4.3, totalJobs: 45, status: 'active' },
    { name: 'CleanPro Services', email: 'hello@cleanpro.com', category: 'cleaning', specialty: 'Commercial Cleaning', rating: 4.6, totalJobs: 203, status: 'active' },
    { name: 'PipeMasters Plumbing', email: 'emergency@pipemasters.com', category: 'plumbing', specialty: 'Emergency Plumbing', rating: 4.2, totalJobs: 31, status: 'inactive' },
  ]

  for (const v of vendors) {
    await db.vendor.create({
      data: {
        name: v.name,
        email: v.email,
        category: v.category,
        specialty: v.specialty,
        rating: v.rating,
        totalJobs: v.totalJobs,
        status: v.status,
        workspaceId: ownerWorkspace.id,
      },
    })
  }
  console.log(`  ✅ ${vendors.length} vendors seeded`)

  // ── 10. Create sample Insurance Policies ────────────────────────────────────
  const skyline = await db.property.findUnique({ where: { slug: 'skyline-tower' } })
  const harbor = await db.property.findUnique({ where: { slug: 'harbor-view' } })
  const metro = await db.property.findUnique({ where: { slug: 'metro-commercial' } })

  if (skyline && harbor && metro) {
    const policies = [
      { policyNumber: 'INS-2024-001', provider: 'StateFarm', type: 'property', premium: 12000, deductible: 5000, coverage: 2500000, startDate: new Date('2024-01-01'), endDate: new Date('2025-01-01'), status: 'active', propertyId: skyline.id },
      { policyNumber: 'INS-2024-002', provider: 'Allstate', type: 'property', premium: 8500, deductible: 3500, coverage: 1800000, startDate: new Date('2024-03-01'), endDate: new Date('2025-03-01'), status: 'active', propertyId: harbor.id },
      { policyNumber: 'INS-2024-003', provider: 'Liberty Mutual', type: 'liability', premium: 6200, deductible: 2500, coverage: 3000000, startDate: new Date('2024-02-01'), endDate: new Date('2025-02-01'), status: 'active', propertyId: metro.id },
      { policyNumber: 'INS-2024-004', provider: 'Zurich', type: 'flood', premium: 4800, deductible: 10000, coverage: 1500000, startDate: new Date('2024-01-15'), endDate: new Date('2025-01-15'), status: 'active', propertyId: skyline.id },
      { policyNumber: 'INS-2024-005', provider: 'AIG', type: 'umbrella', premium: 8800, deductible: 15000, coverage: 5000000, startDate: new Date('2024-06-01'), endDate: new Date('2025-06-01'), status: 'pending', propertyId: null },
    ]

    for (const p of policies) {
      await db.insurancePolicy.create({
        data: {
          policyNumber: p.policyNumber,
          provider: p.provider,
          type: p.type,
          premium: p.premium,
          deductible: p.deductible,
          coverage: p.coverage,
          startDate: p.startDate,
          endDate: p.endDate,
          status: p.status,
          propertyId: p.propertyId,
          workspaceId: ownerWorkspace.id,
        },
      })
    }
    console.log(`  ✅ ${policies.length} insurance policies seeded`)
  }

  // ── 11. Create sample Calendar Events ───────────────────────────────────────
  const today = new Date()
  const events = [
    { title: 'Property Inspection - Skyline Tower', type: 'inspection', startDate: new Date(today.getTime() + 2 * 86400000), endDate: new Date(today.getTime() + 2 * 86400000 + 3600000), status: 'confirmed' },
    { title: 'Lease Signing - Unit 4B', type: 'meeting', startDate: new Date(today.getTime() + 3 * 86400000), endDate: new Date(today.getTime() + 3 * 86400000 + 1800000), status: 'confirmed' },
    { title: 'Tenant Open House - Harbor View', type: 'showing', startDate: new Date(today.getTime() + 5 * 86400000), endDate: new Date(today.getTime() + 5 * 86400000 + 7200000), status: 'confirmed' },
    { title: 'HVAC Maintenance - Metro Hub', type: 'maintenance', startDate: new Date(today.getTime() + 7 * 86400000), endDate: new Date(today.getTime() + 7 * 86400000 + 14400000), status: 'tentative' },
    { title: 'Quarterly Review Meeting', type: 'meeting', startDate: new Date(today.getTime() + 10 * 86400000), endDate: new Date(today.getTime() + 10 * 86400000 + 3600000), status: 'confirmed' },
    { title: 'Fire Safety Drill - All Properties', type: 'inspection', startDate: new Date(today.getTime() + 14 * 86400000), allDay: true, status: 'confirmed' },
    { title: 'Rent Collection Day', type: 'deadline', startDate: new Date(today.getTime() + 1 * 86400000), allDay: true, status: 'confirmed' },
    { title: 'Vendor Evaluation - CleanPro', type: 'meeting', startDate: new Date(today.getTime() + 4 * 86400000), endDate: new Date(today.getTime() + 4 * 86400000 + 1800000), status: 'tentative' },
  ]

  for (const e of events) {
    await db.calendarEvent.create({
      data: {
        title: e.title,
        type: e.type,
        startDate: e.startDate,
        endDate: e.endDate ?? null,
        allDay: e.allDay ?? false,
        status: e.status,
        workspaceId: ownerWorkspace.id,
      },
    })
  }
  console.log(`  ✅ ${events.length} calendar events seeded`)

  // ── 12. Create sample Accounts ─────────────────────────────────────────────
  const accounts = [
    { code: '1000', name: 'Cash - Operating', type: 'asset', category: 'Current Assets', balance: 245600 },
    { code: '1200', name: 'Accounts Receivable', type: 'asset', category: 'Current Assets', balance: 38900 },
    { code: '1500', name: 'Property - Buildings', type: 'asset', category: 'Fixed Assets', balance: 8500000 },
    { code: '2000', name: 'Accounts Payable', type: 'liability', category: 'Current Liabilities', balance: 12400 },
    { code: '2100', name: 'Security Deposits Held', type: 'liability', category: 'Current Liabilities', balance: 45000 },
    { code: '3000', name: "Owner's Equity", type: 'equity', category: 'Equity', balance: 7200000 },
    { code: '4000', name: 'Rental Income', type: 'revenue', category: 'Operating Revenue', balance: 524400 },
    { code: '4100', name: 'Late Fee Income', type: 'revenue', category: 'Other Revenue', balance: 3200 },
    { code: '5000', name: 'Maintenance Expense', type: 'expense', category: 'Operating Expenses', balance: 48600 },
    { code: '5100', name: 'Insurance Expense', type: 'expense', category: 'Operating Expenses', balance: 40300 },
    { code: '5200', name: 'Property Tax', type: 'expense', category: 'Operating Expenses', balance: 67800 },
    { code: '5300', name: 'Utilities', type: 'expense', category: 'Operating Expenses', balance: 29400 },
    { code: '5400', name: 'Management Fees', type: 'expense', category: 'Operating Expenses', balance: 8500 },
    { code: '5500', name: 'Marketing & Advertising', type: 'expense', category: 'Operating Expenses', balance: 12400 },
    { code: '6000', name: 'Depreciation', type: 'expense', category: 'Non-Operating', balance: 142000 },
    { code: '7000', name: 'Interest Income', type: 'revenue', category: 'Other Revenue', balance: 2800 },
    { code: '7100', name: 'Application Fees', type: 'revenue', category: 'Other Revenue', balance: 1500 },
  ]

  for (const a of accounts) {
    await db.account.create({
      data: {
        code: a.code,
        name: a.name,
        type: a.type,
        category: a.category,
        balance: a.balance,
        isActive: true,
        workspaceId: ownerWorkspace.id,
      },
    })
  }
  console.log(`  ✅ ${accounts.length} accounts seeded`)

  // ── 13. Create sample Transactions ─────────────────────────────────────────
  const transactions = [
    { date: new Date('2024-12-01'), description: 'December Rent - Skyline Tower Unit 4B', amount: 3200, type: 'credit', accountCode: '4000', category: 'Rental Income', status: 'posted' },
    { date: new Date('2024-12-01'), description: 'December Rent - Harbor View Unit 12A', amount: 2400, type: 'credit', accountCode: '4000', category: 'Rental Income', status: 'posted' },
    { date: new Date('2024-12-02'), description: 'Plumbing repair - Metro Hub', amount: 850, type: 'debit', accountCode: '5000', category: 'Maintenance', status: 'posted' },
    { date: new Date('2024-12-03'), description: 'Monthly insurance premium', amount: 3358, type: 'debit', accountCode: '5100', category: 'Insurance', status: 'posted' },
    { date: new Date('2024-12-05'), description: 'Security deposit refund', amount: 2000, type: 'debit', accountCode: '2100', category: 'Deposits', status: 'posted' },
    { date: new Date('2024-12-10'), description: 'Late fee collected - Unit 7C', amount: 150, type: 'credit', accountCode: '4100', category: 'Late Fees', status: 'posted' },
    { date: new Date('2024-12-15'), description: 'Landscaping service - GreenScape', amount: 1200, type: 'debit', accountCode: '5000', category: 'Maintenance', status: 'posted' },
    { date: new Date('2024-12-20'), description: 'Application fee - new tenant', amount: 75, type: 'credit', accountCode: '7100', category: 'Application Fees', status: 'pending' },
  ]

  for (const t of transactions) {
    await db.transaction.create({
      data: {
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type,
        accountCode: t.accountCode,
        category: t.category,
        status: t.status,
        workspaceId: ownerWorkspace.id,
      },
    })
  }
  console.log(`  ✅ ${transactions.length} transactions seeded`)

  console.log('\n✨ Seed completed successfully!')
  console.log('\n📋 Key Information:')
  console.log('  🔑 Owner Serial Key:  TFOW-OWNR-180H-XK9Z')
  console.log('  🔑 License Key:        TFOL-OWNR-180H-XK9Z')
  console.log('  👤 Admin Email:        admin@tenantflow.io')
  console.log('  🔑 Admin Password:     Admin@180H')
  console.log('  📱 Demo Key:           TFOW-2024-XKCD-7A3B')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
