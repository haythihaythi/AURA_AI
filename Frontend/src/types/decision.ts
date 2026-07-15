import type { Recommendation } from './evaluation'

export type ReviewAction = 'CONFIRM' | 'OVERRIDE'

export type HumanDecision =
  | 'NEXT_STAGE'
  | 'SELECTED'
  | 'REJECTED'
  | 'ON_HOLD'

export type Decision = {
  id: string
  applicationId: string
  evaluationId: string
  reviewAction: ReviewAction
  aiRecommendation: Recommendation
  humanRecommendation: Recommendation
  humanDecision: HumanDecision
  overrideReason?: string
  createdAt: string
}
