import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }

  const data = body as Record<string, unknown>

  const name = typeof data.name === 'string' ? data.name.trim() : null
  const slug = typeof data.slug === 'string' ? data.slug.trim() : null
  const price = typeof data.price === 'number' ? data.price : parseFloat(String(data.price))
  const categorySlug = typeof data.categorySlug === 'string' ? data.categorySlug.trim() : null
  const description = typeof data.description === 'string' ? data.description.trim() : null
  const images = Array.isArray(data.images) ? data.images : []
  const isFeatured = data.isFeatured === true
  const inStock = data.inStock !== false
  const inHeroLoop = data.inHeroLoop === true

  if (!name || !slug || isNaN(price) || !categorySlug) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos: name, slug, price, categorySlug.' },
      { status: 400 }
    )
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!category) {
    return NextResponse.json({ error: 'Categoría no encontrada.' }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un producto con ese slug.' }, { status: 409 })
  }

  const stockQuantity = typeof data.stockQuantity === 'number' ? data.stockQuantity : parseInt(String(data.stockQuantity)) || 10

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price,
      stockQuantity,
      categorySlug,
      description,
      images: JSON.stringify(images),
      isFeatured,
      inStock,
      inHeroLoop,
    },
    include: { category: true },
  })

  revalidatePath('/', 'layout')
  revalidatePath('/tienda')
  revalidatePath('/tienda/[categoria]', 'page')

  return NextResponse.json({ product }, { status: 201 })
}
