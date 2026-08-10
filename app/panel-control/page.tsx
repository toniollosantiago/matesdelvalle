import { getAdminSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import AdminHeader from '@/components/admin/AdminHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getAdminSession()
  if (!session) redirect('/panel-control/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let totalPending = 0
  let soldThisMonth = 0
  let outOfStockCount = 0
  let recentOrders: Array<{
    id: string;
    orderNumber: number;
    createdAt: Date;
    status: string;
    total: number;
    clientNote: string | null;
    items: Array<{ id: string; orderId: string; productId: string; productName: string; productPrice: number; quantity: number }>;
  }> = []

  try {
    const res = await Promise.all([
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'sold', createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({
        where: { status: 'sold', createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      prisma.product.count({ where: { inStock: false } }),
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])
    totalPending = res[0]
    soldThisMonth = res[1]
    outOfStockCount = res[3]
    recentOrders = res[4]
  } catch (err) {
    console.error('Advertencia DB al cargar métricas del Panel Admin:', err)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <AdminHeader email={session.email} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            icon={<ShoppingBag className="w-5 h-5" />}
            label="Pendientes"
            value={String(totalPending)}
            color="amber"
            urgent={totalPending > 0}
          />
          <MetricCard
            icon={<Package className="w-5 h-5" />}
            label="Vendidos este mes"
            value={String(soldThisMonth)}
            color="green"
          />
          <MetricCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Sin stock"
            value={String(outOfStockCount)}
            color={outOfStockCount > 0 ? 'red' : 'green'}
            urgent={outOfStockCount > 0}
          />
        </div>

        {/* Out of stock alert */}
        {outOfStockCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                {outOfStockCount} producto{outOfStockCount > 1 ? 's' : ''} sin stock.
              </p>
            </div>
            <Link href="/panel-control/productos" className="text-xs font-bold text-amber-700 underline whitespace-nowrap hover:opacity-70">
              Ver productos
            </Link>
          </div>
        )}

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          <Link href="/panel-control/productos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5C663D] text-white rounded-xl text-sm font-bold hover:bg-[#4A5038] transition-colors shadow-sm">
            <Package className="w-4 h-4" />
            Gestionar Productos
          </Link>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
            Ver sitio publico
          </Link>
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-4">Pedidos recientes</h2>
          <OrdersTable initialOrders={recentOrders} />
        </div>
      </main>
    </div>
  )
}

function MetricCard({ icon, label, value, color, urgent }: {
  icon: React.ReactNode; label: string; value: string
  color: 'amber' | 'green' | 'blue' | 'red'; urgent?: boolean
}) {
  const colors = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]} ${urgent ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
      <div className="flex items-center gap-2 mb-3 opacity-70">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-extrabold text-2xl tracking-tight">{value}</p>
    </div>
  )
}
