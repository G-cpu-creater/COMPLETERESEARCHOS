'use client'

import { useParams } from 'next/navigation'
import { SpreadsheetPanel } from './SpreadsheetPanel'
import { useSpreadsheetData } from '@/lib/hooks/useSpreadsheetData'

export function VisualizationTab() {
  const params = useParams()
  const projectId = params.id as string

  const {
    columns,
    rows,
    isDirty,
    isLoading,
    updateCell,
    updateColumnName,
    saveDataset,
    uploadFile
  } = useSpreadsheetData(projectId)

  return (
    <div className="h-[calc(100vh-200px)]">
      <SpreadsheetPanel
        columns={columns}
        rows={rows}
        isDirty={isDirty}
        isLoading={isLoading}
        onCellEdit={updateCell}
        onHeaderEdit={updateColumnName}
        onSave={saveDataset}
        onUpload={uploadFile}
      />
    </div>
  )
}
