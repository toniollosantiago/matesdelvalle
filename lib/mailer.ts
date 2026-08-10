import { Resend } from 'resend'
import nodemailer from 'nodemailer'

/**
 * Sends the magic link email to the admin.
 * Uses Resend API if RESEND_API_KEY is configured, or SMTP / Formspree as fallback.
 */
export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY
  const destinationEmail = email || 'toniollosantiago582@gmail.com'

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#F5F0E8;font-family:system-ui,-apple-system,sans-serif;">
      <div style="max-width:500px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #E5DFD3;">
        <div style="background:#5C663D;padding:36px 40px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Mates del Valle</h1>
          <p style="color:#D5DDB8;margin:8px 0 0;font-size:14px;font-weight:500;">Panel de Administración</p>
        </div>
        <div style="padding:40px 32px;text-align:center;">
          <h2 style="margin:0 0 12px;color:#2B251F;font-size:18px;font-weight:700;">Acceso solicitado</h2>
          <p style="margin:0 0 28px;color:#665E55;font-size:14px;line-height:1.5;">
            Hacé click en el botón de abajo para ingresar de forma segura a tu panel de control:
          </p>
          <a href="${magicLink}"
             style="display:inline-block;background:#5D4B3E;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;box-shadow:0 2px 8px rgba(93,75,62,0.3);">
            Ingresar al Panel
          </a>
          <div style="margin-top:32px;padding-top:24px;border-t:1px solid #F0EAE0;">
            <p style="margin:0;color:#888075;font-size:12px;">⏰ Este link es válido por <strong>15 minutos</strong> y de un solo uso.</p>
            <p style="margin:6px 0 0;color:#AAA298;font-size:11px;">Si no solicitaste este acceso, podés ignorar este correo.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  // 1. Prioridad: Resend API
  if (resendApiKey) {
    try {
      console.log('[MagicLink Resend] Enviando mail a:', destinationEmail)
      const resend = new Resend(resendApiKey)
      const fromSender = process.env.RESEND_FROM_EMAIL || 'Mates del Valle <onboarding@resend.dev>'
      
      const res = await resend.emails.send({
        from: fromSender,
        to: destinationEmail,
        subject: '🔑 Link de acceso al Panel — Mates del Valle',
        html: htmlContent,
      })
      if (res.data?.id) {
        console.log('[MagicLink Resend] Enviado con éxito ID:', res.data.id)
        return
      }
      if (res.error) {
        console.warn('[MagicLink Resend] Error de Resend Sandbox:', res.error.message)
      }
    } catch (err) {
      console.error('[MagicLink Resend] Error en llamada Resend:', err)
    }
  }

  // 2. Fallback: Formspree (Envía directo al mail configurado de administración)
  const formspreeUrl = process.env.FORMSPREE_ENDPOINT
  if (formspreeUrl) {
    try {
      console.log('[MagicLink Formspree] Enviando a:', destinationEmail)
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: destinationEmail,
          _replyto: destinationEmail,
          _subject: '🔑 Link de acceso al Panel Admin — Mates del Valle',
          Acceso: magicLink,
          Mensaje: 'Hacé click en el enlace para ingresar al panel de administración.',
          Nota: 'El enlace expira en 15 minutos.',
        }),
      })
      console.log('[MagicLink Formspree] Enviado con éxito')
      return
    } catch (err) {
      console.error('[MagicLink Formspree] Error:', err)
    }
  }

  // Console log fallback en desarrollo
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔗 MAGIC LINK GENERADO:')
  console.log(magicLink)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}
