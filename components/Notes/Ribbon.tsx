'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    CheckSquare,
    Image as ImageIcon,
    Undo,
    Redo,
    Heading1,
    Heading2
} from 'lucide-react'
import { useNotes } from './NotesContext'

export function Ribbon() {
    const { activeEditor } = useNotes()

    if (!activeEditor) {
        return (
            <div className="sticky top-0 z-10 bg-white border-b p-2 flex items-center gap-1 shadow-sm opacity-50 pointer-events-none">
                <div className="text-xs text-gray-400 mx-auto">Click a block to edit</div>
            </div>
        )
    }

    return (
        <div className="sticky top-0 z-10 bg-white border-b p-2 flex items-center gap-1 shadow-sm">
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().undo().run()}
                    disabled={!activeEditor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().redo().run()}
                    disabled={!activeEditor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button
                    variant={activeEditor.isActive('bold') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant={activeEditor.isActive('italic') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant={activeEditor.isActive('underline') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleUnderline().run()}
                >
                    <Underline className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button
                    variant={activeEditor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant={activeEditor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button
                    variant={activeEditor.isActive('bulletList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={activeEditor.isActive('orderedList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant={activeEditor.isActive('taskList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => activeEditor.chain().focus().toggleTaskList().run()}
                    title="Checkbox list"
                >
                    <CheckSquare className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                        const url = window.prompt('Enter image URL')
                        if (url) {
                            activeEditor.chain().focus().setImage({ src: url }).run()
                        }
                    }}
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
