import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import type { ApplicationFormField } from '../../types/applicationForm'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

type SortableFormFieldRowProps = {
  field: ApplicationFormField
  editable: boolean
  index: number
  isFirst: boolean
  isLast: boolean
  aiSuggested?: boolean
  onEdit: (field: ApplicationFormField) => void
  onRemove: (fieldId: string) => void
  onMoveUp: (fieldId: string) => void
  onMoveDown: (fieldId: string) => void
}

export function SortableFormFieldRow({
  field,
  editable,
  index,
  isFirst,
  isLast,
  aiSuggested = false,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SortableFormFieldRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: !editable })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'sortable-field sortable-field--dragging' : 'sortable-field'}
    >
      <Card className="field-ledger__row">
        <span className="field-ledger__sequence" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="field-ledger__content">
          <div className="field-ledger__title-row">
            <h3>{field.label}</h3>
            <Badge tone={field.required ? 'warning' : 'neutral'}>
              {field.required ? 'Required' : 'Optional'}
            </Badge>
            {aiSuggested ? <Badge>AI Suggested</Badge> : null}
          </div>
          <div className="field-ledger__meta">
            <span>{field.type.replace('_', ' ')}</span>
            <code>{field.key}</code>
            {field.type === 'MULTI_SELECT' ? (
              <span>{field.options?.length ?? 0} options</span>
            ) : null}
          </div>
        </div>
        {editable ? (
          <div className="field-ledger__actions">
            <button
              type="button"
              className="icon-button drag-handle"
              aria-label={`Drag ${field.label} to reorder`}
              title="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => onMoveUp(field.id)}
              disabled={isFirst}
              aria-label={`Move ${field.label} up`}
              title="Move up"
            >
              <ArrowUp size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => onMoveDown(field.id)}
              disabled={isLast}
              aria-label={`Move ${field.label} down`}
              title="Move down"
            >
              <ArrowDown size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => onEdit(field)}
              aria-label={`Edit ${field.label}`}
              title="Edit field"
            >
              <Pencil size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-button icon-button--danger"
              onClick={() => onRemove(field.id)}
              aria-label={`Remove ${field.label}`}
              title="Remove field"
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
