'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      router.replace('/panel-control/login?error=missing')
      return
    }

    // Redirect to the API route which handles the actual validation
    window.location.href = `/api/admin/auth/callback?token=${token}`
  }, [router, searchParams])

  return (
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-[#5C663D] mx-auto" />
      <p className="text-sm text-gray-500">Verificando acceso...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#5C663D] mx-auto" />
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </div>
  )
}
