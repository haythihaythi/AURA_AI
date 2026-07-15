import type { SuggestedApplicationQuestion } from '../../types/applicationQuestionSuggestion'
import { Badge } from '../ui/Badge'

type ApplicationQuestionSuggestionsProps = {
  suggestions: SuggestedApplicationQuestion[]
  selectedIds: string[]
  onSelectionChange: (suggestionIds: string[]) => void
}

function formatCriterionKey(key: string): string {
  return key
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

export function ApplicationQuestionSuggestions({
  suggestions,
  selectedIds,
  onSelectionChange,
}: ApplicationQuestionSuggestionsProps) {
  const selectedIdSet = new Set(selectedIds)

  const updateSelection = (suggestionId: string, selected: boolean) => {
    onSelectionChange(
      selected
        ? [...selectedIds, suggestionId]
        : selectedIds.filter((id) => id !== suggestionId),
    )
  }

  return (
    <div className="suggestion-list">
      {suggestions.map((suggestion) => {
        const checked = selectedIdSet.has(suggestion.id)

        return (
          <label
            key={suggestion.id}
            className={
              checked
                ? 'suggestion-card suggestion-card--selected'
                : 'suggestion-card'
            }
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) =>
                updateSelection(suggestion.id, event.target.checked)
              }
            />
            <span className="suggestion-card__body">
              <span className="suggestion-card__question">
                {suggestion.field.label}
              </span>
              <span className="suggestion-card__section">
                <strong>Why AI suggested this</strong>
                <span>{suggestion.reason}</span>
              </span>
              <span className="suggestion-card__footer">
                <span className="suggestion-card__targets">
                  <strong>Targets</strong>
                  {suggestion.targetCriterionKeys.map((key) => (
                    <Badge key={key}>{formatCriterionKey(key)}</Badge>
                  ))}
                </span>
                <Badge>{suggestion.field.type.replace('_', ' ')}</Badge>
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
