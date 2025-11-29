'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

interface SessionContextType {
    sessionId: string | null
    setSessionId: (id: string | null) => void
    sessionTitle: string | null
    setSessionTitle: (title: string | null) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(() => {
        // Load from localStorage on mount
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastActiveSessionId')
        }
        return null
    })
    const [sessionTitle, setSessionTitle] = useState<string | null>(null)

    // Save to localStorage when sessionId changes
    React.useEffect(() => {
        if (sessionId) {
            localStorage.setItem('lastActiveSessionId', sessionId)
        }
    }, [sessionId])

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId, sessionTitle, setSessionTitle }}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => {
    const context = useContext(SessionContext)
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider')
    }
    return context
}
