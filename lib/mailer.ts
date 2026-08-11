import { Resend } from 'resend'

/**
 * Sends the magic link email to the admin via Resend.
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

  if (!resendApiKey) {
    console.warn('[MagicLink Resend] RESEND_API_KEY no está configurada. El email NO fue enviado a', destinationEmail)
    return
  }

  try {
    const resend = new Resend(resendApiKey)
    const fromSender = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const res = await resend.emails.send({
      from: fromSender,
      to: destinationEmail,
      subject: '🔑 Link de acceso al Panel — Mates del Valle',
      html: htmlContent,
    })

    if (res.error) {
      console.error('[MagicLink Resend] Resend devolvió un error para', destinationEmail, ':', {
        name: res.error.name,
        message: res.error.message,
        statusCode: res.error.statusCode,
      })
      return
    }

    console.log('[MagicLink Resend] Email enviado OK:', { id: res.data?.id, to: destinationEmail, from: fromSender })
  } catch (err) {
    console.error('[MagicLink Resend] Error al enviar email con Resend:', err)
  }
}
