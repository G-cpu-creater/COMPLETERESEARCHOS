// ─── Email Service ───────────────────────────────────────
// This module sends verification emails.
// Supports Gmail SMTP (free) or Resend.
//
// Method 1 - Gmail SMTP (FREE, 500 emails/day):
// 1. Enable 2FA on Gmail
// 2. Generate App Password: https://myaccount.google.com/apppasswords
// 3. Add to .env:
//      GMAIL_USER="your-email@gmail.com"
//      GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
//
// Method 2 - Resend (100 emails/day, requires domain for production):
// 1. Sign up at resend.com
// 2. Add to .env:
//      RESEND_API_KEY="re_xxxxxxxxxxxx"
//      EMAIL_FROM="ResearchOS <onboarding@resend.dev>"
// ─────────────────────────────────────────────────────────

import nodemailer from 'nodemailer'

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getVerificationExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
}

export async function sendVerificationEmail(
  email: string,
  code: string,
  name?: string,
): Promise<{ success: boolean; error?: string }> {
  const gmailUser = process.env.GMAIL_USER
  const gmailPassword = process.env.GMAIL_APP_PASSWORD
  const resendKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'ResearchOS <onboarding@resend.dev>'

  // ── Method 1: Gmail SMTP (preferred if configured) ──
  if (gmailUser && gmailPassword) {
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
        html: getEmailHTML(code, name),
      })

      console.log(`✅ Email sent via Gmail to ${email}`)
      return { success: true }
    } catch (err: any) {
      console.error('Gmail send error:', err)
      return { success: false, error: err.message }
    }
  }

  // ── Method 2: Resend API ──
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: `${code} is your ResearchOS verification code`,
          html: getEmailHTML(code, name),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Resend API error:', err)
        return { success: false, error: err.message || 'Failed to send email' }
      }

      console.log(`✅ Email sent via Resend to ${email}`)
      return { success: true }
    } catch (err: any) {
      console.error('Resend send error:', err)
      return { success: false, error: err.message }
    }
  }

  // ── Dev mode: No email service configured ──
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📧 EMAIL VERIFICATION (dev mode — no email service configured)`)
  console.log(`   To: ${email}`)
  console.log(`   Code: ${code}`)
  console.log(`   Expires in 10 minutes`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  return { success: true }
}

function getEmailHTML(code: string, name?: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 48px; height: 48px; background: #2563eb; border-radius: 12px; line-height: 48px; text-align: center;">
          <span style="color: white; font-size: 24px;">⚡</span>
        </div>
        <h1 style="color: #111827; font-size: 24px; margin: 16px 0 4px;">ResearchOS</h1>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Hi${name ? ` ${name}` : ''},
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Your verification code is:
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; padding: 16px 40px; background: #f3f4f6; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: 700; color: #111827;">
          ${code}
        </div>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        This code expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        ResearchOS — Electrochemical Research Platform
      </p>
    </div>
  `
}

export async function sendWelcomeEmail(
  email: string,
  name?: string,
): Promise<{ success: boolean; error?: string }> {
  const gmailUser = process.env.GMAIL_USER
  const gmailPassword = process.env.GMAIL_APP_PASSWORD
  const resendKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'ResearchOS <onboarding@resend.dev>'

  // ── Method 1: Gmail SMTP (preferred if configured) ──
  if (gmailUser && gmailPassword) {
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
        subject: 'Welcome to ResearchOS! 🎉',
        html: getWelcomeEmailHTML(name),
      })

      console.log(`✅ Welcome email sent via Gmail to ${email}`)
      return { success: true }
    } catch (err: any) {
      console.error('Gmail welcome email error:', err)
      return { success: false, error: err.message }
    }
  }

  // ── Method 2: Resend API ──
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: 'Welcome to ResearchOS! 🎉',
          html: getWelcomeEmailHTML(name),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Resend welcome email error:', err)
        return { success: false, error: err.message || 'Failed to send welcome email' }
      }

      console.log(`✅ Welcome email sent via Resend to ${email}`)
      return { success: true }
    } catch (err: any) {
      console.error('Resend welcome email error:', err)
      return { success: false, error: err.message }
    }
  }

  // ── Dev mode: No email service configured ──
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📧 WELCOME EMAIL (dev mode)`)
  console.log(`   To: ${email}`)
  console.log(`   Subject: Welcome to ResearchOS! 🎉`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  return { success: true }
}

function getWelcomeEmailHTML(name?: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(to bottom, #f8fafc, #ffffff);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 16px; line-height: 64px; text-align: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
          <span style="color: white; font-size: 32px;">⚡</span>
        </div>
        <h1 style="color: #111827; font-size: 32px; font-weight: 800; margin: 20px 0 8px; letter-spacing: -0.5px;">Welcome to ResearchOS!</h1>
        <p style="color: #6b7280; font-size: 16px; margin: 0;">Your electrochemical research platform</p>
      </div>

      <!-- Welcome Message -->
      <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); margin-bottom: 24px;">
        <p style="color: #111827; font-size: 18px; line-height: 1.6; margin: 0 0 16px;">
          Hi${name ? ` ${name}` : ''},
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 16px;">
          Your email has been <strong style="color: #2563eb;">successfully verified</strong>! 🎉
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0;">
          You now have full access to ResearchOS – the all-in-one platform designed specifically for electrochemical researchers.
        </p>
      </div>

      <!-- Features -->
      <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 20px;">What you can do now:</h2>

        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="font-size: 18px;">📊</span>
            </div>
            <div>
              <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 4px;">Organize Your Research</h3>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">Create projects, upload datasets, and keep all your electrochemical data in one place.</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="font-size: 18px;">📈</span>
            </div>
            <div>
              <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 4px;">Visualize Your Data</h3>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">Generate publication-ready plots with our specialized electrochemistry visualization tools.</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="font-size: 18px;">🤖</span>
            </div>
            <div>
              <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 4px;">AI-Powered Analysis</h3>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">Get insights from your data with AI assistance tailored for electrochemical research.</p>
            </div>
          </div>
        </div>

        <div>
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="font-size: 18px;">📚</span>
            </div>
            <div>
              <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 4px;">Manage References</h3>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">Keep track of papers, extract key information, and organize your literature review.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
          Go to Dashboard →
        </a>
      </div>

      <!-- Help Section -->
      <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
          <strong style="color: #111827;">Need help getting started?</strong>
        </p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
          Check out our documentation or reach out to our support team – we're here to help you accelerate your research.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
          ResearchOS — Electrochemical Research Platform
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ResearchOS. All rights reserved.
        </p>
      </div>
    </div>
  `
}
