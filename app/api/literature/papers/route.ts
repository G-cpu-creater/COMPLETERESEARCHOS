import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')
        const folderId = searchParams.get('folderId')

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const where: any = { projectId }
        if (folderId) {
            where.folderId = folderId
        }

        const papers = await prisma.paper.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(papers)
    } catch (error) {
        console.error('Get papers error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
