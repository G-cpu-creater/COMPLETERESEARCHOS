'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Folder,
  File,
  FolderPlus,
  Upload,
  Trash2,
  Edit,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Home,
  FileText,
  Image as ImageIcon,
  FileCode,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate, formatFileSize } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  createdAt: string
  updatedAt: string
  parentId: string | null
  children?: FileNode[]
}

interface FileManagerProps {
  projectId: string
}

export function FileManager({ projectId }: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [files, setFiles] = useState<FileNode[]>([])
  const [allFolders, setAllFolders] = useState<FileNode[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchFiles()
  }, [currentFolderId, projectId])

  const fetchFiles = async () => {
    try {
      const query = currentFolderId ? `?folderId=${currentFolderId}` : ''
      const res = await fetch(`/api/projects/${projectId}/files${query}`)
      const data = await res.json()
      setFiles(data.files || [])
      setAllFolders(data.folders || [])
    } catch (error) {
      console.error('Failed to fetch files:', error)
    }
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const res = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          type: 'folder',
          parentId: currentFolderId,
        }),
      })

      if (!res.ok) throw new Error('Failed to create folder')

      toast({
        variant: 'success',
        title: 'Folder created',
        description: `"${newFolderName}" has been created successfully.`,
      })

      setNewFolderName('')
      setIsCreatingFolder(false)
      await fetchFiles()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to create folder',
        description: error.message,
      })
    }
  }

  const deleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Delete "${itemName}"?`)) return

    try {
      await fetch(`/api/projects/${projectId}/files/${itemId}`, {
        method: 'DELETE',
      })

      toast({
        title: 'Deleted',
        description: `"${itemName}" has been deleted.`,
      })

      await fetchFiles()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: error.message,
      })
    }
  }

  const renameItem = async (itemId: string, currentName: string) => {
    const newName = prompt(`Rename "${currentName}" to:`, currentName)
    if (!newName || newName === currentName) return

    try {
      await fetch(`/api/projects/${projectId}/files/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })

      toast({
        variant: 'success',
        title: 'Renamed',
        description: `Renamed to "${newName}"`,
      })

      await fetchFiles()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to rename',
        description: error.message,
      })
    }
  }

  const navigateToFolder = (folderId: string | null, folderName?: string) => {
    if (folderId === null) {
      setCurrentPath([])
      setCurrentFolderId(null)
    } else {
      if (folderName) {
        setCurrentPath([...currentPath, folderName])
      }
      setCurrentFolderId(folderId)
    }
  }

  const navigateToPathIndex = (index: number) => {
    if (index === -1) {
      navigateToFolder(null)
    } else {
      const newPath = currentPath.slice(0, index + 1)
      setCurrentPath(newPath)
      // Find folder ID based on path
      // For now, just go to root
      setCurrentFolderId(null)
    }
  }

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') return Folder
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) return ImageIcon
    if (['js', 'ts', 'tsx', 'jsx', 'py', 'css'].includes(ext || '')) return FileCode
    return FileText
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-background">
      {/* Left Sidebar - Folder Tree */}
      <div className="w-64 border-r bg-muted/10">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm flex items-center">
            <Folder className="h-4 w-4 mr-2" />
            Folders
          </h3>
        </div>
        <ScrollArea className="h-[calc(100%-57px)]">
          <div className="p-2">
            <FolderTreeNode
              folder={{ id: 'root', name: 'Project Root', type: 'folder', children: allFolders, createdAt: '', updatedAt: '', parentId: null }}
              currentFolderId={currentFolderId}
              onSelect={(id) => navigateToFolder(id === 'root' ? null : id)}
              level={0}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between bg-muted/10">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsCreatingFolder(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground">
            <button
              onClick={() => navigateToPathIndex(-1)}
              className="hover:text-foreground flex items-center"
            >
              <Home className="h-4 w-4" />
            </button>
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-1" />
                <button
                  onClick={() => navigateToPathIndex(index)}
                  className="hover:text-foreground"
                >
                  {path}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Folder Input */}
        {isCreatingFolder && (
          <div className="p-4 border-b bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5 text-blue-600" />
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createFolder()
                  if (e.key === 'Escape') {
                    setIsCreatingFolder(false)
                    setNewFolderName('')
                  }
                }}
                autoFocus
                className="max-w-xs"
              />
              <Button size="sm" onClick={createFolder}>
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreatingFolder(false)
                  setNewFolderName('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* File List */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>This folder is empty</p>
                <p className="text-sm mt-1">Create a folder or upload files to get started</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {files.map((file) => {
                  const Icon = getFileIcon(file)
                  return (
                    <div
                      key={file.id}
                      className={`flex items-center p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group ${
                        selectedItems.has(file.id) ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500' : ''
                      }`}
                      onClick={() => {
                        if (file.type === 'folder') {
                          navigateToFolder(file.id, file.name)
                        }
                      }}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${file.type === 'folder' ? 'text-blue-600' : 'text-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.type === 'folder' ? 'Folder' : formatFileSize(file.size || 0)} •{' '}
                          {formatDate(file.updatedAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => renameItem(file.id, file.name)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteItem(file.id, file.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

// Folder Tree Node Component
function FolderTreeNode({
  folder,
  currentFolderId,
  onSelect,
  level = 0,
}: {
  folder: FileNode
  currentFolderId: string | null
  onSelect: (id: string) => void
  level: number
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const hasChildren = folder.children && folder.children.length > 0

  return (
    <div>
      <button
        className={`w-full flex items-center px-2 py-1.5 rounded text-sm hover:bg-muted ${
          currentFolderId === folder.id ? 'bg-muted font-medium' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          onSelect(folder.id)
          if (hasChildren) setIsExpanded(!isExpanded)
        }}
      >
        {hasChildren && (
          <span className="mr-1">
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        )}
        <Folder className="h-4 w-4 mr-2 text-blue-600" />
        <span className="truncate">{folder.name}</span>
      </button>
      {isExpanded && hasChildren && (
        <div>
          {folder.children!.map((child) => (
            <FolderTreeNode
              key={child.id}
              folder={child}
              currentFolderId={currentFolderId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
