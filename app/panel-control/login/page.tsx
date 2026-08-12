'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, AlertCircle, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pin.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'PIN incorrecto.')
        return
      }

      // Redirigir al panel de administración
      router.push('/panel-control')
      router.refresh()
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Intentá de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white">
            <Image src="/logo.jpg" alt="Mates del Valle" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <h1 className="font-bold text-2xl text-[#5C663D] tracking-tight">Mates del Valle</h1>
          <p className="text-sm text-gray-500 mt-1">Panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e2d8] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-[#5C663D]" />
                <h2 className="font-bold text-xl text-gray-800">Acceso Seguro</h2>
              </div>
              <p className="text-sm text-gray-500">
                Ingresá la clave PIN de administrador.
              </p>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700">{errorMsg}</p>
              </div>
            )}

            <div>
              <label htmlFor="pin" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                PIN de Administrador
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="pin"
                  type="password"
                  autoFocus
                  maxLength={12}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-[#5C663D] focus:border-transparent bg-[#fafaf9] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !pin.trim()}
              className="w-full py-3.5 bg-[#5C663D] hover:bg-[#4A5038] text-white rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</>
              ) : (
                'Ingresar al Panel'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Encriptación de grado militar (HMAC-SHA256 Timing-Safe)
        </p>
      </div>
    </div>
  )
}
