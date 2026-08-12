import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: RouteContext) {
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

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 })
  }

  const data = body as Record<string, unknown>

  const name = typeof data.name === 'string' ? data.name.trim() : existing.name
  const price = typeof data.price === 'number' ? data.price : existing.price
  const description =
    typeof data.description === 'string' ? data.description.trim() : existing.description
  const images = Array.isArray(data.images) ? data.images : (() => { try { return JSON.parse(existing.images as string) } catch { return [] } })()
  const isFeatured = typeof data.isFeatured === 'boolean' ? data.isFeatured : existing.isFeatured
  const inHeroLoop = typeof data.inHeroLoop === 'boolean' ? data.inHeroLoop : existing.inHeroLoop
  const categorySlug =
    typeof data.categorySlug === 'string' ? data.categorySlug.trim() : existing.categorySlug

  if (categorySlug !== existing.categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada.' }, { status: 400 })
    }
  }

  let stockQuantity = existing.stockQuantity ?? 10
  if (typeof data.stockQuantity === 'number') {
    stockQuantity = data.stockQuantity
  } else if (data.stockQuantity !== undefined && data.stockQuantity !== null) {
    const parsed = parseInt(String(data.stockQuantity), 10)
    if (!isNaN(parsed)) stockQuantity = parsed
  }

  const finalInStock = typeof data.inStock === 'boolean' ? data.inStock : stockQuantity > 0

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      stockQuantity,
      description,
      images: JSON.stringify(images),
      isFeatured,
      inStock: finalInStock,
      inHeroLoop,
      categorySlug,
    },
    include: { category: true },
  })

  revalidatePath('/', 'layout')
  revalidatePath('/tienda')
  revalidatePath(`/producto/${updated.slug}`)

  return NextResponse.json({ product: updated })
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const { id } = await context.params

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 })
  }

  await prisma.product.delete({ where: { id } })

  revalidatePath('/', 'layout')
  revalidatePath('/tienda')

  return NextResponse.json({ ok: true })
}
