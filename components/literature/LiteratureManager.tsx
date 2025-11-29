'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { Sidebar } from './Sidebar'
import { PaperRow } from './PaperRow'
import { PaperRightPanel } from './PaperRightPanel'
import { Button } from '@/components/ui/button'
import { Upload, Plus } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Mock project ID for now, should come from props or context
// const DEMO_PROJECT_ID = 'demo-project-id'

interface LiteratureManagerProps {
  projectId: string
}

export function LiteratureManager({ projectId }: LiteratureManagerProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null)

  const { data: folders, mutate: mutateFolders } = useSWR(`/api/literature/folders?projectId=${projectId}`, fetcher)
  const { data: papers, mutate: mutatePapers } = useSWR(
    `/api/literature/papers?projectId=${projectId}&folderId=${selectedFolderId || ''}`,
    fetcher
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    // Implement drag and drop logic for papers/folders
    // For now, just a placeholder
    console.log('Drag end', event)
  }

  return (
    <div className="flex h-full bg-white">
      <Sidebar
        folders={folders || []}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={() => console.log('Create folder')}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {selectedFolderId ? folders?.find((f: any) => f.id === selectedFolderId)?.name : 'All Papers'}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import PDF
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Paper
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={papers?.map((p: any) => p.id) || []} strategy={verticalListSortingStrategy}>
              {papers?.map((paper: any) => (
                <PaperRow
                  key={paper.id}
                  paper={paper}
                  onSelect={setSelectedPaper}
                  selected={selectedPaper?.id === paper.id}
                />
              ))}
            </SortableContext>
          </DndContext>

          {(!papers || papers.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No papers found in this folder.
            </div>
          )}
        </div>
      </div>

      {selectedPaper && (
        <PaperRightPanel
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  )
}
