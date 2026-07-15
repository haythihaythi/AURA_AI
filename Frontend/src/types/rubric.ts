export type RubricCriterion = {
  key: string
  name: string
  description: string
  evaluationGuidance: string
  weight: number
}

export type EvaluationRubric = {
  id: string
  jobId: string
  name: string
  criteria: RubricCriterion[]
}
