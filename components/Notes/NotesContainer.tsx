'use client'

import React, { useState, useEffect } from 'react'
import { Ribbon } from './Ribbon'
import { Block } from './Block'
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
    const [blocks, setBlocks] = useState<NoteBlock[]>(initialBlocks)

    // Sort blocks by order
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

    const addBlock = () => {
        const newBlock: NoteBlock = {
            id: uuidv4(),
            header: 'New block header name',
            content: '<p></p>',
            order: blocks.length + 1
        }
        setBlocks([...blocks, newBlock])
        // TODO: Persist to DB
    }

    const deleteBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId))
        // TODO: Persist to DB
    }

    const updateBlock = (blockId: string, updates: Partial<NoteBlock>) => {
        setBlocks(blocks.map(b => b.id === blockId ? { ...b, ...updates } : b))
        // TODO: Persist to DB (debounce)
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
        // TODO: Persist to DB
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Ribbon />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {sortedBlocks.map((block) => (
                        <Block
                            key={block.id}
                            block={block}
                            onDelete={() => deleteBlock(block.id)}
                            onUpdate={(updates) => updateBlock(block.id, updates)}
                            onMoveUp={() => reorderBlock(block.id, 'up')}
                            onMoveDown={() => reorderBlock(block.id, 'down')}
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
