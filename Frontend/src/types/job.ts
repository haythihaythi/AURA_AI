export type JobStatus = 'DRAFT' | 'OPEN' | 'CLOSED'

export type SkillRequirement = {
  name: string
  priority: 'REQUIRED' | 'PREFERRED'
  minimumYears?: number
}

export type Job = {
  id: string
  title: string
  department: string
  description: string
  status: JobStatus
  positionsCount: number
  applicationDeadline: string
  requiredSkills: SkillRequirement[]
  createdAt: string
}
