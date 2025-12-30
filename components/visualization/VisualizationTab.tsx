'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function VisualizationTab() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <Card className="max-w-2xl">
        <CardContent className="p-12 text-center">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Visualization Tab</h2>
          <p className="text-gray-600">
            This tab is ready to be redesigned with new visualization features.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
