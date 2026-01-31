'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface VariableItemProps {
  name: string
  dataPreview: number[]
}

export function VariableItem({ name, dataPreview }: VariableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `variable-${name}`,
    data: { type: 'variable', name }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border border-gray-300 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="font-semibold text-sm text-gray-800 mb-1">{name}</div>
      <div className="text-xs text-gray-500">
        {dataPreview.slice(0, 3).map((val, i) => (
          <span key={i}>
            {val.toFixed(2)}
            {i < 2 && ', '}
          </span>
        ))}
        {dataPreview.length > 3 && '...'}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {dataPreview.length} values
      </div>
    </div>
  )
}
