import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Neon PostgreSQL connection URL — used as fallback when env var is not set
const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10&pool_timeout=10'
const NEON_DIRECT_URL = 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10'

// Ensure process.env.DATABASE_URL is set BEFORE Prisma client is created.
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  process.env.DATABASE_URL = NEON_DATABASE_URL
}
if (!process.env.DIRECT_URL || !process.env.DIRECT_URL.startsWith('postgresql://')) {
  process.env.DIRECT_URL = NEON_DIRECT_URL
}

function createPrismaClient() {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
