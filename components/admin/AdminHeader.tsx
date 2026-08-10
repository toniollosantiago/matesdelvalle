'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Package, Loader2, Menu, X } from 'lucide-react'

export default function AdminHeader({ email }: { email: string }) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/panel-control/login')
    }
  }

  return (
    <header className="bg-[#5C663D] text-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Nav Links Left (Desktop) */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link
            href="/panel-control"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Pedidos</span>
          </Link>
          <Link
            href="/panel-control/productos"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Productos</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-white/10 text-white focus:outline-none"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Centered Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="font-bold text-base sm:text-lg tracking-wide uppercase">Panel Admin</span>
        </div>

        {/* User + Logout Right */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/70 hidden md:block truncate max-w-[180px]">{email}</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Cerrar sesión"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#4A5038] px-4 py-3 space-y-2 animate-fadeIn">
          <Link
            href="/panel-control"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-white/10 text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Ver Pedidos</span>
          </Link>
          <Link
            href="/panel-control/productos"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-white/10 text-white"
          >
            <Package className="w-5 h-5" />
            <span>Gestionar Productos</span>
          </Link>
          <div className="pt-2 border-t border-white/10 text-xs text-white/70 px-1">
            Sesión: {email}
          </div>
        </div>
      )}
    </header>
  )
}
