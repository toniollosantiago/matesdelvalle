import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

interface OrderItemInput {
  id: string
  quantity: number
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Rate limit: 10 orders per 15 minutes per IP
  const rl = await checkRateLimit(`orders:${ip}`, {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
  })

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Demasiados pedidos. Intentá de nuevo en unos minutos.' },
      { status: 429 }
    )
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
  const clientItems = Array.isArray(data.items) ? (data.items as OrderItemInput[]) : null
  
  const customerName = typeof data.name === 'string' ? data.name.trim().slice(0, 100) : ''
  const customerPhone = typeof data.phone === 'string' ? data.phone.trim().slice(0, 50) : ''
  const customerEmail = typeof data.email === 'string' ? data.email.trim().slice(0, 100) : ''
  const rawNote = typeof data.note === 'string' ? data.note.trim().slice(0, 300) : ''

  const clientNoteParts = []
  if (customerName) clientNoteParts.push(`Cliente: ${customerName}`)
  if (customerPhone) clientNoteParts.push(`Tel: ${customerPhone}`)
  if (customerEmail) clientNoteParts.push(`Email: ${customerEmail}`)
  if (rawNote) clientNoteParts.push(`Nota: ${rawNote}`)

  const clientNote = clientNoteParts.length > 0 ? clientNoteParts.join(' | ') : null

  if (!clientItems || clientItems.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 })
  }

  // Validate item structure
  for (const item of clientItems) {
    if (!item.id || typeof item.id !== 'string') {
      return NextResponse.json({ error: 'ID de producto inválido.' }, { status: 400 })
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 99) {
      return NextResponse.json({ error: 'Cantidad inválida.' }, { status: 400 })
    }
  }

  // Fetch products from DB or fallback catalog
  const productIds = clientItems.map((i) => i.id)
  let products: Array<{ id: string; name: string; price: number }> = []
  try {
    products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })
  } catch (err) {
    console.error('Error buscando productos en DB para orden:', err)
  }

  // Si faltan en DB, armar lista con los items provistos o nombres estáticos
  if (products.length === 0) {
    products = clientItems.map(item => ({
      id: item.id,
      name: item.id.replace(/-/g, ' ').toUpperCase(),
      price: 15000,
    }))
  }

  const productMap = new Map(products.map((p) => [p.id, p]))
  let serverTotal = 0
  const orderItems = clientItems.map((item) => {
    const product = productMap.get(item.id) || { id: item.id, name: item.id, price: 15000 }
    const lineTotal = product.price * item.quantity
    serverTotal += lineTotal
    return {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity: item.quantity,
    }
  })

  let orderId = `ord-${Date.now()}`
  let orderCode = `#${Math.floor(1000 + Math.random() * 9000)}`

  try {
    const totalOrdersCount = await prisma.order.count()
    const nextOrderNum = totalOrdersCount + 1
    orderCode = `#${nextOrderNum.toString().padStart(4, '0')}`

    const order = await prisma.order.create({
      data: {
        orderNumber: nextOrderNum,
        total: serverTotal,
        clientNote,
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    })
    orderId = order.id
  } catch (err) {
    console.error('Error creando orden en DB (continuando con notificaciones):', err)
  }

  // Enviar notificación por email vía Formspree si está configurado
  const formspreeUrl = process.env.FORMSPREE_ENDPOINT
  if (formspreeUrl && !formspreeUrl.includes('tu_form_id')) {
    const itemsList = orderItems
      .map((i) => `• ${i.quantity}x ${i.productName} ($${i.productPrice.toLocaleString('es-AR')})`)
      .join('\n')

    try {
      const resForm = await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: customerEmail || 'ventas@matesdelvalle.com',
          _replyto: customerEmail || 'ventas@matesdelvalle.com',
          _subject: `Nuevo pedido recibido (${orderCode})`,
          Cliente: customerName || 'No especificado',
          Telefono: customerPhone || 'No especificado',
          Email_Cliente: customerEmail || 'No especificado',
          Total: `$${serverTotal.toLocaleString('es-AR')} ARS`,
          Pedido_ID: orderCode,
          Fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
          Productos: itemsList,
          Notas: rawNote || 'Sin notas adicionales',
        }),
      })
      const dataForm = await resForm.json()
      console.log('[Order Formspree] Notificación enviada:', {
        status: resForm.status,
        order: orderCode,
        response: dataForm,
      })
    } catch (err) {
      console.error('[Order Formspree] Error enviando email de compra:', err)
    }
  } else {
    console.warn(
      '[Order Formspree] Notificación omitida: FORMSPREE_ENDPOINT no está configurada en este entorno.',
      { order: orderCode }
    )
  }

  return NextResponse.json({ ok: true, orderId, total: serverTotal }, { status: 201 })
}
