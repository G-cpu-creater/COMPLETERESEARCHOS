import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const files = await prisma.file.findMany({
      where: { projectId: params.id },
      orderBy: [{ type: 'desc' }, { name: 'asc' }],
    })
    
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}
