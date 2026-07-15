import type { ApplicationFormField } from './applicationForm'

export type SuggestedApplicationQuestion = {
  id: string
  field: ApplicationFormField
  reason: string
  targetCriterionKeys: string[]
}

export type ApplicationQuestionSuggestionResult = {
  jobId: string
  suggestions: SuggestedApplicationQuestion[]
}
