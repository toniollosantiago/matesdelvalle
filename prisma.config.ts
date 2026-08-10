import { defineConfig } from '@prisma/config'
import dotenv from 'dotenv'

dotenv.config()

const isPostgres = process.env.DATABASE_URL?.startsWith('postgres')

export default defineConfig({
  datasource: {
    url: 'file:./dev.db',
  },
  migrations: {
    seed: "ts-node prisma/seed.ts",
  }
})
