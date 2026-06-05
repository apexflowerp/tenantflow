import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Neon PostgreSQL connection URL — used as fallback when env var is not set
// This ensures the app works even if Vercel env vars are not configured yet
const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10&pool_timeout=10'
const NEON_DIRECT_URL = 'postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10'

// Ensure process.env.DATABASE_URL is set BEFORE Prisma client is created.
// On Vercel, env vars should be set in the project settings. The fallback
// ensures the app works during initial setup or local development.
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  process.env.DATABASE_URL = NEON_DATABASE_URL
}
if (!process.env.DIRECT_URL || !process.env.DIRECT_URL.startsWith('postgresql://')) {
  process.env.DIRECT_URL = NEON_DIRECT_URL
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// In production (Vercel serverless), we DON'T cache the client globally
// to avoid connection pool issues with Neon's serverless driver.
// In development, we cache to avoid hot-reload connection spam.
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
