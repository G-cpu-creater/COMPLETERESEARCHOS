'use client'

import React from 'react'

interface BlockHeaderProps {
    header: string
    onChange: (header: string) => void
}

export function BlockHeader({ header, onChange }: BlockHeaderProps) {
    return (
        <input
            type="text"
            value={header}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            placeholder="Block Header"
        />
    )
}
