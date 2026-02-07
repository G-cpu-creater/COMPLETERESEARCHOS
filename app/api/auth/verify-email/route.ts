import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setAuthCookie } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      // Already verified — just log them in
      await setAuthCookie(user.id)
      return NextResponse.json({ success: true, message: 'Email already verified' })
    }

    if (!user.verifyCode || !user.verifyExpiry) {
      return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 })
    }

    if (new Date() > user.verifyExpiry) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
    }

    if (user.verifyCode !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // ✅ Code is correct — mark verified, clear code, set cookie
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyCode: null,
        verifyExpiry: null,
      },
    })

    await setAuthCookie(user.id)

    // Send welcome email (don't block on this)
    sendWelcomeEmail(user.email, user.name || undefined).catch((err) => {
      console.error('Failed to send welcome email:', err)
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
