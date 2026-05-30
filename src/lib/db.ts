import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Always disconnect and recreate the client to ensure the correct DATABASE_URL
// This is critical when switching between SQLite and PostgreSQL
if (globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma.$disconnect()
  } catch {}
  globalForPrisma.prisma = undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // Validate URL protocol for PostgreSQL
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    throw new Error(`DATABASE_URL must start with postgresql:// or postgres://. Got: ${url.substring(0, 30)}...`)
  }

  return new PrismaClient({
    log: ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
