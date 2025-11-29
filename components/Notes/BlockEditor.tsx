'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'

interface BlockEditorProps {
    content: string
    onChange: (content: string) => void
}

export function BlockEditor({ content, onChange }: BlockEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Underline,
            Placeholder.configure({
                placeholder: 'Type something...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px]',
            },
        },
    })

    return <EditorContent editor={editor} />
}
