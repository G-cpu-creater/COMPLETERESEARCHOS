'use client'

import { useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { Upload, Save } from 'lucide-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

interface SpreadsheetPanelProps {
  columns: string[]
  rows: any[][]
  isDirty: boolean
  isLoading: boolean
  onCellEdit: (rowIndex: number, colIndex: number, value: any) => void
  onHeaderEdit: (colIndex: number, newName: string) => void
  onSave: () => void
  onUpload: (file: File) => void
}

/**
 * Excel-like spreadsheet component using AG Grid
 * Features: Editable cells, editable headers, row index column, ribbon toolbar
 */
export function SpreadsheetPanel({
  columns,
  rows,
  isDirty,
  isLoading,
  onCellEdit,
  onHeaderEdit,
  onSave,
  onUpload
}: SpreadsheetPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingHeader, setEditingHeader] = useState<number | null>(null)

  // Custom header component for editable column names
  const EditableHeader = (props: any) => {
    const colIndex = props.column.getColId().replace('col_', '')
    const isEditing = editingHeader === parseInt(colIndex)

    if (isEditing) {
      return (
        <input
          type="text"
          defaultValue={props.displayName}
          autoFocus
          className="w-full px-2 py-1 border border-blue-500 rounded"
          onBlur={(e) => {
            onHeaderEdit(parseInt(colIndex), e.target.value)
            setEditingHeader(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onHeaderEdit(parseInt(colIndex), e.currentTarget.value)
              setEditingHeader(null)
            } else if (e.key === 'Escape') {
              setEditingHeader(null)
            }
          }}
        />
      )
    }

    return (
      <div
        className="w-full h-full flex items-center cursor-pointer hover:bg-gray-100"
        onDoubleClick={() => setEditingHeader(parseInt(colIndex))}
      >
        {props.displayName}
      </div>
    )
  }

  // Build AG Grid column definitions
  const columnDefs: ColDef[] = [
    // Row index column (pinned, non-editable)
    {
      field: 'rowIndex',
      headerName: '#',
      pinned: 'left',
      width: 60,
      editable: false,
      cellClass: 'bg-gray-50 font-semibold text-gray-600',
      suppressMovable: true,
      lockPosition: true
    },
    // Data columns (editable)
    ...columns.map((colName, idx) => ({
      field: `col_${idx}`,
      headerName: colName,
      headerComponent: EditableHeader,
      editable: true,
      flex: 1,
      minWidth: 120,
      resizable: true,
      sortable: true,
      filter: true
    }))
  ]

  // Transform rows data for AG Grid
  const rowData = rows.map((row, rowIndex) => {
    const rowObj: any = { rowIndex: rowIndex + 1 }
    row.forEach((cellValue, colIndex) => {
      rowObj[`col_${colIndex}`] = cellValue
    })
    return rowObj
  })

  // Handle cell value changes
  const handleCellValueChanged = (event: any) => {
    const colId = event.column.getColId()
    if (colId === 'rowIndex') return // Ignore row index column

    const colIndex = parseInt(colId.replace('col_', ''))
    const rowIndex = event.rowIndex
    const newValue = event.newValue

    onCellEdit(rowIndex, colIndex, newValue)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading spreadsheet...</p>
        </div>
      </div>
    )
  }

  // Debug logging
  console.log('SpreadsheetPanel render:', {
    columnsCount: columns.length,
    rowsCount: rows.length,
    columnDefsCount: columnDefs.length,
    rowDataCount: rowData.length
  })

  return (
    <div className="h-full flex flex-col bg-white border-2 border-red-500">
      {/* Home Ribbon - Excel-like toolbar */}
      <div className="border-b bg-gray-50 p-3 flex items-center gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* Upload button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        
        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />
        
        {/* Save button */}
        <Button
          onClick={onSave}
          disabled={!isDirty}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        
        {/* Unsaved changes indicator */}
        {isDirty && (
          <span className="text-xs text-orange-600 font-medium">
            • Unsaved changes
          </span>
        )}
        
        {/* Info */}
        <div className="ml-auto text-xs text-gray-500">
          {rows.length} rows × {columns.length} columns
        </div>
      </div>

      {/* AG Grid Spreadsheet */}
      <div className="flex-1 ag-theme-alpine border-2 border-blue-500" style={{ height: 'calc(100% - 60px)', minHeight: '500px' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true
          }}
          domLayout="normal"
          onCellValueChanged={handleCellValueChanged}
          suppressMovableColumns={false}
          enableRangeSelection={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={false}
        />
      </div>
    </div>
  )
}
