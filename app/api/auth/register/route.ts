import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { generateVerificationCode, getVerificationExpiry, sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  institution: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  researchArea: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  orcidId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const { name, email, password, institution, department, role, researchArea, country, state, city, orcidId } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate verification code
    const verifyCode = generateVerificationCode()
    const verifyExpiry = getVerificationExpiry()

    // Create user (unverified)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        institution,
        department,
        role,
        researchArea,
        country,
        state,
        city,
        orcidId,
        emailVerified: false,
        verifyCode,
        verifyExpiry,
      },
    })

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verifyCode, name)
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // Don't fail registration — user can resend later
    }

    // Do NOT set auth cookie yet — wait for email verification
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      needsVerification: true,
    })
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
