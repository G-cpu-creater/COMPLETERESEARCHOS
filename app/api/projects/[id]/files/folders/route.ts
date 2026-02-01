import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, parentId } = await req.json()
    
    console.log('Creating folder:', { name, parentId, projectId: params.id })
    
    const folder = await prisma.file.create({
      data: {
        name,
        type: 'folder',
        projectId: params.id,
        ...(parentId && { parentId }),
      },
    })
    
    console.log('Folder created:', folder)
    
    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Failed to create folder:', error)
    return NextResponse.json({ 
      error: 'Failed to create folder', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
