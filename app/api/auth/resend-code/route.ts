import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, getVerificationExpiry, sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
    }

    // Rate limit: don't resend if last code was sent < 60s ago
    if (user.verifyExpiry) {
      const lastSent = new Date(user.verifyExpiry.getTime() - 10 * 60 * 1000) // when it was created
      const secondsSince = (Date.now() - lastSent.getTime()) / 1000
      if (secondsSince < 60) {
        return NextResponse.json(
          { error: `Please wait ${Math.ceil(60 - secondsSince)} seconds before requesting a new code` },
          { status: 429 },
        )
      }
    }

    // Generate & save new code
    const code = generateVerificationCode()
    const expiry = getVerificationExpiry()

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyCode: code, verifyExpiry: expiry },
    })

    // Send email
    const result = await sendVerificationEmail(email, code, user.name || undefined)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Verification code sent' })
  } catch (error: any) {
    console.error('Resend code error:', error)
    return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 })
  }
}
