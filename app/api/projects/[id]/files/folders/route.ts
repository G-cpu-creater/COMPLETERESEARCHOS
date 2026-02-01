import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, parentId } = await req.json()
    
    const folder = await prisma.file.create({
      data: {
        name,
        type: 'folder',
        projectId: params.id,
        parentId: parentId || null,
        extension: null,
        size: null,
        url: null,
        isExpanded: false,
      },
    })
    
    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Failed to create folder:', error)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}
