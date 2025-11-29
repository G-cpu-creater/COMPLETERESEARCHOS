'use client'

import React from 'react'
import useSWR from 'swr'
import { useSession } from './SessionContext'
import { NewSessionButton } from './NewSessionButton'
import { cn } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function ChatSidebar() {
    const { sessionId, setSessionId } = useSession()
    const { data: sessions } = useSWR('/api/research-assistant/sessions', fetcher)

    return (
        <div className="w-64 border-r bg-gray-50 flex flex-col h-full">
            <div className="p-4 border-b">
                <NewSessionButton />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {sessions?.map((session: any) => (
                        <button
                            key={session.id}
                            onClick={() => setSessionId(session.id)}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors",
                                sessionId === session.id
                                    ? "bg-white shadow-sm text-blue-600 font-medium"
                                    : "hover:bg-gray-100 text-gray-700"
                            )}
                        >
                            <MessageSquare className="h-4 w-4 opacity-50" />
                            <span className="truncate">{session.title || 'New Session'}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
