import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  let orders = []
  try {
    orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error DB en /api/admin/orders:', err)
  }

  return NextResponse.json({ orders })
}
