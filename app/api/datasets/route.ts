import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/datasets?projectId=xxx - List datasets for a project
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth()

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    // Verify user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const datasets = await prisma.dataset.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ datasets })
  } catch (error: any) {
    console.error('Error fetching datasets:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    )
  }
}

// POST /api/datasets - Create new dataset
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth()

    const body = await req.json()
    const { projectId, name, parsedData } = body

    if (!projectId || !name) {
      return NextResponse.json(
        { error: 'projectId and name are required' },
        { status: 400 }
      )
    }

    // Verify user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Extract metadata from parsedData
    const columns = parsedData?.columns || []
    const rows = parsedData?.rows || []

    const dataset = await prisma.dataset.create({
      data: {
        projectId,
        name,
        technique: 'spreadsheet',
        fileUrl: '', // Empty for manual spreadsheet entries
        parsedData,
        rowCount: rows.length,
        columnCount: columns.length,
        fileFormat: 'json'
      }
    })

    return NextResponse.json({ dataset }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating dataset:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to create dataset' },
      { status: 500 }
    )
  }
}
