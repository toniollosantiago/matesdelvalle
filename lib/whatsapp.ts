import { CartItem } from './cart-store'
import { formatPrice } from './format'

export function generateWhatsAppLink(
  items: CartItem[],
  total: number,
  whatsappNumber: string,
  customerData?: { name?: string; phone?: string; email?: string; note?: string }
): string {
  let message = '¡Hola Mates del Valle! Me gustaría realizar el siguiente pedido:\n\n'

  if (customerData?.name) {
    message += `👤 *Cliente:* ${customerData.name}\n`
  }
  if (customerData?.phone) {
    message += `📞 *Teléfono:* ${customerData.phone}\n`
  }
  if (customerData?.email) {
    message += `✉️ *Email:* ${customerData.email}\n`
  }
  if (customerData?.name || customerData?.phone || customerData?.email) {
    message += '\n'
  }

  message += '📦 *Productos:* \n'
  items.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} (${formatPrice(item.price)})\n`
  })

  message += `\n💰 *Total:* ${formatPrice(total)}\n`

  if (customerData?.note) {
    message += `📝 *Nota:* ${customerData.note}\n`
  }

  message += '\n¿Me confirmarían disponibilidad y opciones de pago/envío? ¡Gracias!'

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
}
