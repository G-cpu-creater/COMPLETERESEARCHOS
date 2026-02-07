'use client'

import { useState } from 'react'
import { Columns2, X, Plus, FileText, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { usePageStore } from '@/lib/stores/pageStore'
import { YooptaPageEditor } from '@/components/yoopta/YooptaPageEditor'
import { PageItem } from './PageItem'

interface SplitEditorViewProps {
  projectId: string
}

export function SplitEditorView({ projectId }: SplitEditorViewProps) {
  const selectedPageId = usePageStore((s) => s.selectedPageId)
  const splitPageId = usePageStore((s) => s.splitPageId)
  const isSplit = usePageStore((s) => s.isSplit)
  const pages = usePageStore((s) => s.pages)
  const toggleSplit = usePageStore((s) => s.toggleSplit)
  const setSplitPageId = usePageStore((s) => s.setSplitPageId)
  const createPage = usePageStore((s) => s.createPage)

  const [panelOpen, setPanelOpen] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const rootPages = Object.values(pages)
    .filter((p) => !p.parentPageId)
    .sort((a, b) => a.position - b.position)

  const pageList = Object.values(pages).sort((a, b) => a.position - b.position)

  const handleCreate = async () => {
    const title = newTitle.trim() || 'Untitled'
    await createPage(title)
    setNewTitle('')
    setIsCreating(false)
  }

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') {
      setIsCreating(false)
      setNewTitle('')
    }
  }

  return (
    <div className="flex h-full min-h-[700px]">
      {/* Page sidebar panel */}
      {panelOpen ? (
        <div className="w-56 border-r bg-gray-50/80 flex flex-col flex-shrink-0">
          {/* Panel header */}
          <div className="flex items-center justify-between px-3 py-3 border-b">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCreating(true)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                title="New page"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                title="Collapse panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Page list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {isCreating && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
                <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleCreate}
                  onKeyDown={handleCreateKeyDown}
                  placeholder="Page name..."
                  className="flex-1 text-sm bg-white border rounded px-2 py-1 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 min-w-0"
                />
              </div>
            )}

            {rootPages.length === 0 && !isCreating ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">No pages yet</p>
                <p className="text-xs text-gray-400 text-center mb-4">Create your first page to start writing</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Page
                </button>
              </div>
            ) : (
              rootPages.map((page) => (
                <PageItem key={page.id} page={page} depth={0} />
              ))
            )}
          </div>

          {/* Panel footer with new page button when pages exist */}
          {rootPages.length > 0 && !isCreating && (
            <div className="border-t p-2">
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                New Page
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed panel toggle */
        <div className="w-10 border-r bg-gray-50/50 flex flex-col items-center pt-3 flex-shrink-0">
          <button
            onClick={() => setPanelOpen(true)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
            title="Expand pages panel"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-end px-4 py-2 border-b bg-white">
          <button
            onClick={toggleSplit}
            className={
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ' +
              (isSplit
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700')
            }
            title={isSplit ? 'Close split view' : 'Split view'}
          >
            <Columns2 className="h-4 w-4" />
            <span>{isSplit ? 'Close Split' : 'Split View'}</span>
          </button>
        </div>

        {/* Editor content */}
        {!selectedPageId ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50/30">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No page selected</p>
              <p className="text-sm text-gray-400">Select a page from the panel or create a new one</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Primary editor */}
            <div className={isSplit ? 'w-1/2 border-r' : 'w-full'}>
              <YooptaPageEditor
                key={selectedPageId}
                pageId={selectedPageId}
                projectId={projectId}
              />
            </div>

            {/* Split editor */}
            {isSplit && (
              <div className="w-1/2 flex flex-col">
                {splitPageId ? (
                  <>
                    <div className="flex items-center justify-end px-3 py-1 border-b bg-gray-50">
                      <button
                        onClick={() => setSplitPageId(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200"
                        title="Close this panel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <YooptaPageEditor
                        key={splitPageId}
                        pageId={splitPageId}
                        projectId={projectId}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                    <p className="text-sm text-gray-500 mb-4 font-medium">Open a page</p>
                    <div className="space-y-1 max-w-[220px] w-full px-4">
                      {pageList
                        .filter((p) => p.id !== selectedPageId)
                        .map((page) => (
                          <button
                            key={page.id}
                            onClick={() => setSplitPageId(page.id)}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
                          >
                            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{page.title}</span>
                          </button>
                        ))}
                      {pageList.filter((p) => p.id !== selectedPageId).length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">No other pages available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
