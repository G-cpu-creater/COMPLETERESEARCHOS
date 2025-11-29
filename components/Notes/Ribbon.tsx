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
import { useCurrentEditor } from '@tiptap/react'

export function Ribbon() {
    // In a real implementation, we'd need a way to access the currently active editor instance.
    // Since we have multiple editors (one per block), the Ribbon needs to know which one is focused.
    // For now, we'll create the UI structure. The actual connection to the active editor 
    // would typically be handled via a context or a shared event bus.

    return (
        <div className="sticky top-0 z-10 bg-white border-b p-2 flex items-center gap-1 shadow-sm">
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Underline className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heading2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <CheckSquare className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
