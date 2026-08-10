import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ orders })
}
