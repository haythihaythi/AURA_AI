import type { CriterionScore } from '../types/evaluation'

export function calculateWeightedScore(
  criterionScores: CriterionScore[],
): number {
  const totalWeight = criterionScores.reduce(
    (total, criterion) => total + criterion.weight,
    0,
  )

  if (totalWeight !== 100) {
    throw new Error(`Criterion weights must total 100; received ${totalWeight}`)
  }

  const weightedScore = criterionScores.reduce(
    (total, criterion) => total + criterion.score * criterion.weight,
    0,
  )

  return Math.round(weightedScore / 10) / 10
}
