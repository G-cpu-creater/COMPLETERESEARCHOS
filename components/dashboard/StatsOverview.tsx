'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, Database, TrendingUp, Activity } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Projects"
        value="12"
        change="+2 from last month"
        trend="up"
        icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Datasets"
        value="48"
        change="+8 this week"
        trend="up"
        icon={<Database className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Visualizations"
        value="156"
        change="+24 this month"
        trend="up"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Active Experiments"
        value="5"
        change="3 completed recently"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}
