'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MessageProps {
    message: {
        id: string
        role: string
        content: string
        createdAt: string | Date
    }
}

export function Message({ message }: MessageProps) {
    const isUser = message.role === 'user'

    return (
        <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
            <div className={cn(
                "max-w-[80%] rounded-lg p-4",
                isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
            )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    )
}
