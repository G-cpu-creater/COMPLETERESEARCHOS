'use client'

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useAnalysisStore } from '@/lib/stores/analysisStore'
import { AnalysisCanvas } from './AnalysisCanvas'
import { VariableRibbon } from './VariableRibbon'

export function AnalysisPage() {
  const { createPlot, updatePlotAxis } = useAnalysisStore()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const dragData = active.data.current
    const dropData = over.data.current

    // Variable dragged to canvas - create new plot
    if (dragData?.type === 'variable' && dropData?.type === 'canvas') {
      const variableName = dragData.name
      
      // Calculate drop position relative to canvas
      const canvasRect = (over as any).rect?.current
      const dropPosition = {
        x: Math.max(20, (event.activatorEvent as MouseEvent).clientX - 250),
        y: Math.max(20, (event.activatorEvent as MouseEvent).clientY - 100)
      }
      
      createPlot(variableName, dropPosition)
    }
    
    // Variable dragged to axis - update axis
    if (dragData?.type === 'variable' && dropData?.type === 'axis') {
      const variableName = dragData.name
      const { plotId, axis } = dropData
      
      updatePlotAxis(plotId, axis, variableName)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative w-full h-screen overflow-hidden">
        <AnalysisCanvas />
        <VariableRibbon />
      </div>
    </DndContext>
  )
}
