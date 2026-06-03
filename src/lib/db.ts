import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Neon PostgreSQL connection URL — hardcoded to prevent system env override
const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_0LaXsMl2YzBt@ep-royal-recipe-apb3473r-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'

function createPrismaClient() {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: NEON_DATABASE_URL,
      },
    },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
