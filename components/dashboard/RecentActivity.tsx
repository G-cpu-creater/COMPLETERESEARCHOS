'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { FileUp, LineChart, FileText, Zap } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'upload' | 'analysis' | 'export' | 'visualization'
  title: string
  description: string
  timestamp: Date
  status?: 'success' | 'processing' | 'failed'
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'upload',
    title: 'CV Dataset Uploaded',
    description: 'battery_test_01.csv',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'success',
  },
  {
    id: '2',
    type: 'analysis',
    title: 'EIS Analysis Completed',
    description: 'Nyquist plot generated for sample A',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'success',
  },
  {
    id: '3',
    type: 'visualization',
    title: 'New Visualization Created',
    description: 'Tafel plot for corrosion study',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: 'success',
  },
  {
    id: '4',
    type: 'export',
    title: 'Data Export',
    description: 'Project exported to Excel format',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'success',
  },
]

const icons = {
  upload: FileUp,
  analysis: Zap,
  export: FileText,
  visualization: LineChart,
}

const statusColors = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
}

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest actions and analysis results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = icons[activity.type]
            return (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  {activity.status && (
                    <Badge className={`${statusColors[activity.status]} mb-1`}>
                      {activity.status}
                    </Badge>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
