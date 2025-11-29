'use client'

import React, { useState, useEffect } from 'react'
import { Ribbon } from './Ribbon'
import { Block } from './Block'
import { NotesProvider } from './NotesContext'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export interface NoteBlock {
    id: string
    header: string
    content: string // HTML content
    order: number
}

interface NotesContainerProps {
    noteId: string
    initialBlocks?: NoteBlock[]
}

export function NotesContainer({ noteId, initialBlocks = [] }: NotesContainerProps) {
    return (
        <NotesProvider>
            <NotesContainerContent noteId={noteId} initialBlocks={initialBlocks} />
        </NotesProvider>
    )
}

function NotesContainerContent({ noteId, initialBlocks = [] }: NotesContainerProps) {
    const [blocks, setBlocks] = useState<NoteBlock[]>(initialBlocks)
    const [isSaving, setIsSaving] = useState(false)

    // Sort blocks by order
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

    // Debounced save function
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Skip save if blocks haven't changed from initial (simple ref check won't work well here, 
            // but for now we just want to avoid saving on mount if nothing changed)
            // A better approach is to track isDirty

            setIsSaving(true)
            try {
                await fetch(`/api/notes/${noteId}/blocks`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ blocks }),
                })
            } catch (error) {
                console.error('Failed to save notes:', error)
            } finally {
                setIsSaving(false)
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [blocks, noteId])

    const addBlock = () => {
        const newBlock: NoteBlock = {
            id: uuidv4(),
            header: 'New block header name',
            content: '<p></p>',
            order: blocks.length + 1
        }
        setBlocks([...blocks, newBlock])
    }

    const addBlockAfter = (currentBlockId: string) => {
        const currentIndex = blocks.findIndex(b => b.id === currentBlockId)
        const newBlock: NoteBlock = {
            id: uuidv4(),
            header: 'New block header name',
            content: '<p></p>',
            order: currentIndex + 1.5 // Will be renormalized
        }

        // Insert and renormalize orders
        const updatedBlocks = [...blocks]
        updatedBlocks.splice(currentIndex + 1, 0, newBlock)
        updatedBlocks.forEach((b, idx) => b.order = idx + 1)

        setBlocks(updatedBlocks)

        // Focus new block after a short delay
        setTimeout(() => {
            const newBlockElement = document.querySelector(`[data-block-id="${newBlock.id}"] .ProseMirror`)
            if (newBlockElement instanceof HTMLElement) {
                newBlockElement.focus()
            }
        }, 100)
    }

    const deleteBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId))
    }

    const updateBlock = (blockId: string, updates: Partial<NoteBlock>) => {
        setBlocks(blocks.map(b => b.id === blockId ? { ...b, ...updates } : b))
    }

    const reorderBlock = (blockId: string, direction: 'up' | 'down') => {
        const index = sortedBlocks.findIndex(b => b.id === blockId)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === sortedBlocks.length - 1) return

        const newBlocks = [...sortedBlocks]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap orders
        const tempOrder = newBlocks[index].order
        newBlocks[index].order = newBlocks[swapIndex].order
        newBlocks[swapIndex].order = tempOrder

        setBlocks(newBlocks)
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Ribbon />

            {isSaving && (
                <div className="absolute top-2 right-2 text-xs text-gray-400">
                    Saving...
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {sortedBlocks.map((block) => (
                        <Block
                            key={block.id}
                            block={block}
                            onDelete={() => deleteBlock(block.id)}
                            onUpdate={(updates) => updateBlock(block.id, updates)}
                            onReorder={(direction) => reorderBlock(block.id, direction)}
                            onAddBlockAfter={() => addBlockAfter(block.id)}
                            canMoveUp={block.order > 1}
                            canMoveDown={block.order < blocks.length}
                            canDelete={blocks.length > 1}
                        />
                    ))}

                    <Button
                        onClick={addBlock}
                        className="w-full py-8 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                        variant="ghost"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Block
                    </Button>
                </div>
            </div>
        </div>
    )
}
