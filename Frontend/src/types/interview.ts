export type InterviewStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type InterviewQuestionType =
  | 'CORE'
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'FOLLOW_UP'
  | 'VERIFICATION'

export type InterviewQuestion = {
  id: string
  type: InterviewQuestionType
  question: string
  reason: string
  sourceContext?: string
}

export type Interviewer = {
  id: string
  name: string
  role: string
}

export type Interview = {
  id: string
  applicationId: string
  scheduledStart: string
  scheduledEnd: string
  timezone: string
  status: InterviewStatus
  interviewers: Interviewer[]
  questions: InterviewQuestion[]
}
