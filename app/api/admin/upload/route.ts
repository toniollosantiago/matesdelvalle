import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo.' }, { status: 400 })
    }

    // Validar tipo de imagen
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif']
    if (!validTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Formato no soportado. Subí una imagen en JPG, PNG, WebP o AVIF.' },
        { status: 400 }
      )
    }

    // Limitar tamaño a 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen es demasiado grande (máximo 5MB).' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extensión del archivo
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileName = `prod_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`

    // Asegurar directorio public/images
    const uploadDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    const publicUrl = `/images/${fileName}`

    return NextResponse.json({ ok: true, url: publicUrl })
  } catch (err) {
    console.error('[Upload] Error guardando archivo:', err)
    return NextResponse.json({ error: 'Error al procesar la imagen.' }, { status: 500 })
  }
}
