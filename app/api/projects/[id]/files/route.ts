import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Fetching files for project:', params.id)
    const files = await prisma.file.findMany({
      where: { projectId: params.id },
      orderBy: [{ type: 'desc' }, { name: 'asc' }],
    })
    console.log('Found files:', files.length, files)
    
    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}
