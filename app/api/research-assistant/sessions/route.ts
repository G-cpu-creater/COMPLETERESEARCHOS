import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEMO_USER_ID = 'demo-user-id' // Replace with actual auth

export async function GET(req: NextRequest) {
    try {
        // Fetch sessions for the user
        // We use AIConversation model. We filter by contextType 'research-assistant' or similar if we want to distinguish
        // But schema says contextType is 'page', 'visualization', 'general'.
        // We'll use 'general' for the main assistant.

        const sessions = await prisma.aIConversation.findMany({
            where: {
                userId: DEMO_USER_ID,
                contextType: 'general'
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                id: true,
                updatedAt: true,
                messages: true // To get title from first message? Or just return ID/date
            }
        })

        // Map to frontend format
        const formattedSessions = sessions.map(s => {
            const msgs = s.messages as any[]
            const title = msgs && msgs.length > 0 ? msgs[0].content.substring(0, 30) + '...' : 'New Session'
            return {
                id: s.id,
                title,
                updatedAt: s.updatedAt
            }
        })

        return NextResponse.json(formattedSessions)
    } catch (error) {
        console.error('Get sessions error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        // Create new session
        const session = await prisma.aIConversation.create({
            data: {
                userId: DEMO_USER_ID,
                contextType: 'general',
                messages: [
                    {
                        id: 'init',
                        role: 'assistant',
                        content: 'Hello! I\'m your AI research assistant. How can I assist you today?',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        })

        return NextResponse.json(session)
    } catch (error) {
        console.error('Create session error:', error)
        // If user doesn't exist, we might fail.
        // For demo purposes, we might need to ensure user exists.
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
