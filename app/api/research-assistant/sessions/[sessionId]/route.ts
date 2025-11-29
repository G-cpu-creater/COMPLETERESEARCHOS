import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    try {
        const { sessionId } = params
        const session = await prisma.aIConversation.findUnique({
            where: { id: sessionId }
        })

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        return NextResponse.json(session)
    } catch (error) {
        console.error('Get session error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
