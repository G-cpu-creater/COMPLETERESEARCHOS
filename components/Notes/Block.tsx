'use client'

import React from 'react'
import { BlockHeader } from './BlockHeader'
import { BlockEditor } from './BlockEditor'
import { RephraseButton } from './RephraseButton'
import { NoteBlock } from './NotesContainer'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface BlockProps {
    block: NoteBlock
    onDelete: () => void
    onUpdate: (updates: Partial<NoteBlock>) => void
    onReorder: (direction: 'up' | 'down') => void
    onAddBlockAfter: () => void
    canMoveUp: boolean
    canMoveDown: boolean
    canDelete: boolean
}

export function Block({
    block,
    onDelete,
    onUpdate,
    onReorder,
    onAddBlockAfter,
    canMoveUp,
    canMoveDown,
    canDelete
}: BlockProps) {
    return (
        <div className="group relative bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow" data-block-id={block.id}>
            {/* Block Controls (visible on hover) */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onReorder('up')}
                    disabled={!canMoveUp}
                >
                    <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onReorder('down')}
                    disabled={!canMoveDown}
                >
                    <ArrowDown className="h-3 w-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-600"
                    onClick={onDelete}
                    disabled={!canDelete}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            <div className="space-y-4">
                <BlockHeader
                    header={block.header}
                    onChange={(header) => onUpdate({ header })}
                />

                <div className="relative">
                    <BlockEditor
                        blockId={block.id}
                        content={block.content}
                        onChange={(content) => onUpdate({ content })}
                        onAddBlockAfter={onAddBlockAfter}
                        onDeleteBlock={canDelete ? onDelete : undefined}
                    />

                    <div className="absolute bottom-0 right-0 transform translate-y-1/2">
                        <RephraseButton
                            blockId={block.id}
                            content={block.content}
                            onRephrase={(newContent) => onUpdate({ content: newContent })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
