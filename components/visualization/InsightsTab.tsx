'use client'

import React from 'react'
import { ResearchAIChat } from '@/components/ai/ResearchAIChat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface InsightsTabProps {
    dataSummary: string
    plotSummary?: string
}

export function InsightsTab({ dataSummary, plotSummary }: InsightsTabProps) {
    const context = {
        datasetInfo: dataSummary,
        plotInfo: plotSummary,
        projectInfo: 'Analyzing experimental data'
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <Card className="bg-purple-50 border-purple-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                        <Lightbulb className="h-5 w-5" />
                        Automated Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-purple-700">
                        The AI has analyzed your selected data. Use the chat below to ask specific questions or generate reports.
                    </p>
                </CardContent>
            </Card>

            <div className="flex-1 overflow-hidden border rounded-lg bg-white shadow-sm">
                <ResearchAIChat context={context} fullScreen />
            </div>
        </div>
    )
}
