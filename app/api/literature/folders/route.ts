import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        // Fetch folders recursively? Or just flat list and build tree on frontend?
        // Frontend expects tree structure or flat list with parentId.
        // Sidebar component expects 'folders' array. FolderNode expects 'folder' with 'children'.
        // Let's return flat list and let frontend build tree or return nested.
        // Prisma can return nested relations.

        const folders = await prisma.folder.findMany({
            where: { projectId, parentId: null }, // Root folders
            include: {
                children: {
                    include: {
                        children: true // 2 levels deep for now
                    }
                }
            }
        })

        return NextResponse.json(folders)
    } catch (error) {
        console.error('Get folders error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
