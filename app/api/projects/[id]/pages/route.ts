import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - List all pages for a project
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

    const project = await prisma.project.findFirst({
      where: { id, userId },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const pages = await prisma.page.findMany({
      where: { projectId: id },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        icon: true,
        parentPageId: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error listing pages:', error)
    return NextResponse.json({ error: 'Failed to list pages' }, { status: 500 })
  }
}

// POST - Create a new page
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
    const { title, parentPageId } = body

    const project = await prisma.project.findFirst({
      where: { id, userId },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get next position
    const lastPage = await prisma.page.findFirst({
      where: { projectId: id, parentPageId: parentPageId || null },
      orderBy: { position: 'desc' },
    })
    const position = (lastPage?.position ?? -1) + 1

    const page = await prisma.page.create({
      data: {
        projectId: id,
        title: title || 'Untitled',
        parentPageId: parentPageId || null,
        position,
        properties: {},
      },
    })

    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
