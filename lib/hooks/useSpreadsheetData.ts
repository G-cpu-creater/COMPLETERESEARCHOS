import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useDebouncedCallback } from 'use-debounce'
import * as XLSX from 'xlsx'

interface SpreadsheetState {
  datasetId: string | null
  columns: string[]
  rows: any[][]
  isDirty: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Custom hook for managing spreadsheet data with auto-save
 * Handles loading, editing, and persistence of Excel-like spreadsheet data
 */
export function useSpreadsheetData(projectId: string) {
  const { toast } = useToast()
  
  const [state, setState] = useState<SpreadsheetState>({
    datasetId: null,
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // Default Excel columns
    rows: Array.from({ length: 20 }, () => Array(10).fill('')), // 20 empty rows
    isDirty: false,
    isLoading: true,
    error: null
  })

  // Debounced auto-save (2 seconds after last edit)
  const debouncedSave = useDebouncedCallback(async (datasetId: string | null, columns: string[], rows: any[][]) => {
    try {
      const parsedData = { columns, rows }

      if (datasetId) {
        // Update existing dataset
        const res = await fetch(`/api/datasets/${datasetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parsedData })
        })

        if (!res.ok) throw new Error('Failed to save')
        
        toast({
          title: 'Saved',
          description: 'Spreadsheet auto-saved successfully',
          duration: 2000
        })
      } else {
        // Create new dataset
        const res = await fetch('/api/datasets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            name: `Spreadsheet ${new Date().toLocaleString()}`,
            parsedData
          })
        })

        if (!res.ok) throw new Error('Failed to create dataset')
        
        const { dataset } = await res.json()
        setState(prev => ({ ...prev, datasetId: dataset.id }))
        
        toast({
          title: 'Created',
          description: 'New spreadsheet saved',
          duration: 2000
        })
      }

      setState(prev => ({ ...prev, isDirty: false }))
    } catch (error) {
      console.error('Auto-save error:', error)
      toast({
        title: 'Save failed',
        description: 'Failed to auto-save spreadsheet',
        variant: 'destructive'
      })
    }
  }, 2000)

  // Load dataset on mount
  useEffect(() => {
    async function loadDataset() {
      try {
        setState(prev => ({ ...prev, isLoading: true }))
        
        const res = await fetch(`/api/datasets?projectId=${projectId}`)
        if (!res.ok) throw new Error('Failed to fetch datasets')
        
        const { datasets } = await res.json()
        
        // Load the most recent spreadsheet dataset
        const spreadsheetDataset = datasets.find((d: any) => d.technique === 'spreadsheet')
        
        if (spreadsheetDataset && spreadsheetDataset.parsedData) {
          setState({
            datasetId: spreadsheetDataset.id,
            columns: spreadsheetDataset.parsedData.columns || [],
            rows: spreadsheetDataset.parsedData.rows || [],
            isDirty: false,
            isLoading: false,
            error: null
          })
        } else {
          // No existing dataset - use default empty spreadsheet
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Load dataset error:', error)
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Failed to load spreadsheet'
        }))
      }
    }

    if (projectId) {
      loadDataset()
    }
  }, [projectId])

  // Update a single cell
  const updateCell = useCallback((rowIndex: number, colIndex: number, value: any) => {
    setState(prev => {
      const newRows = prev.rows.map((row, rIdx) => 
        rIdx === rowIndex 
          ? row.map((cell, cIdx) => cIdx === colIndex ? value : cell)
          : row
      )
      
      // Trigger auto-save
      debouncedSave(prev.datasetId, prev.columns, newRows)
      
      return { ...prev, rows: newRows, isDirty: true }
    })
  }, [debouncedSave])

  // Update column name (header)
  const updateColumnName = useCallback((colIndex: number, newName: string) => {
    setState(prev => {
      const newColumns = prev.columns.map((col, idx) => 
        idx === colIndex ? newName : col
      )
      
      // Trigger auto-save
      debouncedSave(prev.datasetId, newColumns, prev.rows)
      
      return { ...prev, columns: newColumns, isDirty: true }
    })
  }, [debouncedSave])

  // Manual save (triggered by Save button)
  const saveDataset = useCallback(async () => {
    if (!state.isDirty) return

    try {
      const parsedData = { columns: state.columns, rows: state.rows }

      if (state.datasetId) {
        const res = await fetch(`/api/datasets/${state.datasetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parsedData })
        })

        if (!res.ok) throw new Error('Failed to save')
      } else {
        const res = await fetch('/api/datasets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            name: `Spreadsheet ${new Date().toLocaleString()}`,
            parsedData
          })
        })

        if (!res.ok) throw new Error('Failed to create dataset')
        
        const { dataset } = await res.json()
        setState(prev => ({ ...prev, datasetId: dataset.id }))
      }

      setState(prev => ({ ...prev, isDirty: false }))
      
      toast({
        title: 'Saved',
        description: 'Spreadsheet saved successfully'
      })
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: 'Error',
        description: 'Failed to save spreadsheet',
        variant: 'destructive'
      })
    }
  }, [state, projectId, toast])

  // Upload and parse CSV/XLSX file
  const uploadFile = useCallback(async (file: File) => {
    try {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

          if (jsonData.length === 0) {
            toast({
              title: 'Empty file',
              description: 'The uploaded file is empty',
              variant: 'destructive'
            })
            return
          }

          // First row = column headers
          const columns = jsonData[0].map((col: any) => String(col || ''))
          // Remaining rows = data
          const rows = jsonData.slice(1)

          setState(prev => ({
            ...prev,
            columns,
            rows,
            isDirty: true
          }))

          // Save immediately after upload
          const parsedData = { columns, rows }
          const res = await fetch('/api/datasets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId,
              name: file.name,
              parsedData
            })
          })

          if (!res.ok) throw new Error('Failed to save uploaded data')
          
          const { dataset } = await res.json()
          setState(prev => ({ ...prev, datasetId: dataset.id, isDirty: false }))

          toast({
            title: 'Upload successful',
            description: `Loaded ${rows.length} rows and ${columns.length} columns from ${file.name}`
          })
        } catch (error) {
          console.error('File parse error:', error)
          toast({
            title: 'Parse error',
            description: 'Failed to parse file. Please ensure it is a valid CSV or XLSX file.',
            variant: 'destructive'
          })
        }
      }

      reader.onerror = () => {
        toast({
          title: 'Read error',
          description: 'Failed to read file',
          variant: 'destructive'
        })
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file',
        variant: 'destructive'
      })
    }
  }, [projectId, toast])

  return {
    ...state,
    updateCell,
    updateColumnName,
    saveDataset,
    uploadFile
  }
}
