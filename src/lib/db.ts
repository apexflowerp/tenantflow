import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url,
      },
    },
    // Neon serverless Postgres works best with a reasonable connection limit
    // and shorter timeouts to avoid stale connections
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
