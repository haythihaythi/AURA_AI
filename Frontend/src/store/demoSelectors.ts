import type { Application } from '../types/application'
import type { ApplicationForm } from '../types/applicationForm'
import type { Candidate } from '../types/candidate'
import type { Communication } from '../types/communication'
import type { Decision } from '../types/decision'
import type { Evaluation } from '../types/evaluation'
import type { Interview } from '../types/interview'
import type { Job } from '../types/job'
import type { Transcript } from '../types/transcript'
import type { DemoState } from './demoReducer'

export function selectJobById(
  state: DemoState,
  jobId: string,
): Job | undefined {
  return state.jobs.find((job) => job.id === jobId)
}

export function selectCandidateById(
  state: DemoState,
  candidateId: string,
): Candidate | undefined {
  return state.candidates.find((candidate) => candidate.id === candidateId)
}

export function selectApplicationById(
  state: DemoState,
  applicationId: string,
): Application | undefined {
  return state.applications.find(
    (application) => application.id === applicationId,
  )
}

export function selectApplicationsByJobId(
  state: DemoState,
  jobId: string,
): Application[] {
  return state.applications.filter((application) => application.jobId === jobId)
}

export function selectApplicationFormsByJobId(
  state: DemoState,
  jobId: string,
): ApplicationForm[] {
  return state.applicationForms
    .filter((form) => form.jobId === jobId)
    .sort((left, right) => right.version - left.version)
}

export function selectPublishedApplicationFormByJobId(
  state: DemoState,
  jobId: string,
): ApplicationForm | undefined {
  return selectApplicationFormsByJobId(state, jobId).find(
    (form) => form.status === 'PUBLISHED',
  )
}

export function selectApplicationFormById(
  state: DemoState,
  formId: string,
): ApplicationForm | undefined {
  return state.applicationForms.find((form) => form.id === formId)
}

export function selectDraftApplicationFormByJobId(
  state: DemoState,
  jobId: string,
): ApplicationForm | undefined {
  return selectApplicationFormsByJobId(state, jobId).find(
    (form) => form.status === 'DRAFT',
  )
}

export function selectCandidateForApplication(
  state: DemoState,
  applicationId: string,
): Candidate | undefined {
  const application = selectApplicationById(state, applicationId)

  return application
    ? selectCandidateById(state, application.candidateId)
    : undefined
}

function selectLatestEvaluationByType(
  state: DemoState,
  applicationId: string,
  evaluationType: 'SCREENING' | 'FINAL',
): Evaluation | undefined {
  return state.evaluations
    .filter(
      (evaluation) =>
        evaluation.applicationId === applicationId &&
        evaluation.evaluationType === evaluationType,
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]
}

export function selectLatestScreeningEvaluation(
  state: DemoState,
  applicationId: string,
): Evaluation | undefined {
  return selectLatestEvaluationByType(state, applicationId, 'SCREENING')
}

export function selectLatestFinalEvaluation(
  state: DemoState,
  applicationId: string,
): Evaluation | undefined {
  return selectLatestEvaluationByType(state, applicationId, 'FINAL')
}

export function selectInterviewByApplicationId(
  state: DemoState,
  applicationId: string,
): Interview | undefined {
  return state.interviews.find(
    (interview) => interview.applicationId === applicationId,
  )
}

export function selectTranscriptByInterviewId(
  state: DemoState,
  interviewId: string,
): Transcript | undefined {
  return state.transcripts.find(
    (transcript) => transcript.interviewId === interviewId,
  )
}

export function selectCommunicationsByApplicationId(
  state: DemoState,
  applicationId: string,
): Communication[] {
  return state.communications.filter(
    (communication) => communication.applicationId === applicationId,
  )
}

export function selectDecisionByApplicationId(
  state: DemoState,
  applicationId: string,
): Decision | undefined {
  return state.decisions
    .filter((decision) => decision.applicationId === applicationId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]
}

export type DashboardMetrics = {
  activeJobs: number
  totalCandidates: number
  pendingAiReviews: number
  interviewsToday: number
}

export function selectDashboardMetrics(
  state: DemoState,
  now: Date,
): DashboardMetrics {
  const calendarDate = now.toISOString().slice(0, 10)

  return {
    activeJobs: state.jobs.filter((job) => job.status === 'OPEN').length,
    totalCandidates: state.candidates.length,
    pendingAiReviews: state.applications.filter((application) => {
      const evaluation = selectLatestScreeningEvaluation(state, application.id)
      const decision = selectDecisionByApplicationId(state, application.id)

      return evaluation?.recommendation === 'REVIEW' && !decision
    }).length,
    interviewsToday: state.interviews.filter(
      (interview) => interview.scheduledStart.slice(0, 10) === calendarDate,
    ).length,
  }
}

export type HiringFunnel = {
  applications: number
  aiScreened: number
  shortlisted: number
  interviewed: number
  selected: number
}

export function selectHiringFunnel(
  state: DemoState,
  jobId?: string,
): HiringFunnel {
  const applications = jobId
    ? selectApplicationsByJobId(state, jobId)
    : state.applications

  return {
    applications: applications.length,
    aiScreened: applications.filter((application) =>
      state.evaluations.some(
        (evaluation) =>
          evaluation.applicationId === application.id &&
          evaluation.evaluationType === 'SCREENING' &&
          evaluation.status === 'COMPLETED',
      ),
    ).length,
    shortlisted: applications.filter((application) => {
      const recommendation = selectLatestScreeningEvaluation(
        state,
        application.id,
      )?.recommendation

      return recommendation === 'STRONG_YES' || recommendation === 'YES'
    }).length,
    interviewed: applications.filter((application) =>
      state.interviews.some(
        (interview) =>
          interview.applicationId === application.id &&
          interview.status === 'COMPLETED',
      ),
    ).length,
    selected: applications.filter((application) => {
      const decision = selectDecisionByApplicationId(state, application.id)

      return (
        application.status === 'SELECTED' ||
        decision?.humanDecision === 'SELECTED'
      )
    }).length,
  }
}
