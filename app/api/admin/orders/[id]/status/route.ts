import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const status =
    body && typeof body === 'object' && 'status' in body ? (body as { status: string }).status : null

  if (status !== 'pending' && status !== 'sold') {
    return NextResponse.json(
      { error: 'Estado inválido. Valores válidos: pending, sold.' },
      { status: 400 }
    )
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 })
  }

  const previousStatus = order.status

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  })

  // Descontar stock al marcar como vendido
  if (previousStatus === 'pending' && status === 'sold') {
    for (const item of order.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (product) {
        const newStock = Math.max(0, product.stockQuantity - item.quantity)
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: newStock,
            inStock: newStock > 0,
          },
        })
      }
    }
  }

  // Restaurar stock si se revierte de vendido a pendiente
  if (previousStatus === 'sold' && status === 'pending') {
    for (const item of order.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (product) {
        const newStock = product.stockQuantity + item.quantity
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: newStock,
            inStock: newStock > 0,
          },
        })
      }
    }
  }

  return NextResponse.json({ order: updated })
}
