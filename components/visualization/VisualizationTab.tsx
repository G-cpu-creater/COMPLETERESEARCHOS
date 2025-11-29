'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Loader2,
  LineChart,
  ScatterChart,
  BarChart3,
  TrendingUp,
  Box,
} from 'lucide-react'
import { PlotVisualization } from './PlotVisualization'
import { Spreadsheet } from './Spreadsheet'
import { AIInsightsButton } from './AIInsightsButton'
import { InsightsTab } from './InsightsTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Papa from 'papaparse'

type PlotType = 'line' | 'scatter' | 'bar' | 'histogram' | 'box'

export function VisualizationTab() {
  const [data, setData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set())
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [plotType, setPlotType] = useState<PlotType>('line')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('viz')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string

      Papa.parse(text, {
        complete: (result) => {
          if (result.data && result.data.length > 0) {
            const parsedData = result.data as string[][]
            setHeaders(parsedData[0] || [])
            setData(parsedData.slice(1))
          }
          setLoading(false)
        },
        error: () => {
          setLoading(false)
          alert('Failed to parse CSV file')
        },
      })
    }

    reader.readAsText(file)
  }

  const handleColumnClick = (index: number) => {
    const newSelected = new Set(selectedColumns)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedColumns(newSelected)
  }

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAllRows = (selected: boolean) => {
    if (selected) {
      const allIndices = new Set(data.map((_, i) => i))
      setSelectedRows(allIndices)
    } else {
      setSelectedRows(new Set())
    }
  }

  const plotTypes: { type: PlotType; icon: any; label: string }[] = [
    { type: 'line', icon: LineChart, label: 'Line' },
    { type: 'scatter', icon: ScatterChart, label: 'Scatter' },
    { type: 'bar', icon: BarChart3, label: 'Bar' },
    { type: 'histogram', icon: TrendingUp, label: 'Histogram' },
    { type: 'box', icon: Box, label: 'Box' },
  ]

  // Prepare summaries for AI
  const dataSummary = `Dataset with ${data.length} rows and ${headers.length} columns. Headers: ${headers.join(', ')}.`
  const plotSummary = `Plotting ${selectedColumns.size} columns as ${plotType} chart.`

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="viz">Visualization</TabsTrigger>
              <TabsTrigger value="insights" disabled={data.length === 0}>Insights</TabsTrigger>
            </TabsList>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Load Dataset
                  </>
                )}
              </Button>

              {data.length > 0 && (
                <span className="text-sm text-gray-600">
                  {data.length} rows × {headers.length} cols
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'viz' && data.length > 0 && (
              <>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
                  {plotTypes.map(({ type, icon: Icon, label }) => (
                    <Button
                      key={type}
                      variant={plotType === type ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setPlotType(type)}
                      title={label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <div className="h-6 w-px bg-gray-200 mx-2" />
              </>
            )}

            <AIInsightsButton
              onClick={() => setActiveTab('insights')}
              disabled={data.length === 0}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50 p-4">
          <TabsContent value="viz" className="h-full m-0">
            {data.length === 0 ? (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white">
                <div className="text-center text-gray-500">
                  <Upload className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-semibold mb-2">Load a Dataset</h3>
                  <p className="text-sm">Upload a CSV file to start visualizing</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex gap-4 overflow-hidden">
                {/* Left Panel - Spreadsheet */}
                <div className="w-1/2 overflow-hidden">
                  <Spreadsheet
                    data={data}
                    headers={headers}
                    selectedColumns={selectedColumns}
                    onColumnSelect={handleColumnClick}
                    selectedRows={selectedRows}
                    onRowSelect={handleRowSelect}
                    onSelectAllRows={handleSelectAllRows}
                  />
                </div>

                {/* Right Panel - Plot Visualization */}
                <div className="w-1/2 overflow-hidden bg-white rounded-lg border shadow-sm p-4">
                  <PlotVisualization
                    data={data}
                    headers={headers}
                    selectedColumns={Array.from(selectedColumns)}
                    plotType={plotType}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="h-full m-0">
            <InsightsTab dataSummary={dataSummary} plotSummary={plotSummary} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
