export type Recommendation =
  | 'STRONG_YES'
  | 'YES'
  | 'REVIEW'
  | 'NO'
  | 'STRONG_NO'

export type EvaluationType = 'SCREENING' | 'INTERVIEW' | 'FINAL'

export type EvaluationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

export type EvidenceSourceType =
  | 'APPLICATION_ANSWER'
  | 'DOCUMENT'
  | 'TRANSCRIPT_SEGMENT'
  | 'HUMAN_NOTE'

export type EvidenceReference = {
  sourceType: EvidenceSourceType
  sourceId: string
  excerpt: string
  timestampLabel?: string
}

export type EvaluationInsight = {
  id: string
  title: string
  description: string
  evidence: EvidenceReference[]
}

export type CriterionScore = {
  criterionKey: string
  name: string
  weight: number
  score: number
  rationale: string
  evidence: EvidenceReference[]
}

export type Evaluation = {
  id: string
  applicationId: string
  evaluationType: EvaluationType
  status: EvaluationStatus
  overallScore: number
  recommendation: Recommendation
  confidence: number
  summary: string
  strengths: EvaluationInsight[]
  concerns: EvaluationInsight[]
  criterionScores: CriterionScore[]
  createdAt: string
}
