'use client'

import React from 'react'
import { Folder, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderNodeProps {
    folder: any
    level: number
    selectedFolderId: string | null
    onSelect: (id: string) => void
    onToggle: (id: string) => void
    expanded: boolean
}

export function FolderNode({ folder, level, selectedFolderId, onSelect, onToggle, expanded }: FolderNodeProps) {
    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-100 rounded text-sm",
                    selectedFolderId === folder.id && "bg-blue-50 text-blue-600"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => onSelect(folder.id)}
            >
                <div
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle(folder.id)
                    }}
                >
                    {expanded ? (
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                    ) : (
                        <ChevronRight className="h-3 w-3 text-gray-500" />
                    )}
                </div>
                <Folder className={cn("h-4 w-4", selectedFolderId === folder.id ? "text-blue-500" : "text-yellow-500")} />
                <span className="truncate">{folder.name}</span>
            </div>

            {expanded && folder.children && (
                <div>
                    {folder.children.map((child: any) => (
                        <FolderNode
                            key={child.id}
                            folder={child}
                            level={level + 1}
                            selectedFolderId={selectedFolderId}
                            onSelect={onSelect}
                            onToggle={onToggle}
                            expanded={true} // Need state management for children expansion
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
