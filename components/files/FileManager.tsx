'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Folder,
  FolderPlus,
  Trash2,
  Edit,
  MoreVertical,
  Home,
  FileText,
  Image as ImageIcon,
  FileCode,
  ArrowLeft,
  Upload,
  Download,
  Eye,
  X,
  HardDrive,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  createdAt: Date
  children: FileNode[]
  fileData?: string // base64 encoded file data for download
}

interface FileManagerProps {
  projectId: string
}

// Initialize with some sample folders
const createInitialStructure = (): FileNode[] => [
  {
    id: '1',
    name: 'Experiments',
    type: 'folder',
    createdAt: new Date(),
    children: [],
  },
  {
    id: '2',
    name: 'Analysis',
    type: 'folder',
    createdAt: new Date(),
    children: [],
  },
  {
    id: '3',
    name: 'Documentation',
    type: 'folder',
    createdAt: new Date(),
    children: [],
  },
]

export function FileManager({ projectId }: FileManagerProps) {
  const [fileSystem, setFileSystem] = useState<FileNode[]>(createInitialStructure())
  const [currentPath, setCurrentPath] = useState<number[]>([])
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [localFolderHandle, setLocalFolderHandle] = useState<FileSystemDirectoryHandle | null>(null)
  const [localFolderName, setLocalFolderName] = useState<string>('')
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Get current folder based on path
  const getCurrentFolder = (): FileNode[] => {
    let current = fileSystem
    for (const index of currentPath) {
      if (current[index] && current[index].type === 'folder') {
        current = current[index].children
      }
    }
    return current
  }

  const getCurrentFolderName = (): string => {
    if (currentPath.length === 0) return 'Project Root'
    let current = fileSystem
    let name = ''
    for (const index of currentPath) {
      name = current[index].name
      current = current[index].children
    }
    return name
  }

  // Local Folder Sync Functions
  const selectLocalFolder = async () => {
    try {
      // Check if File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        toast({
          variant: 'destructive',
          title: 'Not Supported',
          description: 'Your browser does not support local folder sync. Try using Chrome, Edge, or another Chromium-based browser.',
        })
        return
      }

      // Show directory picker
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
      })

      setLocalFolderHandle(dirHandle)
      setLocalFolderName(dirHandle.name)
      setSyncEnabled(true)

      // Create project folder structure
      await syncFolderStructure(dirHandle)

      toast({
        title: 'Folder Selected',
        description: `Files will now sync to: ${dirHandle.name}`,
        duration: 5000,
      })
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to select folder. Please try again.',
        })
      }
    }
  }

  const syncFolderStructure = async (rootHandle: FileSystemDirectoryHandle) => {
    setSyncing(true)
    try {
      // Create the main project folder
      const projectFolderHandle = await rootHandle.getDirectoryHandle(
        `Project_${projectId}`,
        { create: true }
      )

      // Recursively create folder structure
      const createStructure = async (
        items: FileNode[],
        parentHandle: FileSystemDirectoryHandle
      ) => {
        for (const item of items) {
          if (item.type === 'folder') {
            const folderHandle = await parentHandle.getDirectoryHandle(item.name, {
              create: true,
            })
            await createStructure(item.children, folderHandle)
          } else if (item.fileData) {
            // Create file from base64 data
            const fileHandle = await parentHandle.getFileHandle(item.name, {
              create: true,
            })
            const writable = await fileHandle.createWritable()

            // Convert base64 to blob
            const response = await fetch(item.fileData)
            const blob = await response.blob()
            await writable.write(blob)
            await writable.close()
          }
        }
      }

      await createStructure(fileSystem, projectFolderHandle)
    } catch (error) {
      console.error('Sync error:', error)
      toast({
        variant: 'destructive',
        title: 'Sync Error',
        description: 'Failed to sync folder structure.',
      })
    } finally {
      setSyncing(false)
    }
  }

  const syncFileToLocal = async (fileName: string, fileData: string, path: number[]) => {
    if (!localFolderHandle || !syncEnabled) return

    try {
      // Navigate to the correct folder
      const projectFolderHandle = await localFolderHandle.getDirectoryHandle(
        `Project_${projectId}`,
        { create: true }
      )

      let currentDirHandle = projectFolderHandle
      let current = fileSystem

      for (const index of path) {
        const folderName = current[index].name
        currentDirHandle = await currentDirHandle.getDirectoryHandle(folderName, {
          create: true,
        })
        current = current[index].children
      }

      // Create the file
      const fileHandle = await currentDirHandle.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()

      // Convert base64 to blob
      const response = await fetch(fileData)
      const blob = await response.blob()
      await writable.write(blob)
      await writable.close()
    } catch (error) {
      console.error('File sync error:', error)
    }
  }

  const syncFolderToLocal = async (folderName: string, path: number[]) => {
    if (!localFolderHandle || !syncEnabled) return

    try {
      const projectFolderHandle = await localFolderHandle.getDirectoryHandle(
        `Project_${projectId}`,
        { create: true }
      )

      let currentDirHandle = projectFolderHandle
      let current = fileSystem

      for (const index of path) {
        const name = current[index].name
        currentDirHandle = await currentDirHandle.getDirectoryHandle(name, {
          create: true,
        })
        current = current[index].children
      }

      // Create the new folder
      await currentDirHandle.getDirectoryHandle(folderName, { create: true })
    } catch (error) {
      console.error('Folder sync error:', error)
    }
  }

  const deleteFromLocal = async (itemName: string, path: number[]) => {
    if (!localFolderHandle || !syncEnabled) return

    try {
      const projectFolderHandle = await localFolderHandle.getDirectoryHandle(
        `Project_${projectId}`,
        { create: true }
      )

      let currentDirHandle = projectFolderHandle
      let current = fileSystem

      for (const index of path) {
        const folderName = current[index].name
        currentDirHandle = await currentDirHandle.getDirectoryHandle(folderName, {
          create: true,
        })
        current = current[index].children
      }

      // Delete the item
      await currentDirHandle.removeEntry(itemName, { recursive: true })
    } catch (error) {
      console.error('Delete sync error:', error)
    }
  }

  const renameInLocal = async (oldName: string, newName: string, path: number[]) => {
    if (!localFolderHandle || !syncEnabled) return

    try {
      // Note: File System Access API doesn't have a direct rename
      // We need to copy and delete
      const projectFolderHandle = await localFolderHandle.getDirectoryHandle(
        `Project_${projectId}`,
        { create: true }
      )

      let currentDirHandle = projectFolderHandle
      let current = fileSystem

      for (const index of path) {
        const folderName = current[index].name
        currentDirHandle = await currentDirHandle.getDirectoryHandle(folderName, {
          create: true,
        })
        current = current[index].children
      }

      // For now, we'll just inform the user to manually rename
      // A full implementation would copy the file/folder and delete the old one
      toast({
        title: 'Manual Rename Required',
        description: `Please rename "${oldName}" to "${newName}" in your local folder.`,
        duration: 7000,
      })
    } catch (error) {
      console.error('Rename sync error:', error)
    }
  }

  const disconnectLocalFolder = () => {
    setLocalFolderHandle(null)
    setLocalFolderName('')
    setSyncEnabled(false)
    toast({
      title: 'Folder Disconnected',
      description: 'Local folder sync has been disabled.',
    })
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return

    const newFolder: FileNode = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      createdAt: new Date(),
      children: [],
    }

    const newFileSystem = [...fileSystem]
    let current = newFileSystem
    for (const index of currentPath) {
      current = current[index].children
    }
    current.push(newFolder)

    setFileSystem(newFileSystem)

    // Sync to local folder
    await syncFolderToLocal(newFolderName, currentPath)

    setNewFolderName('')
    setIsCreatingFolder(false)

    toast({
      title: 'Folder created',
      description: `"${newFolderName}" has been created successfully.${syncEnabled ? ' Synced to local folder.' : ''}`,
    })
  }

  const deleteItem = async (itemIndex: number) => {
    const items = getCurrentFolder()
    const itemName = items[itemIndex].name

    if (!confirm(`Delete "${itemName}"?`)) return

    const newFileSystem = [...fileSystem]
    let current = newFileSystem
    for (const index of currentPath) {
      current = current[index].children
    }
    current.splice(itemIndex, 1)

    setFileSystem(newFileSystem)

    // Sync deletion to local folder
    await deleteFromLocal(itemName, currentPath)

    toast({
      title: 'Deleted',
      description: `"${itemName}" has been deleted.${syncEnabled ? ' Removed from local folder.' : ''}`,
    })
  }

  const renameItem = async (itemIndex: number) => {
    const items = getCurrentFolder()
    const currentName = items[itemIndex].name
    const newName = prompt(`Rename "${currentName}" to:`, currentName)

    if (!newName || newName === currentName) return

    const newFileSystem = [...fileSystem]
    let current = newFileSystem
    for (const index of currentPath) {
      current = current[index].children
    }
    current[itemIndex].name = newName

    setFileSystem(newFileSystem)

    // Sync rename to local folder
    await renameInLocal(currentName, newName, currentPath)

    toast({
      title: 'Renamed',
      description: `Renamed to "${newName}"${syncEnabled ? ' (manual rename needed in local folder)' : ''}`,
    })
  }

  const openFolder = (itemIndex: number) => {
    setCurrentPath([...currentPath, itemIndex])
    setSelectedIndex(0) // Reset selection when entering folder
  }

  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedIndex(0)
    }
  }

  const goToRoot = () => {
    setCurrentPath([])
    setSelectedIndex(0)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys if creating folder or modal is open
      if (isCreatingFolder || previewFile) return

      const items = getCurrentFolder()
      if (items.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault()
          const item = items[selectedIndex]
          if (item) {
            if (item.type === 'folder') {
              openFolder(selectedIndex)
            } else {
              openFile(item)
            }
          }
          break
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault()
          goBack()
          break
      }
    }

    // Focus container to receive keyboard events
    containerRef.current?.focus()

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, currentPath, isCreatingFolder, previewFile])

  // Reset selection when path changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [currentPath.length])

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Read file as base64
        const reader = new FileReader()
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            const fileData = reader.result as string
            const newFile: FileNode = {
              id: Date.now().toString() + i,
              name: file.name,
              type: 'file',
              size: file.size,
              createdAt: new Date(),
              children: [],
              fileData: fileData,
            }

            const newFileSystem = [...fileSystem]
            let current = newFileSystem
            for (const index of currentPath) {
              current = current[index].children
            }
            current.push(newFile)

            setFileSystem(newFileSystem)

            // Sync to local folder
            await syncFileToLocal(file.name, fileData, currentPath)

            resolve(null)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      toast({
        title: 'Files uploaded',
        description: `${files.length} file(s) uploaded successfully.${syncEnabled ? ' Synced to local folder.' : ''}`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload files.',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const downloadFile = (item: FileNode) => {
    if (item.type === 'folder' || !item.fileData) return

    const link = document.createElement('a')
    link.href = item.fileData
    link.download = item.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Download started',
      description: `Downloading "${item.name}"`,
    })
  }

  const openFile = (item: FileNode) => {
    if (item.type === 'folder' || !item.fileData) return
    setPreviewFile(item)
  }

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) return 'image'
    if (['pdf'].includes(ext)) return 'pdf'
    if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(ext)) return 'text'
    if (['js', 'ts', 'tsx', 'jsx', 'py', 'css', 'html', 'java', 'cpp', 'c', 'go', 'rs'].includes(ext)) return 'code'
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video'
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio'
    return 'unknown'
  }

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') return Folder
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) return ImageIcon
    if (['js', 'ts', 'tsx', 'jsx', 'py', 'css'].includes(ext || '')) return FileCode
    return FileText
  }

  const currentItems = getCurrentFolder()

  const renderFilePreview = () => {
    if (!previewFile || !previewFile.fileData) return null

    const fileType = getFileType(previewFile.name)

    return (
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{previewFile.name}</span>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(previewFile)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {formatFileSize(previewFile.size)} • {formatDate(previewFile.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 overflow-auto max-h-[70vh]">
            {fileType === 'image' && (
              <div className="flex items-center justify-center bg-gray-50 rounded p-4">
                <img
                  src={previewFile.fileData}
                  alt={previewFile.name}
                  className="max-w-full h-auto max-h-[600px] object-contain"
                />
              </div>
            )}

            {fileType === 'pdf' && (
              <iframe
                src={previewFile.fileData}
                className="w-full h-[600px] border rounded"
                title={previewFile.name}
              />
            )}

            {fileType === 'video' && (
              <video
                src={previewFile.fileData}
                controls
                className="w-full max-h-[600px] bg-black rounded"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {fileType === 'audio' && (
              <div className="flex items-center justify-center bg-gray-50 rounded p-8">
                <audio src={previewFile.fileData} controls className="w-full max-w-md">
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}

            {(fileType === 'text' || fileType === 'code') && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-auto">
                <pre className="whitespace-pre-wrap">
                  {/* Decode base64 text content */}
                  {previewFile.fileData.startsWith('data:')
                    ? atob(previewFile.fileData.split(',')[1])
                    : 'Unable to preview file'}
                </pre>
              </div>
            )}

            {fileType === 'unknown' && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Cannot preview this file type</p>
                <p className="text-sm mt-1 mb-4">Download the file to view it</p>
                <Button onClick={() => downloadFile(previewFile)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative h-[600px] border rounded-lg overflow-hidden bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={() => containerRef.current?.focus()}
    >
      {renderFilePreview()}
      {/* Toolbar */}
      <div className="p-3 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={goBack}
            disabled={currentPath.length === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={goToRoot}
            disabled={currentPath.length === 0}
          >
            <Home className="h-4 w-4" />
          </Button>
          <div className="px-3 py-1 bg-white border rounded text-sm font-medium">
            {getCurrentFolderName()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreatingFolder(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Local Folder Sync Bar */}
      <div className="px-3 py-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {syncEnabled ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Local Folder Sync Active
                  </p>
                  <p className="text-xs text-gray-600">
                    Syncing to: <span className="font-mono">{localFolderName}/Project_{projectId}</span>
                  </p>
                </div>
              </div>
              {syncing && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span>Syncing...</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <HardDrive className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  No Local Folder Selected
                </p>
                <p className="text-xs text-gray-600">
                  Files are stored in browser memory only
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {syncEnabled ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => syncFolderStructure(localFolderHandle!)}
                disabled={syncing}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Re-sync All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={disconnectLocalFolder}
              >
                <X className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={selectLocalFolder}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Select Storage Folder
            </Button>
          )}
        </div>
      </div>

      {/* New Folder Input */}
      {isCreatingFolder && (
        <div className="p-3 border-b bg-blue-50">
          <div className="flex items-center space-x-2">
            <Folder className="h-5 w-5 text-blue-600" />
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
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
      <ScrollArea className="h-[calc(100%-180px)]">
        <div className="p-4">
          {currentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">This folder is empty</p>
              <p className="text-sm mt-1">Create a new folder to get started</p>
            </div>
          ) : (
            <div className="grid gap-1">
              {currentItems.map((item, index) => {
                const Icon = getFileIcon(item)
                return (
                  <div
                    key={item.id}
                    className={`flex items-center p-3 rounded hover:bg-gray-100 cursor-pointer group select-none ${
                      selectedIndex === index ? 'bg-blue-100 border-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedIndex(index)}
                    onDoubleClick={(e) => {
                      e.preventDefault()
                      if (item.type === 'folder') {
                        openFolder(index)
                      } else {
                        openFile(item)
                      }
                    }}
                  >
                    <Icon
                      className={`h-6 w-6 mr-3 ${
                        item.type === 'folder' ? 'text-blue-500' : 'text-gray-600'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.type === 'folder' ? 'Folder' : formatFileSize(item.size)} •{' '}
                        {formatDate(item.createdAt)}
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
                        {item.type === 'folder' ? (
                          <DropdownMenuItem onClick={() => openFolder(index)}>
                            <Folder className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={() => openFile(item)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Open/Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadFile(item)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => renameItem(index)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteItem(index)}
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

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
        <span>
          {currentItems.length} {currentItems.length === 1 ? 'item' : 'items'}
        </span>
        <span className="text-gray-500">
          Use ↑↓ to navigate • Enter to open • ← to go back
        </span>
      </div>
    </div>
  )
}
