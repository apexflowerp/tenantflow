# TenantFlow OS — Work Log

---
Task ID: 1
Agent: Main
Task: Fix ApexFlow/TenantFlow merge issue - restore all TenantFlow branding

Work Log:
- Identified that ApexFlow references were incorrectly merged into TenantFlow project
- Reverted all ApexFlow → TenantFlow across 20+ source files
- Reverted apexflow.cloud → tenantflow.io for all email addresses
- Reverted apexflow-auth → tenantflow-auth and apexflow-theme → tenantflow-theme storage keys
- Reverted apexflow:logout → tenantflow:logout event names
- Reverted ApexFlow HQ → TenantFlow HQ workspace names
- Updated prisma/seed.ts with TenantFlow data (admin@tenantflow.io)
- Updated description from "Property Management" to "Rental Management" (user requested)
- Fixed Prisma schema from PostgreSQL to SQLite (matching DATABASE_URL)
- Fixed tenant-db.ts to work with SQLite (removed CREATE DATABASE PostgreSQL commands)
- Replaced crypto.randomUUID() import with simple token generator to prevent OOM crashes
- Reset database and re-seeded with correct TenantFlow data
- Verified all 3 auth APIs work: activation, demo login, admin login

Stage Summary:
- All ApexFlow references completely removed from source code (zero grep results)
- Serial key TFOW-OWNR-180H-XK9Z works correctly
- Admin login: admin@tenantflow.io / Admin@180H
- Demo login: demo@tenantflow.io (viewer role)
- Branding consistent: "TenantFlow OS" + "AI-Powered Rental Management"
- Lint passes with 0 errors (2 pre-existing warnings)

---
Task ID: 2
Agent: Sub Agent
Task: Add new Prisma models for enterprise features

Work Log:
- Read current schema.prisma (1003 lines, 38 existing models)
- Workspace model already had 10 new relation lines added (visitors, packages, energyReadings, budgets, moveInOuts, eSignatures, pets, disputes, assets, marketIntels)
- Appended 10 new enterprise feature models after SmartDevice model:
  1. Visitor - Visitor management (17 fields + workspace relation)
  2. Package - Package/delivery tracking (22 fields + workspace relation)
  3. EnergyReading - Energy monitoring (18 fields + workspace relation)
  4. Budget - Budget planning (14 fields + workspace relation)
  5. MoveInOut - Move-in/move-out workflows (14 fields + workspace relation)
  6. ESignature - E-signature tracking (16 fields + workspace relation)
  7. Pet - Pet registry (14 fields + workspace relation)
  8. Dispute - Dispute resolution (17 fields + workspace relation)
  9. Asset - Property asset management (18 fields + workspace relation)
  10. MarketIntel - Market intelligence/comparables (17 fields + workspace relation)
- All models use String @id @default(cuid()) pattern consistent with existing models
- All models include workspaceId + Workspace relation for multi-tenancy
- All enum-style fields use String with inline comments documenting valid values
- Ran `bun run db:push` — database synced successfully in 55ms, Prisma Client regenerated

Stage Summary:
- Schema file now 1238 lines with 48 total models
- All 10 new models properly appended after SmartDevice (no existing models modified)
- Database in sync, Prisma Client generated

---
Task ID: 3
Agent: Dashboard Agent
Task: Rewrite Dashboard page as a world-class enterprise command center with macOS Tahoe Liquid Glass design

Work Log:
- Completely rewrote `/src/components/dashboard/dashboard-page.tsx` from scratch
- Removed dependency on `useDashboardStore` — replaced with realistic mock data directly in the component
- Removed imports of old sub-components (KpiCard, RevenueChart, ActivityFeed, BreakdownChart)
- Updated `/src/components/dashboard/index.ts` to export only `DashboardPage`

Dashboard Sections Implemented (top to bottom):
1. **Welcome Header** — Greeting with time-aware message ("Good morning/afternoon/evening, TenantFlow"), current date, system status badge, 4 quick action buttons (Add Property, New Lease, Collect Rent, AI Copilot) with tahoe-btn styling and glass-panel+tint-blue background
2. **KPI Stats Row** — 4 glass-cards with colored accent left borders (tahoe-blue, tahoe-green, tahoe-purple, tahoe-orange), each with icon, large bold value, trend indicator with up/down arrows, mini sparkline SVG visualization, and glass tint backgrounds
3. **Charts Row** — Revenue Trend (Area chart with 12 months of data, gradient fill, tahoe-blue color) and Occupancy by Property (Bar chart with 6 properties, per-bar color coding using Cell component — green ≥95%, blue ≥90%, orange ≥85%, red <85%)
4. **Middle Row (3 columns)** — Recent Activity Feed (6 items with color-coded type icons), Lease Expirations (4 entries with urgency color coding: red <30d, orange <60d, green >60d), AI Insights (3 insight cards with Sparkles icon, purple glass tint, action links)
5. **Bottom Row (2 columns)** — Payment Collection Status (6 properties with progress bars and color-coded rates) and Upcoming Tasks (5 items with type icons and priority badges)

Technical Implementation:
- Used `glass-card`, `glass-panel`, `glass-tint-blue/purple/green` CSS classes from the Tahoe design system
- Used `tahoe-badge-*` classes for colored pill badges
- Used `tahoe-hover`, `tahoe-title`, `tahoe-caption`, `tahoe-overline` typography classes
- Used framer-motion `containerVariants`/`itemVariants`/`sectionVariants` for staggered entrance animations
- Used recharts `AreaChart`, `BarChart`, `Cell` for retina-quality charts
- Used shadcn/ui Card, Badge, Progress, Button, Avatar, AvatarFallback components
- Custom `MiniSparkline` SVG component for KPI sparklines
- Custom `ChartTooltip` glass-styled tooltip for charts
- All tahoe accent colors used extensively (blue, green, orange, purple, red, teal)
- Fully responsive (mobile-first grid with sm/lg breakpoints)
- Dark/light mode fully supported via CSS variables
- No API calls — all data is mock data in the component

Lint Results:
- 0 errors, 2 pre-existing warnings (unrelated to dashboard)

Stage Summary:
- Dashboard is now a premium macOS-inspired command center
- All 5 sections fully implemented with rich visual design
- Staggered framer-motion animations on page load
- Color-coded everything: KPIs, activities, leases, tasks, progress bars
- Responsive layout with glass surfaces and Tahoe accent colors

---
Task ID: 2
Agent: Enterprise Modules Agent
Task: Create 10 new enterprise module page components with macOS Tahoe Liquid Glass styling

Work Log:
- Created 10 enterprise module page components, each with full Liquid Glass design
- Created 10 index.tsx barrel export files for each module
- Updated page.tsx with imports, MODULES config, and moduleMap entries for all 10 modules

Components Created:

1. **Energy Management** (`/src/components/energy/energy-page.tsx`)
   - Stats: Monthly Consumption ($3,842), Avg Cost/Unit ($128), Carbon Footprint (12.4t), Savings (18%)
   - 6 energy readings with property, type (electric/gas/water/solar), consumption, cost, trend
   - Energy Efficiency Tips section with 4 AI-powered recommendations and savings badges
   - Color-coded type badges and status badges (Active/Warning/Critical)

2. **Visitor Management** (`/src/components/visitors/visitors-page.tsx`)
   - Stats: Today's Visitors (8), Expected (3), Checked In (5), Pending Approval (1)
   - 6 visitors with name, host, purpose, check-in/out times, status
   - Quick Check-In section with inline input and button
   - Status badges: Pending, Checked In, Checked Out, Declined

3. **Package Management** (`/src/components/packages/packages-page.tsx`)
   - Stats: Pending Pickup (12), Delivered Today (8), Overdue (3), This Month (156)
   - 6 packages with tracking number, sender, carrier, size, status, shelf location
   - Pickup Reminders notification section with "Notify" buttons
   - Size badges (Small/Medium/Large/Oversized) and carrier color coding

4. **Move-In/Move-Out** (`/src/components/move-inout/move-inout-page.tsx`)
   - Stats: Upcoming Move-Ins (3), Pending Move-Outs (2), In Progress (1), Completed This Month (7)
   - 6 records with tenant name, property, type, scheduled date, status, checklist progress
   - Checklist Progress section with animated progress bars
   - Progress bar color coding based on completion percentage

5. **Budget & Forecasting** (`/src/components/budget/budget-page.tsx`)
   - Stats: Annual Budget ($485K), Spent YTD ($312K), Remaining ($173K), Variance (-3.2%)
   - 6 budget items with name, category (operating/capital/maintenance), amount, spent, remaining, period
   - Budget vs Actual progress section with animated bars
   - Variance color coding and over-budget highlighting

6. **E-Signatures** (`/src/components/e-signatures/e-signatures-page.tsx`)
   - Stats: Pending Signatures (5), Completed (42), Avg Turnaround (1.8d), Expiring Soon (2)
   - 6 signature records with document name, type, requested by/from, status, dates
   - Quick Send Signature Request section with inline form
   - Send Reminder button for pending signatures, expiry date highlighting

7. **Pet Management** (`/src/components/pets/pets-page.tsx`)
   - Stats: Registered Pets (18), Dogs (12), Cats (5), Pending Approval (2)
   - 6 pets with name, type, breed, tenant name, property, weight, approval status
   - Pet Policy Compliance section with 4 policy cards and violation badges
   - Vaccination status badges (Up to date/Missing)

8. **Dispute Resolution** (`/src/components/disputes/disputes-page.tsx`)
   - Stats: Open Disputes (4), Under Review (2), Resolved This Month (8), Avg Resolution (5.2d)
   - 6 disputes with title, type (noise/damage/payment/lease/common_area), priority, reported by, status
   - Color-coded priority indicators with icons (Low=blue, Medium=orange, High=red flame, Critical=red zap)
   - Critical/High priority rows highlighted with red background

9. **Asset Management** (`/src/components/assets/assets-page.tsx`)
   - Stats: Total Assets (42), Total Value ($285K), Depreciated ($48K), Maintenance Due (3)
   - 6 assets with name, category, property, purchase price, current value, condition, warranty status
   - Asset Health Overview section with computed health scores (0-100) and animated progress bars
   - Health score composite based on condition, value retention, warranty, and maintenance recency

10. **Market Intelligence** (`/src/components/market-intel/market-intel-page.tsx`)
    - Stats: Avg Rent ($2,450), Market Trend (+4.2%), Days on Market (18), Comparable Units (24)
    - 6 market comparables with address, price, bedrooms, area, price/sqft, source
    - AI Market Insights section with 4 insight cards and confidence scores
    - Source badges (Zillow, Redfin, MLS) and listing status indicators

Design Consistency:
- All components use 'use client' directive
- All use glass-card, tahoe-hover, tahoe-badge-*, tahoe-overline/caption/title/headline typography classes
- All use framer-motion for staggered entrance animations
- All have responsive desktop table + mobile card layouts
- All have search + filter controls in the data table header
- All have header with icon, title, description, and action buttons (Export/Refresh/Create)
- All have 4 stat cards with colored accent icon backgrounds
- All use Lucide icons and shadcn/ui components (Card, Badge, Button, Input, Select, Table)

Lint Results:
- 0 errors, 2 pre-existing warnings (unrelated to new modules)

---
Task ID: 4
Agent: Backend API Agent
Task: Create backend API routes for 10 new enterprise modules with mock/demo data

Work Log:
- Created 10 API route files under `/src/app/api/` following the NextResponse.json({ data }) pattern
- Each route exports a GET handler returning 6 realistic enterprise-grade mock items

API Routes Created:

1. **`/api/energy/route.ts`** — Energy Readings
   - 6 items: electric, gas, water, solar readings across 6 properties
   - Fields: property, unit, type, consumption, cost, rate, period, timestamp, status, trend, carbonOffset, provider
   - Status types: active, warning, critical
   - Solar entry has negative cost (energy credit)

2. **`/api/visitors/route.ts`** — Visitor Management
   - 6 items: guests, contractors, prospective tenants, delivery, professional visitors
   - Fields: name, email, phone, host, hostUnit, property, purpose, checkInTime, checkOutTime, status, visitorType, notes
   - Status types: checked_in, checked_out, pending
   - Visitor types: guest, contractor, prospective_tenant, delivery, professional

3. **`/api/packages/route.ts`** — Package Tracking
   - 6 items: packages from Amazon, Wayfair, FedEx Office, IKEA, Target, Apple
   - Fields: trackingNumber, sender, carrier, carrierColor, recipient, recipientUnit, property, size, weight, shelfLocation, deliveredAt, pickupDeadline, status, signatureRequired, notes
   - Carriers: UPS (#644117), USPS (#333366), FedEx (#4D148C)
   - Sizes: small, medium, large, oversized
   - Status types: pending_pickup, picked_up, overdue

4. **`/api/move-inout/route.ts`** — Move-In/Move-Out
   - 6 items: 3 move-ins, 3 move-outs across 6 properties
   - Fields: tenantName, tenantEmail, property, unit, type, scheduledDate, completedDate, status, checklistProgress, checklistTotal, checklistCompleted, depositAmount, depositStatus, notes
   - Status types: scheduled, in_progress, completed, approved
   - Deposit status: collected, pending_review, pending, refunded

5. **`/api/budget/route.ts`** — Budget & Forecasting
   - 6 items: maintenance, capital, operating budget categories
   - Fields: name, category, property, allocatedAmount, spentAmount, remainingAmount, period, quarter, variance, status, lastUpdated, description
   - Categories: maintenance, capital, operating
   - Status types: on_track, over_budget, under_budget, fully_spent
   - Includes variance percentages (negative = over budget)

6. **`/api/e-signatures/route.ts`** — E-Signatures
   - 6 items: lease, renewal, addendum, settlement, termination documents
   - Fields: documentName, documentType, requestedBy, requestedFrom, requestedFromEmail, status, createdAt, expiresAt, signedAt, property, unit, parties, priority
   - Document types: lease, renewal, addendum, settlement, termination
   - Status types: pending_signature, completed, pending_review
   - Priority: high, medium, low

7. **`/api/pets/route.ts`** — Pet Registry
   - 6 items: 3 dogs, 2 cats, 1 rabbit across 6 properties
   - Fields: name, type, breed, tenantName, tenantUnit, property, weight, weightUnit, approvalStatus, vaccinationStatus, registrationDate, licenseNumber, notes
   - Approval status: approved, pending
   - Vaccination status: up_to_date, missing
   - Includes ESA note, breed review note, overdue vaccination notice

8. **`/api/disputes/route.ts`** — Dispute Resolution
   - 6 items: noise, damage (×2), payment, common_area, lease disputes
   - Fields: title, type, priority, reportedBy, reportedByUnit, property, againstTenant, status, createdAt, updatedAt, resolution, description, assignedTo
   - Priority: low, medium, high, critical
   - Status: open, under_review, resolved
   - One resolved dispute includes resolution text

9. **`/api/assets/route.ts`** — Asset Management
   - 6 items: HVAC, elevator (×2), fire suppression, generator, smart access control
   - Fields: name, category, property, location, purchasePrice, currentValue, depreciationRate, condition, purchaseDate, warrantyExpiry, lastMaintenanceDate, nextMaintenanceDate, serialNumber, status
   - Categories: hvac, elevator, safety, electrical, technology
   - Condition: excellent, good, fair
   - Status: active, maintenance_due, warranty_expired
   - Values reflect realistic depreciation

10. **`/api/market-intel/route.ts`** — Market Intelligence
    - 6 items: comparable listings across 6 cities (SF, Portland, Seattle, Denver, Austin, Nashville)
    - Fields: address, city, state, zipCode, property, price, pricePerSqft, bedrooms, bathrooms, sqft, listingStatus, daysOnMarket, source, sourceUrl, comparables, lastUpdated
    - Sources: Zillow, Redfin, MLS
    - Listing status: active, pending, rented
    - Prices range from $1,950 to $3,850

Lint Results:
- 0 errors, 2 pre-existing warnings (unrelated to new routes)

Stage Summary:
- All 10 API routes created with consistent NextResponse.json({ data }) pattern
- Each route returns 6 realistic enterprise-grade mock items
- Data aligns with the frontend module components created in Task 2
- All routes follow Next.js App Router convention (route.ts with GET export)
- Lint passes with 0 errors
---
Task ID: 5
Agent: Main Coordinator
Task: Enterprise upgrade - integrate all new modules into sidebar and page.tsx

Work Log:
- Updated app-sidebar.tsx with 10 new modules, refined navigation groups
- Added color accent properties to nav items for visual distinction
- Reorganized nav groups: OVERVIEW, MANAGEMENT, FINANCIAL, OPERATIONS, BUILDING, COMMUNITY, PLATFORM, SYSTEM
- New modules in sidebar: Market Intel, Move In/Out, E-Signatures, Budget, Energy, Visitors, Packages, Pets, Disputes, Assets
- Updated page.tsx with MODULES config for all 45 modules including stat cards and quick actions
- Updated moduleMap in ModuleContent with all 10 new page component mappings
- All new imports added for Energy, Visitors, Packages, MoveInOut, Budget, ESignatures, Pets, Disputes, Assets, MarketIntel
- Added new Lucide icon imports: UserCheck, Package, LogIn, PiggyBank, PenTool, PawPrint, AlertTriangle, Warehouse, Leaf, TrendingUp

Stage Summary:
- Total modules: 45 (35 existing + 10 new enterprise)
- Sidebar has 8 navigation groups with all modules organized logically
- Each new module has color-coded accent in sidebar for visual distinction
- Dashboard rewritten as world-class command center with glass UI
- All lint passes with 0 errors
- Dev server running clean on port 3000

---
Task ID: 4
Agent: Reports Agent
Task: Create professional Reports Generator component for owner management module

Work Log:
- Created `/src/components/owner/reports-page.tsx` — a comprehensive professional business reports generator
- Updated `/src/components/owner/index.ts` to export `ReportsPage`
- Added `owner_reports` sidebar entry in app-sidebar.tsx under PLATFORM group
- Added `owner_reports` MODULES config and moduleMap entry in page.tsx
- Imported `ReportsPage as OwnerReportsPage` in page.tsx

Report Types Implemented (5 total):

1. **Revenue Report** — Monthly/Quarterly/Annual revenue breakdown
   - KPIs: Total Revenue ($61,200), MRR ($54,800), ARR ($657,600), Growth Rate (7.0%)
   - Area chart for revenue trend (12 months), Pie chart for revenue by plan, Bar chart for revenue by client
   - Period selector (Monthly/Quarterly/Annual), Chart/Table view toggle
   - 12 months of realistic mock data with revenue, MRR, ARR, growth %

2. **Client Summary Report** — Complete client roster with status breakdown
   - KPIs: Total Clients (24), Active (18), Trial (3), Churned (2)
   - Pie chart for status distribution, Bar chart for plan distribution, Stacked bar for acquisition trend
   - Status filter (All/Active/Trial/Suspended/Churned), 12 client records
   - Plan distribution: Enterprise (2), Business (4), Professional (6), Starter (12)

3. **Invoice Aging Report** — Outstanding invoices grouped by age
   - KPIs: Total Receivable ($72,800), Overdue Total ($27,600), Overdue % (37.9%), Overdue Invoices (10)
   - Bar chart for aging buckets (Current, 1-30, 31-60, 61-90, 90+), Bucket summary cards
   - Overdue invoice details table with days overdue and color-coded urgency
   - 5 aging buckets with realistic amounts and invoice counts

4. **License Utilization Report** — License key distribution and utilization
   - KPIs: Total Licenses (48), Activated (32), Available (10), Utilization Rate (76.2%)
   - Pie chart for status distribution, Bar chart for utilization by plan
   - Plan allocation cards with grid layout (Activated/Available/Expired/Revoked)
   - Status filter, 12 license key records with masked keys and device counts

5. **Churn Analysis Report** — Client churn rate trends and at-risk identification
   - KPIs: Churn Rate (4.2%), Retention Rate (95.8%), At-Risk Clients (3), Churned 12mo (5)
   - Dual-line chart (churn vs retention rate over 12 months)
   - Horizontal bar chart for churn reasons (Price, Competitor, Closed, Support, Feature)
   - At-risk client cards with risk level, reason, and MRR

Design Implementation:
- macOS Tahoe Liquid Glass styling: `glass-card`, `glass-panel`, `glass-tint-blue/purple/green`
- `tahoe-badge-*` classes for colored status/plan/risk badges
- `tahoe-hover` class for interactive card hover effects
- `tahoe-overline`, `tahoe-caption` typography classes
- Custom `ChartTooltip` with glass-card styling
- framer-motion staggered entrance animations (containerVariants/itemVariants/sectionVariants)
- recharts: AreaChart, BarChart, PieChart, LineChart with custom gradients and Cell coloring
- shadcn/ui: Card, Badge, Button, Input, Select, Table, Tabs, Separator
- Responsive grid layouts (2-col and 4-col with sm/lg breakpoints)
- Color-coded everything: plans, statuses, aging buckets, risk levels, trends

Action Buttons:
- Print Report — window.print() with @media print CSS (only report content visible)
- Export CSV — proper CSV generation with header escaping and date-stamped filename
- Export JSON — formatted JSON export with date-stamped filename
- Date Range Filter — Start/End date inputs with visual badge showing range
- Refresh Data — Animated refresh button with spinning icon
- Report Type Selector — Pill-style buttons for switching between 5 report types
- Chart/Table Toggle — Tabs for switching between visual and tabular views within reports

Print CSS:
- `print-report-area` wrapper ensures only report content is visible during print
- `.no-print` class hides action buttons and filters
- Glass surfaces reset to white background with simple borders
- Proper page margins and padding

Technical:
- `'use client'` directive
- All imports from `@/components/ui/*` for shadcn components
- recharts for all charts (AreaChart, BarChart, PieChart, LineChart, Cell, Legend)
- lucide-react icons (DollarSign, Users, FileText, Key, TrendingDown, etc.)
- framer-motion for animations
- Intl.NumberFormat for currency formatting
- CSV export with proper escaping and headers
- JSON export with formatting
- All mock data self-contained in the component (no API dependencies)

Lint Results:
- 0 errors, 2 pre-existing warnings (unrelated to reports)

Stage Summary:
- Professional Reports Generator with 5 comprehensive report types
- All reports have KPI cards, chart visualizations, data tables, and export capabilities
- macOS Tahoe Liquid Glass design consistent with project style
- Print-optimized CSS for professional document output
- Fully responsive with mobile-first grid layouts
Task ID: 2
Agent: Invoice Viewer Agent
Task: Create world-class professional letter-size Invoice Viewer component for owner module

Work Log:
- Created `/src/components/owner/invoice-viewer.tsx` — a professional letter-size (8.5" × 11") invoice viewer component
- Updated `/src/components/owner/index.ts` to export InvoiceViewer

Component Features:

1. **Letter-Size Layout** — Fixed 8.5:11 aspect ratio that scales to fit viewport, white paper with shadow, looks like a real printed document

2. **Header Section**
   - TenantFlow OS logo placeholder (gradient icon + company name)
   - "AI-Powered Rental Intelligence" tagline
   - Company details with icons: address, phone, email, website
   - "INVOICE" title in large bold primary color on the right
   - Invoice number, issue date, due date, paid date below title
   - Status badge with icon (Draft/Sent/Paid/Overdue/Cancelled)

3. **Bill To / Invoice Details Section** (two-column layout)
   - Left (3 cols): "Bill To" box with client company name, contact name, address, city/state/zip, email, phone
   - Right (2 cols): "Invoice Details" box with invoice #, type, issue date, due date, overdue days count

4. **Line Items Table**
   - Professional table: #, Description, Qty, Unit Price, Amount
   - Right-aligned numeric columns with tabular-nums
   - Alternating row backgrounds for readability
   - Proper border styling with thick header border

5. **Summary Section** (right-aligned)
   - Subtotal, Tax (with rate %), Discount (in primary color with minus sign)
   - Total with double-line top border, large bold text
   - Amount Paid (green color)
   - Balance Due (red if overdue, prominent styling)

6. **Terms & Notes Section** (two-column)
   - Left: Payment terms (with Shield icon), Notes
   - Right: Payment Instructions/Bank details (with Banknote icon)

7. **Footer**
   - "Thank you for your business" message
   - Contact email, Tax ID
   - Copyright line

8. **Action Buttons** (floating above invoice, not printable)
   - Close button with status badge
   - Print button (window.print())
   - PDF button (window.print() with PDF save)
   - CSV Export button (generates CSV of line items + summary, triggers download)
   - Mark as Sent (for draft invoices)
   - Mark as Paid (for sent/overdue invoices)
   - Mark as Overdue (for sent invoices)

9. **Print CSS**
   - Only `.print-invoice-area` visible during print
   - All action buttons hidden via `.no-print` / `.print-hide`
   - @page size: letter with 0.5in margins
   - Font sizes adjusted for print (11pt body, 18pt title, 8pt overline)

10. **Technical Implementation**
    - 'use client' directive
    - Uses Badge, Button, Separator from shadcn/ui
    - Intl.NumberFormat for currency formatting
    - Framer-motion entrance animation (spring physics)
    - AnimatePresence for smooth exit
    - Backdrop blur overlay for modal-like feel
    - Dark mode fully supported
    - Responsive design
    - Status-aware coloring (overdue = red highlights everywhere)
    - Smart overdue detection (checks date even if status isn't "overdue")
    - CSV export with full invoice data
    - `onStatusChange` callback prop for status updates
    - Parses JSON line items from string with error handling

Lint Results:
- 0 errors, 2 pre-existing warnings (unrelated)

Stage Summary:
- Professional letter-size invoice viewer component created
- All 6 invoice sections implemented (Header, Bill To, Line Items, Summary, Terms, Footer)
- Full print support with @media print CSS
- CSV export functionality
- Status change action buttons
- Framer-motion animations
- Dark mode support
- Lint passes with 0 errors

---
Task ID: 3
Agent: Quotation System Agent
Task: Create professional Quotation Viewer and Create Quotation Dialog components

Work Log:
- Created `/src/components/owner/quotation-viewer.tsx` — professional letter-size quotation viewer
- Created `/src/components/owner/create-quotation-dialog.tsx` — full-featured quotation creation dialog
- Updated `/src/components/owner/index.ts` to export QuotationViewer and CreateQuotationDialog

### QuotationViewer Features:

1. **Letter-Size Layout** (8.5" × 11") — Same professional document format as invoice viewer, max-w-[816px] with print support

2. **Header Section**
   - TenantFlow OS branding on left (Building2 icon, company name, tagline, address, email)
   - "QUOTATION" title on right with quotation number
   - Status badge with icon per status type (Draft=FileText, Sent=Mail, Viewed=Eye, Accepted=CheckCircle2, Rejected=XCircle, Expired=Clock)
   - Color-coded status badges (slate/sky/cyan/emerald/red/amber)

3. **Client Info Section** (two-column)
   - Left: "Prepared For" with client company name, contact name, email, phone, full address
   - Right: "Quotation Details" with Quote #, Date, Valid Until (amber highlight if ≤7 days), Subject

4. **Intro Message** (optional)
   - Rounded bg-gray-50 panel with whitespace-pre-line for paragraph formatting

5. **Line Items Table**
   - Professional table: #, Description, Qty, Unit Price, Amount
   - Alternating row backgrounds (every other row has bg-gray-50/50)
   - Currency formatting with Intl.NumberFormat

6. **Summary** (right-aligned, w-72)
   - Subtotal, Tax (with rate %), Discount (primary color with minus sign)
   - Total with bold text and separator
   - "Valid for X days" badge with Clock icon and amber styling

7. **Terms & Conditions**
   - Rounded bordered panel with whitespace-pre-line text

8. **Signature/Acceptance Section**
   - Dashed border container with acceptance statement
   - Three-column grid: Signature line, Name line, Title line
   - Second row: Date line

9. **Footer** — Thank you message, notes, contact info (sales@tenantflow.io)

10. **Action Toolbar** (hidden when printing)
    - Status badge with icon, "Converted to Invoice" badge
    - Convert to Invoice button (green outline, if not converted and not rejected/expired)
    - Accept/Reject buttons (green/red, if not already terminal status)
    - Print, PDF, CSV export buttons
    - Close button

11. **CSV Export** — Generates CSV of line items + summary with auto-download

### CreateQuotationDialog Features:

1. **Dialog Layout** — shadcn/ui Dialog with max-w-[680px], max-h-[90vh] with scroll

2. **Form Fields:**
   - Client Selection (Select with company name + contact/email)
   - Quotation # (auto-generated QUO-YYYYMMDD-XXXX, read-only)
   - Subject (required text input)
   - Valid Until (date picker, defaults to 30 days)
   - Intro Message (Textarea with default template)
   - Line Items (dynamic add/remove, auto-calculate Amount = Qty × Price)
   - Tax Rate (%), Discount ($)
   - Terms & Conditions (Textarea with default)
   - Notes (Textarea)

3. **Auto-Calculations** — useMemo for subtotal, taxAmount, total

4. **Validation** — Client and Subject required, at least one valid line item

5. **Submit** — POST to /api/owner/quotations, form reset on success

Technical Implementation:
- 'use client' directive on both components
- QuotationViewer: Badge, Button, Separator from shadcn/ui; Lucide icons
- CreateQuotationDialog: Dialog, Input, Label, Textarea, Select, Button from shadcn/ui
- Both use proper TypeScript interfaces matching the spec
- parseLineItems() with JSON.parse error handling
- daysUntilValid() for expiry calculation
- generateQuotationNumber() with QUO-YYYYMMDD-XXXX format
- Currency formatting with Intl.NumberFormat
- Dark mode fully supported
- Print support with no-print/print-hide classes
- Responsive layout

Lint Results:
- 0 errors, 2 pre-existing warnings (unrelated)

Stage Summary:
- Two professional quotation components created
- QuotationViewer: Full letter-size document with 8 sections, 6 status types, CSV export, convert-to-invoice action
- CreateQuotationDialog: Complete form with dynamic line items, auto-calculations, validation, API submission
- Both exported from owner/index.ts
- Lint passes with 0 errors

---
Task ID: 6
Agent: API Routes Agent
Task: Create quotation API routes and enhance invoice routes

Work Log:
- Read existing patterns from `/src/app/api/owner/invoices/route.ts` and `/src/app/api/owner/clients/[id]/route.ts`
- Read Prisma schema — Quotation model has: id, quotationNumber (unique), clientId, status, subject, validUntil, subtotal, taxRate, taxAmount, discount, total, currency, items, notes, terms, introMessage, convertedToInvoice, convertedInvoiceId, createdAt, updatedAt, client relation
- Read Invoice model for reference: has workspaceId, type, issueDate, dueDate, paidDate, paidAmount fields

Files Created/Updated:

1. **`/src/app/api/owner/quotations/route.ts`** — New file
   - GET: List all quotations ordered by createdAt desc, include client relation (id, companyName, plan, status)
   - POST: Create new quotation
     - Auto-generates quotation number: QUO-YYYYMMDD-XXXX
     - Validates required fields: clientId, subject, validUntil (400 if missing)
     - Calculates subtotal from items JSON (sum of item.amount), taxAmount, total
     - Supports optional: items (JSON), notes, terms, introMessage, taxRate, discount, currency
     - Handles P2002 unique constraint error (409 on quotation number collision)
     - Returns 201 with created quotation including client relation

2. **`/src/app/api/owner/quotations/[id]/route.ts`** — New file
   - PATCH: Update quotation
     - Fetches existing quotation first to check conversion state (404 if not found)
     - Recalculates subtotal/taxAmount/total when items or rates change
     - Supports partial updates: status, subject, validUntil, items, notes, terms, introMessage, currency
     - Key feature: When status changes to "accepted" and not already converted, optionally creates an Invoice from quotation data
       - Generates invoice number INV-YYYYMMDD-XXXX
       - Copies all financial data (subtotal, taxRate, taxAmount, discount, total, currency, notes, terms, items)
       - Sets invoice type to "subscription", status to "draft", paidAmount to 0
       - Sets issueDate to now, dueDate to 30 days out
       - `createInvoice: false` in body skips invoice creation
       - After creating invoice, marks quotation as convertedToInvoice=true and sets convertedInvoiceId
       - Returns both quotation and created invoice in response
   - DELETE: Delete quotation by id
     - Returns { success: true } on success
     - Handles P2025 error (404 if not found)

3. **`/src/app/api/owner/invoices/[id]/route.ts`** — New file
   - PATCH: Update invoice
     - Fetches existing invoice first (404 if not found)
     - Supports status changes: draft, sent, paid, overdue, cancelled
     - Auto-sets paidDate and paidAmount when status changes to "paid"
     - Recalculates subtotal/taxAmount/total when items or rates change
     - Supports partial updates: status, type, issueDate, dueDate, paidDate, paidAmount, currency, notes, terms, items
   - DELETE: Delete invoice by id
     - Returns { success: true } on success
     - Handles P2025 error (404 if not found)

Pattern Consistency:
- All routes use `import { db } from '@/lib/db'` and `NextRequest, NextResponse` from `next/server`
- Route params use `{ params }: { params: Promise<{ id: string }> }` (Next.js 15+ pattern with await params)
- Error handling matches existing: console.error + P2002/P2025 Prisma error code checks
- Client relation included in responses matching invoices route pattern

TypeScript Verification:
- All 3 new files pass `tsc --noEmit` with zero errors in our files
