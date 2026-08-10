'use client'

import { useState } from 'react'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [directLink, setDirectLink] = useState('')

  // Token error from URL (handled client-side for simplicity)
  // We'll handle it via the form state

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.status === 429) {
        setStatus('error')
        setErrorMsg('Demasiados intentos. Esperá unos minutos.')
        return
      }

      const data = await res.json()
      if (data.magicLink) {
        setDirectLink(data.magicLink)
      }
      setStatus('sent')
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
          {status === 'sent' ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-[#eef1e6] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-[#5C663D]" />
              </div>
              <h2 className="font-bold text-lg text-gray-800">Enlace listo</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Se envió la notificación a tu correo y tenés el acceso directo habilitado aquí abajo:
              </p>

              {directLink && (
                <div className="pt-2">
                  <a
                    href={directLink}
                    className="w-full py-3 px-4 bg-[#5C663D] hover:bg-[#4B5432] text-white rounded-xl font-bold text-sm tracking-wide transition-all block text-center shadow-md"
                  >
                    🚀 Entrar al Panel de Control Ahora
                  </a>
                </div>
              )}
              <button
                onClick={() => setStatus('idle')}
                className="text-xs text-[#5D4B3E] underline hover:opacity-70 transition-opacity"
              >
                Volver a intentar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="font-bold text-xl text-gray-800 mb-1">Acceder</h2>
                <p className="text-sm text-gray-500">
                  Ingresá tu email para recibir un link de acceso seguro.
                </p>
              </div>

              {(status === 'error') && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-700">{errorMsg || 'El link expiró o ya fue usado.'}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C663D] focus:border-transparent bg-[#fafaf9] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-[#5D4B3E] hover:bg-[#4A3B32] text-white rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  'Enviar link de acceso'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Solo para uso interno — Mates del Valle
        </p>
      </div>
    </div>
  )
}
