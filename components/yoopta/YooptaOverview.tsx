'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import YooptaEditor, {
  createYooptaEditor,
  type YooptaContentValue,
  type YooptaOnChangeOptions,
} from '@yoopta/editor'

// Plugins
import Paragraph from '@yoopta/paragraph'
import Blockquote from '@yoopta/blockquote'
import Code from '@yoopta/code'
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings'
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists'
import Divider from '@yoopta/divider'
import Callout from '@yoopta/callout'
import Accordion from '@yoopta/accordion'
import Table from '@yoopta/table'
import Image from '@yoopta/image'
import Video from '@yoopta/video'
import File from '@yoopta/file'
import Embed from '@yoopta/embed'
import Link from '@yoopta/link'

// Marks
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks'

// Tools
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar'
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list'
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool'

interface YooptaOverviewProps {
  projectId: string
}

async function uploadFile(file: globalThis.File) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight]

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
}

export function YooptaOverview({ projectId }: YooptaOverviewProps) {
  const editor = useMemo(() => createYooptaEditor(), [])
  const [value, setValue] = useState<YooptaContentValue | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasLoadedRef = useRef(false)

  const plugins = useMemo(() => [
    Paragraph,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Code,
    NumberedList,
    BulletedList,
    TodoList,
    Divider,
    Callout,
    Accordion,
    Table,
    Link,
    Embed,
    Image.extend({
      options: {
        async onUpload(file: globalThis.File) {
          const data = await uploadFile(file)
          return { src: data.url, alt: file.name, sizes: { width: 800, height: 600 } }
        },
      },
    }),
    Video.extend({
      options: {
        async onUpload(file: globalThis.File) {
          const data = await uploadFile(file)
          return { src: data.url, sizes: { width: 800, height: 450 } }
        },
      },
    }),
    File.extend({
      options: {
        async onUpload(file: globalThis.File) {
          const data = await uploadFile(file)
          return { src: data.url, format: file.name.split('.').pop(), name: file.name, size: file.size }
        },
      },
    }),
  ], [])

  // Load saved content on mount
  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadContent = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/projects/${projectId}/yoopta`)
        if (res.ok) {
          const data = await res.json()
          if (data.content && typeof data.content === 'object' && Object.keys(data.content).length > 0) {
            // Validate content structure - each block should have 'type' and 'value'
            const firstBlock = Object.values(data.content)[0] as any
            if (firstBlock?.type && firstBlock?.value) {
              setValue(data.content)
            } else {
              console.warn('Skipping incompatible saved content format')
            }
          }
        }
      } catch (error) {
        console.error('Failed to load Yoopta content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [projectId])

  // Save content to API
  const saveContent = useCallback(
    async (content: YooptaContentValue) => {
      try {
        setSaving(true)
        const res = await fetch(`/api/projects/${projectId}/yoopta`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })
        if (res.ok) {
          setLastSaved(new Date())
        }
      } catch (error) {
        console.error('Failed to save:', error)
      } finally {
        setSaving(false)
      }
    },
    [projectId]
  )

  // Debounced auto-save on change
  const onChange = useCallback(
    (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
      setValue(newValue)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => saveContent(newValue), 1500)
    },
    [saveContent]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Yoopta Editor</h2>
          <p className="text-sm text-gray-500">
            Rich-text editor &bull; Type &quot;/&quot; for commands
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-sm text-blue-600 flex items-center gap-2">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-r-transparent" />
              Saving...
            </span>
          )}
          {lastSaved && !saving && (
            <span className="text-sm text-green-600">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="p-8 min-h-[700px]">
        <YooptaEditor
          editor={editor}
          plugins={plugins as any}
          marks={MARKS}
          tools={TOOLS as any}
          value={value}
          onChange={onChange}
          placeholder="Start typing or press / for commands..."
          autoFocus
          style={{
            width: '100%',
          }}
        />
      </div>
    </div>
  )
}
