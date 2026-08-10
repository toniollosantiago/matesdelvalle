import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const { id } = await context.params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 })
  }

  // Si el pedido ya estaba vendido y se elimina, se restaura el stock
  if (order.status === 'sold') {
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

  // Eliminar el pedido (fantasma / cancelado)
  await prisma.order.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
