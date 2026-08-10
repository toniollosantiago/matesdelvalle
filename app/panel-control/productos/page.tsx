import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductsManager from '@/components/admin/ProductsManager'

export const dynamic = 'force-dynamic'

export default async function ProductosPage() {
  const session = await getAdminSession()
  if (!session) redirect('/panel-control/login')

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const productsForClient = products.map((p) => ({
    ...p,
    images: (() => {
      try { return JSON.parse(p.images as string) } catch { return [] }
    })(),
  }))

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <AdminHeader email={session.email} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ProductsManager initialProducts={productsForClient} categories={categories} />
      </main>
    </div>
  )
}
