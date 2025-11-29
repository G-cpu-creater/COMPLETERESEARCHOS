'use client'

import React from 'react'
import { useSession } from './SessionContext'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function NewSessionButton() {
    const { setSessionId } = useSession()

    const createSession = async () => {
        try {
            const res = await fetch('/api/research-assistant/sessions', { method: 'POST' })
            if (!res.ok) throw new Error('Failed to create session')
            const session = await res.json()
            setSessionId(session.id)
        } catch (error) {
            console.error('Failed to create session:', error)
        }
    }

    return (
        <Button onClick={createSession} className="w-full justify-start" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Session
        </Button>
    )
}
