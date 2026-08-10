'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/format'
import { CheckCircle, Clock, ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react'

type OrderItem = {
  id: string
  productName: string
  productPrice: number
  quantity: number
}

type Order = {
  id: string
  orderNumber?: number
  createdAt: Date | string
  status: string
  total: number
  clientNote: string | null
  items: OrderItem[]
}

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)

  // Auto-refresco en tiempo real cada 5 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/orders')
        if (res.ok) {
          const data = await res.json()
          if (data.orders) {
            setOrders(data.orders)
          }
        }
      } catch (err) {
        console.error('Error al auto-actualizar pedidos:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  function formatOrderCode(order: Order, index: number) {
    if (order.orderNumber) {
      return `#${order.orderNumber.toString().padStart(4, '0')}`
    }
    const num = orders.length - index
    return `#${num.toString().padStart(4, '0')}`
  }

  async function confirmDeleteOrder() {
    if (!orderToDelete) return
    const orderId = orderToDelete.id
    setLoadingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      setOrderToDelete(null)
    } catch {
      alert('No se pudo eliminar el pedido.')
    } finally {
      setLoadingId(null)
    }
  }

  async function toggleStatus(order: Order) {
    const newStatus = order.status === 'pending' ? 'sold' : 'pending'
    setLoadingId(order.id)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Error al actualizar')

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      )
    } catch {
      alert('No se pudo actualizar el estado. Intentá de nuevo.')
    } finally {
      setLoadingId(null)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
        <p className="text-gray-400 text-sm">Todavía no hay pedidos registrados.</p>
        <p className="text-gray-400 text-xs mt-1">
          Los pedidos se registran automáticamente cuando un cliente toca "Realizar Pedido".
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order, idx) => {
        const isExpanded = expandedId === order.id
        const isPending = order.status === 'pending'
        const isLoading = loadingId === order.id
        const date = new Date(order.createdAt)
        const orderCode = formatOrderCode(order, idx)

        return (
          <div
            key={order.id}
            className={`bg-white rounded-2xl border transition-all ${
              isPending ? 'border-amber-200 shadow-sm' : 'border-gray-200'
            }`}
          >
            {/* Header row */}
            <div className="flex items-center gap-3 p-4">
              {/* Order Number Badge */}
              <span className="font-mono font-extrabold text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg shrink-0">
                {orderCode}
              </span>

              {/* Status badge */}
              <div
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  isPending
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isPending ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                {isPending ? 'Pendiente' : 'Vendido'}
              </div>

              {/* Date + total */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">
                  {date.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="font-bold text-sm text-gray-800">
                  {formatPrice(order.total)} ARS
                  <span className="font-normal text-gray-500 ml-1.5 text-xs">
                    ({order.items.length} ítem{order.items.length !== 1 ? 's' : ''})
                  </span>
                </p>
              </div>

              {/* Toggle sold */}
              <button
                onClick={() => toggleStatus(order)}
                disabled={isLoading}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                  isPending
                    ? 'bg-[#5C663D] text-white hover:bg-[#4A3B32]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isPending ? (
                  'Marcar vendido'
                ) : (
                  'Revertir'
                )}
              </button>

              {/* Eliminar pedido fantasma */}
              <button
                onClick={() => setOrderToDelete(order)}
                disabled={isLoading}
                className="shrink-0 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Eliminar pedido (Fantasma / Cancelado)"
                aria-label="Eliminar pedido"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Expand toggle */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                aria-label="Ver detalle"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline text-sm">
                    <span className="text-gray-700">
                      <span className="font-bold text-gray-400 mr-1.5">{item.quantity}×</span>
                      {item.productName}
                    </span>
                    <span className="font-bold text-gray-700 text-xs">
                      {formatPrice(item.productPrice * item.quantity)} ARS
                    </span>
                  </div>
                ))}
                {order.clientNote && (
                  <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-2 mt-2">
                    {order.clientNote}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Mini ventana / Modal flotante para confirmar eliminación de pedido */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-800">¿Eliminar este pedido?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Vas a eliminar el pedido{' '}
                <strong className="text-gray-700">
                  {formatOrderCode(orderToDelete, 0)}
                </strong>{' '}
                por <strong>{formatPrice(orderToDelete.total)} ARS</strong>. Esta acción borrará el registro de la lista.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Conservar
              </button>
              <button
                onClick={confirmDeleteOrder}
                disabled={loadingId === orderToDelete.id}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {loadingId === orderToDelete.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
