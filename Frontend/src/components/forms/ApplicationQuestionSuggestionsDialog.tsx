import { LoaderCircle, Sparkles } from 'lucide-react'
import type { SuggestedApplicationQuestion } from '../../types/applicationQuestionSuggestion'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { ApplicationQuestionSuggestions } from './ApplicationQuestionSuggestions'

type ApplicationQuestionSuggestionsDialogProps = {
  open: boolean
  loading: boolean
  progressMessage?: string
  suggestions: SuggestedApplicationQuestion[]
  selectedIds: string[]
  error?: string
  onSelectionChange: (suggestionIds: string[]) => void
  onAddSelected: () => void
  onClose: () => void
}

export function ApplicationQuestionSuggestionsDialog({
  open,
  loading,
  progressMessage,
  suggestions,
  selectedIds,
  error,
  onSelectionChange,
  onAddSelected,
  onClose,
}: ApplicationQuestionSuggestionsDialogProps) {
  return (
    <Dialog
      open={open}
      title="AI Suggested Application Questions"
      onClose={onClose}
    >
      <div className="suggestion-dialog__intro">
        <span className="suggestion-dialog__mark" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <div>
          <Badge>Human review required</Badge>
          <p>
            Review the evidence gaps identified from this role and its evaluation
            rubric. Nothing is added until you select it.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="suggestion-loading" role="status" aria-live="polite">
          <LoaderCircle size={21} aria-hidden="true" />
          <div>
            <strong>Preparing recommendations</strong>
            <p>{progressMessage ?? 'Analyzing job requirements...'}</p>
          </div>
        </div>
      ) : null}

      {!loading && error ? (
        <p className="message-list message-list--error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && suggestions.length > 0 ? (
        <ApplicationQuestionSuggestions
          suggestions={suggestions}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
        />
      ) : null}

      {!loading && !error && suggestions.length === 0 ? (
        <div className="empty-state suggestion-empty-state">
          <h3>Current form covers the evidence needs</h3>
          <p>
            No additional application questions are recommended for the current
            form.
          </p>
        </div>
      ) : null}

      <div className="dialog__actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onAddSelected}
          disabled={loading || selectedIds.length === 0}
        >
          Add Selected Questions
        </Button>
      </div>
    </Dialog>
  )
}
