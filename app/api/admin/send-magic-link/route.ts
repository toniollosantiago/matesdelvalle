import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'El acceso por Magic Link fue reemplazado por la autenticación segura por PIN.' },
    { status: 410 }
  )
}
