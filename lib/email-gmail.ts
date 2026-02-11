// ─── Gmail SMTP Email Service (FREE Alternative) ────────
// Uses Gmail's SMTP to send verification emails
//
// Setup:
// 1. Enable 2FA on your Gmail account
// 2. Generate App Password: https://myaccount.google.com/apppasswords
// 3. Add to .env:
//    GMAIL_USER="your-email@gmail.com"
//    GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
// ─────────────────────────────────────────────────────────

import nodemailer from 'nodemailer'

export async function sendVerificationEmailGmail(
  email: string,
  code: string,
  name?: string,
): Promise<{ success: boolean; error?: string }> {
  const gmailUser = process.env.GMAIL_USER
  const gmailPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPassword) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📧 EMAIL VERIFICATION (dev mode)`)
    console.log(`   To: ${email}`)
    console.log(`   Code: ${code}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return { success: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    })

    await transporter.sendMail({
      from: `"ResearchOS" <${gmailUser}>`,
      to: email,
      subject: `${code} is your ResearchOS verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #111827; font-size: 24px;">ResearchOS</h1>
          <p style="color: #374151; font-size: 16px;">Hi${name ? ` ${name}` : ''},</p>
          <p style="color: #374151; font-size: 16px;">Your verification code is:</p>
          <div style="text-align: center; margin: 24px 0;">
            <div style="display: inline-block; padding: 16px 40px; background: #f3f4f6; border-radius: 12px; font-size: 32px; font-weight: 700; letter-spacing: 8px;">
              ${code}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes.</p>
        </div>
      `,
    })

    return { success: true }
  } catch (err: any) {
    console.error('Gmail send error:', err)
    return { success: false, error: err.message }
  }
}
