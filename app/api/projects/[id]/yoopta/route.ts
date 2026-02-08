import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Load Yoopta content for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify user owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get Yoopta content (stored in project settings or new field)
    const yooptaContent = (project.settings as any)?.yooptaContent || null

    return NextResponse.json({ content: yooptaContent })
  } catch (error) {
    console.error('Error loading Yoopta content:', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}

// POST - Save Yoopta content for a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { content } = body

    // Verify user owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Save Yoopta content in project settings
    const currentSettings = (project.settings as any) || {}
    const updatedSettings = {
      ...currentSettings,
      yooptaContent: content,
    }

    await prisma.project.update({
      where: { id: id },
      data: {
        settings: updatedSettings,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving Yoopta content:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}
