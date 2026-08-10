import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (process.env.VERCEL) {
    const dbUrl = process.env.DATABASE_URL || ''
    const pool = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      max: 10,
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }

  const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
