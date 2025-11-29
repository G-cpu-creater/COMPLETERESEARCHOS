'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface RephraseButtonProps {
    blockId: string
    content: string
    onRephrase: (newContent: string) => void
}

export function RephraseButton({ blockId, content, onRephrase }: RephraseButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleRephrase = async () => {
        if (!content || content === '<p></p>') return

        setIsLoading(true)
        try {
            // Extract text from HTML (simple strip tags for now, backend should handle better)
            const text = content.replace(/<[^>]*>?/gm, '')

            const response = await fetch(`/api/notes/rephrase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockId, text })
            })

            if (!response.ok) throw new Error('Failed to rephrase')

            const data = await response.json()
            onRephrase(data.rephrasedText)
            toast({
                title: "Success",
                description: "Block rephrased successfully",
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to rephrase block",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            size="sm"
            variant="secondary"
            className="shadow-sm bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            onClick={handleRephrase}
            disabled={isLoading}
        >
            <Sparkles className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Rephrasing...' : 'Rephrase'}
        </Button>
    )
}
