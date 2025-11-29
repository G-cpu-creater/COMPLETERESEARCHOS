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
    Heading2,
    Highlighter,
    Palette
} from 'lucide-react'
import { useNotes } from './NotesContext'

export function Ribbon() {
    const { activeEditor } = useNotes()
    const [activeTab, setActiveTab] = React.useState('home')

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'insert', label: 'Insert' },
        { id: 'layout', label: 'Layout' },
        { id: 'references', label: 'References' },
        { id: 'review', label: 'Review' },
        { id: 'view', label: 'View' },
        { id: 'help', label: 'Help' },
    ]

    if (!activeEditor) {
        return (
            <div className="sticky top-0 z-10 bg-white border-b flex flex-col shadow-sm opacity-50 pointer-events-none">
                <div className="flex border-b px-2 bg-gray-50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`px-4 py-1 text-sm ${activeTab === tab.id ? 'bg-white border-t border-x font-medium' : 'text-gray-600'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="p-2 text-xs text-gray-400 text-center">Click a block to edit</div>
            </div>
        )
    }

    return (
        <div className="sticky top-0 z-10 bg-white border-b flex flex-col shadow-sm">
            {/* Tabs */}
            <div className="flex border-b px-2 bg-gray-50">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-1 text-sm rounded-t-lg transition-colors ${activeTab === tab.id
                            ? 'bg-white border-t border-x border-gray-200 text-blue-600 font-medium -mb-px relative z-10'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Toolbar Content */}
            <div className="p-2 h-12 flex items-center gap-2 overflow-x-auto">
                {activeTab === 'home' && (
                    <>
                        <div className="flex items-center gap-1 border-r pr-2 mr-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().undo().run()}
                                disabled={!activeEditor.can().undo()}
                                title="Undo"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().redo().run()}
                                disabled={!activeEditor.can().redo()}
                                title="Redo"
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
                                title="Bold"
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={activeEditor.isActive('italic') ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().toggleItalic().run()}
                                title="Italic"
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={activeEditor.isActive('underline') ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().toggleUnderline().run()}
                                title="Underline"
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
                                title="Heading 1"
                            >
                                <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={activeEditor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().toggleHeading({ level: 2 }).run()}
                                title="Heading 2"
                            >
                                <Heading2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant={activeEditor.isActive('bulletList') ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().toggleBulletList().run()}
                                title="Bullet List"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={activeEditor.isActive('orderedList') ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().toggleOrderedList().run()}
                                title="Numbered List"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={activeEditor.isActive('taskList') ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => activeEditor.chain().focus().toggleTaskList().run()}
                                title="Checklist"
                            >
                                <CheckSquare className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-l pl-2 ml-2">
                            {/* Text Color */}
                            <div className="relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    title="Text Color"
                                >
                                    <Palette className="h-4 w-4" />
                                </Button>
                                <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 z-50">
                                    <div className="grid grid-cols-5 gap-1">
                                        {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'].map(color => (
                                            <button
                                                key={color}
                                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                onClick={() => activeEditor.chain().focus().setColor(color).run()}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className="w-full mt-2 text-xs text-gray-600 hover:text-gray-900 border-t pt-1"
                                        onClick={() => activeEditor.chain().focus().unsetColor().run()}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Highlight Color */}
                            <div className="relative group">
                                <Button
                                    variant={activeEditor.isActive('highlight') ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    title="Highlight"
                                >
                                    <Highlighter className="h-4 w-4" />
                                </Button>
                                <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 z-50">
                                    <div className="grid grid-cols-5 gap-1">
                                        {['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', '#FFB6C1', '#90EE90', '#ADD8E6', '#DDA0DD', '#F0E68C'].map(color => (
                                            <button
                                                key={color}
                                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                onClick={() => activeEditor.chain().focus().toggleHighlight({ color }).run()}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className="w-full mt-2 text-xs text-gray-600 hover:text-gray-900 border-t pt-1"
                                        onClick={() => activeEditor.chain().focus().unsetHighlight().run()}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'insert' && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                                const url = window.prompt('Enter image URL')
                                if (url) {
                                    activeEditor.chain().focus().setImage({ src: url }).run()
                                }
                            }}
                        >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Image
                        </Button>
                        {/* Add more insert options here later */}
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {['layout', 'references', 'review', 'view', 'help'].includes(activeTab) && (
                    <div className="text-sm text-gray-400 italic">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tools coming soon...
                    </div>
                )}
            </div>
        </div>
    )
}
