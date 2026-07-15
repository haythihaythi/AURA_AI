import type { Application } from '../types/application'
import type { ApplicationFormField } from '../types/applicationForm'
import type {
  ApplicationQuestionSuggestionResult,
  SuggestedApplicationQuestion,
} from '../types/applicationQuestionSuggestion'
import type {
  Communication,
  CommunicationType,
} from '../types/communication'
import type {
  Evaluation,
  EvidenceReference,
} from '../types/evaluation'
import type { Interview, InterviewQuestion } from '../types/interview'
import type { Job } from '../types/job'
import type { EvaluationRubric } from '../types/rubric'
import type { Transcript, TranscriptSegment } from '../types/transcript'
import { calculateWeightedScore } from '../utils/score'
import { demoDelay } from './demoDelay'
import { DemoServiceError } from './DemoServiceError'

export type CandidateScreeningResult = {
  evaluation: Evaluation
}

export type InterviewQuestionGenerationResult = {
  interviewId: string
  questions: InterviewQuestion[]
}

export type InterviewAnalysisInsight = {
  id: string
  title: string
  description: string
  evidence: EvidenceReference[]
}

export type InterviewAnalysisResult = {
  interviewId: string
  transcriptId: string
  summary: string
  strengths: InterviewAnalysisInsight[]
  concerns: InterviewAnalysisInsight[]
  evidence: InterviewAnalysisInsight[]
  unclearAreas: {
    id: string
    topic: string
    reason: string
  }[]
}

export type FinalEvaluationResult = {
  evaluation: Evaluation
}

export type CandidateEmailResult = {
  communication: Communication
}

export const screeningProgressMessages: readonly string[] = [
  'Reviewing candidate profile...',
  'Reading candidate evidence...',
  'Comparing job requirements...',
  'Evaluating selection criteria...',
]

export const interviewQuestionProgressMessages: readonly string[] = [
  'Reviewing candidate experience...',
  'Identifying missing evidence...',
  'Preparing interview questions...',
]

export const interviewAnalysisProgressMessages: readonly string[] = [
  'Analyzing candidate responses...',
  'Extracting interview evidence...',
  'Reviewing strengths and concerns...',
  'Generating interview summary...',
]

export const finalEvaluationProgressMessages: readonly string[] = [
  'Combining application evidence...',
  'Reviewing interview evidence...',
  'Scoring evaluation criteria...',
  'Preparing candidate recommendation...',
]

export const emailProgressMessages: readonly string[] = [
  'Preparing candidate-safe context...',
  'Applying communication template...',
  'Generating professional email draft...',
]

export const applicationQuestionSuggestionProgressMessages: readonly string[] = [
  'Analyzing job requirements...',
  'Reviewing evaluation criteria...',
  'Identifying missing candidate evidence...',
  'Preparing application questions...',
]

function normalizeSuggestionKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')
}

function createSuggestedQuestion(input: {
  id: string
  field: ApplicationFormField
  reason: string
  targetCriterionKeys: string[]
}): SuggestedApplicationQuestion {
  return {
    id: input.id,
    field: {
      ...input.field,
      options: input.field.options?.map((option) => ({ ...option })),
    },
    reason: input.reason,
    targetCriterionKeys: [...input.targetCriterionKeys],
  }
}

export async function suggestApplicationQuestions(input: {
  job: Job
  rubric: EvaluationRubric
  existingFields: ApplicationFormField[]
  delayMs?: number
}): Promise<ApplicationQuestionSuggestionResult> {
  const { job, rubric, existingFields } = input

  if (rubric.jobId !== job.id) {
    throw new DemoServiceError(
      'RUBRIC_NOT_FOUND',
      `The evaluation rubric does not belong to job ${job.id}.`,
    )
  }

  if (rubric.criteria.length === 0) {
    throw new DemoServiceError(
      'INVALID_SERVICE_INPUT',
      'Application question suggestions require rubric criteria.',
    )
  }

  const skillNames = job.requiredSkills.map((skill) =>
    normalizeSuggestionKey(skill.name),
  )
  const criterionKeys = new Set(
    rubric.criteria.map((criterion) => criterion.key.trim().toLowerCase()),
  )
  const existingFieldKeys = new Set(
    existingFields.map((field) => normalizeSuggestionKey(field.key)),
  )
  const hasSkill = (...fragments: string[]) =>
    skillNames.some((skillName) =>
      fragments.some((fragment) => skillName.includes(fragment)),
    )
  const hasCriteria = (...keys: string[]) =>
    keys.every((key) => criterionKeys.has(key))
  const suggestions: SuggestedApplicationQuestion[] = []

  const addSuggestion = (
    eligible: boolean,
    suggestion: SuggestedApplicationQuestion,
  ) => {
    if (
      eligible &&
      !existingFieldKeys.has(normalizeSuggestionKey(suggestion.field.key)) &&
      !suggestions.some(
        (item) =>
          item.id === suggestion.id || item.field.key === suggestion.field.key,
      )
    ) {
      suggestions.push(suggestion)
    }
  }

  addSuggestion(
    hasSkill('react') && hasCriteria('technical_skills', 'relevant_experience'),
    createSuggestedQuestion({
      id: 'suggestion-production-react-experience',
      field: {
        id: `field-${job.id}-production-react-experience`,
        key: 'production_react_experience',
        label:
          'Describe a React application you have built or maintained in production.',
        type: 'TEXTAREA',
        required: false,
        placeholder:
          'Describe the application, your responsibilities, and the technical decisions you made.',
        helpText:
          'Focus on your personal contribution and production responsibilities.',
      },
      reason:
        'The role requires React experience and the evaluation rubric measures technical skills and relevant experience.',
      targetCriterionKeys: ['technical_skills', 'relevant_experience'],
    }),
  )

  addSuggestion(
    hasSkill('rest api', 'api integration') &&
      hasCriteria('technical_skills', 'relevant_experience'),
    createSuggestedQuestion({
      id: 'suggestion-rest-api-experience',
      field: {
        id: `field-${job.id}-rest-api-experience`,
        key: 'rest_api_experience',
        label:
          'Describe your experience integrating frontend applications with REST APIs.',
        type: 'TEXTAREA',
        required: false,
        placeholder:
          'Share the integration challenges, your approach, and the outcome.',
        helpText: 'Focus on direct experience with REST API integration.',
      },
      reason:
        'The role lists REST API Integration as a required skill and the form needs direct evidence of that experience.',
      targetCriterionKeys: ['technical_skills', 'relevant_experience'],
    }),
  )

  addSuggestion(
    hasSkill('testing', 'vitest', 'playwright') &&
      hasCriteria('technical_skills'),
    createSuggestedQuestion({
      id: 'suggestion-automated-testing-experience',
      field: {
        id: `field-${job.id}-automated-testing-experience`,
        key: 'automated_testing_experience',
        label: 'How do you approach automated testing in React projects?',
        type: 'TEXTAREA',
        required: false,
        placeholder:
          'Describe the test levels, tools, and quality risks you prioritize.',
        helpText: 'Include a specific example if possible.',
      },
      reason:
        'The role lists Automated Testing as a preferred skill, but the current form does not request direct testing evidence.',
      targetCriterionKeys: ['technical_skills'],
    }),
  )

  addSuggestion(
    hasCriteria('problem_solving', 'technical_skills'),
    createSuggestedQuestion({
      id: 'suggestion-frontend-performance-debugging',
      field: {
        id: `field-${job.id}-frontend-performance-debugging`,
        key: 'frontend_performance_debugging',
        label:
          'Tell us about a frontend performance problem you investigated and how you solved it.',
        type: 'TEXTAREA',
        required: false,
        placeholder:
          'Explain how you diagnosed the problem, the change you made, and the result.',
        helpText: 'Use measurable outcomes where available.',
      },
      reason:
        'The Problem Solving criterion calls for evidence of technical diagnosis, tradeoffs, and measurable improvement.',
      targetCriterionKeys: ['problem_solving', 'technical_skills'],
    }),
  )

  addSuggestion(
    hasCriteria('problem_solving', 'communication', 'relevant_experience'),
    createSuggestedQuestion({
      id: 'suggestion-technical-ownership',
      field: {
        id: `field-${job.id}-technical-ownership`,
        key: 'technical_ownership',
        label:
          'Describe a technical decision you personally owned and explain the tradeoffs you considered.',
        type: 'TEXTAREA',
        required: false,
        placeholder:
          'Describe the context, options, your decision, and how you communicated it.',
        helpText: 'Focus on your personal ownership and decision process.',
      },
      reason:
        'The rubric evaluates problem solving, communication, and relevant experience, which benefit from a clear ownership example.',
      targetCriterionKeys: [
        'problem_solving',
        'communication',
        'relevant_experience',
      ],
    }),
  )

  await demoDelay(input.delayMs ?? 1700)

  return { jobId: job.id, suggestions }
}

function copyEvidence(evidence: EvidenceReference): EvidenceReference {
  return { ...evidence }
}

function copyEvaluation(evaluation: Evaluation): Evaluation {
  return {
    ...evaluation,
    strengths: evaluation.strengths.map((insight) => ({
      ...insight,
      evidence: insight.evidence.map(copyEvidence),
    })),
    concerns: evaluation.concerns.map((insight) => ({
      ...insight,
      evidence: insight.evidence.map(copyEvidence),
    })),
    criterionScores: evaluation.criterionScores.map((criterion) => ({
      ...criterion,
      evidence: criterion.evidence.map(copyEvidence),
    })),
  }
}

function formatTimestampLabel(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function findSegment(
  transcript: Transcript,
  textFragment: string,
): TranscriptSegment | undefined {
  const normalizedFragment = textFragment.toLowerCase()

  return transcript.segments.find((segment) =>
    segment.text.toLowerCase().includes(normalizedFragment),
  )
}

function createTranscriptInsight(
  id: string,
  title: string,
  description: string,
  segment: TranscriptSegment,
): InterviewAnalysisInsight {
  return {
    id,
    title,
    description,
    evidence: [
      {
        sourceType: 'TRANSCRIPT_SEGMENT',
        sourceId: segment.id,
        excerpt: segment.text,
        timestampLabel: formatTimestampLabel(segment.startMs),
      },
    ],
  }
}

export async function runCandidateScreening(input: {
  applicationId: string
  applications: Application[]
  evaluations: Evaluation[]
  delayMs?: number
}): Promise<CandidateScreeningResult> {
  const application = input.applications.find(
    (item) => item.id === input.applicationId,
  )

  if (!application) {
    throw new DemoServiceError(
      'APPLICATION_NOT_FOUND',
      `Application ${input.applicationId} was not found.`,
    )
  }

  await demoDelay(input.delayMs ?? 1800)

  const evaluation = input.evaluations
    .filter(
      (item) =>
        item.applicationId === application.id &&
        item.evaluationType === 'SCREENING' &&
        item.status === 'COMPLETED',
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]

  if (!evaluation) {
    throw new DemoServiceError(
      'SCREENING_RESULT_NOT_FOUND',
      `No completed screening result exists for application ${application.id}.`,
    )
  }

  return { evaluation: copyEvaluation(evaluation) }
}

export async function generateInterviewQuestions(input: {
  interviewId: string
  interviews: Interview[]
  delayMs?: number
}): Promise<InterviewQuestionGenerationResult> {
  const interview = input.interviews.find(
    (item) => item.id === input.interviewId,
  )

  if (!interview) {
    throw new DemoServiceError(
      'INTERVIEW_NOT_FOUND',
      `Interview ${input.interviewId} was not found.`,
    )
  }

  await demoDelay(input.delayMs ?? 1600)

  return {
    interviewId: interview.id,
    questions: interview.questions.map((question) => ({ ...question })),
  }
}

export async function analyzeInterview(input: {
  interviewId: string
  interviews: Interview[]
  transcripts: Transcript[]
  delayMs?: number
}): Promise<InterviewAnalysisResult> {
  const interview = input.interviews.find(
    (item) => item.id === input.interviewId,
  )

  if (!interview) {
    throw new DemoServiceError(
      'INTERVIEW_NOT_FOUND',
      `Interview ${input.interviewId} was not found.`,
    )
  }

  const transcript = input.transcripts.find(
    (item) =>
      item.interviewId === interview.id && item.status === 'COMPLETED',
  )

  if (!transcript) {
    throw new DemoServiceError(
      'TRANSCRIPT_NOT_FOUND',
      `No completed transcript exists for interview ${interview.id}.`,
    )
  }

  await demoDelay(input.delayMs ?? 2200)

  const strengths: InterviewAnalysisInsight[] = []
  const concerns: InterviewAnalysisInsight[] = []
  const architectureSegment = findSegment(transcript, 'owned the React architecture')
  const stateManagementSegment = findSegment(transcript, 'separated server state')
  const performanceSegment = findSegment(transcript, 'profiling showed')
  const collaborationSegment = findSegment(transcript, 'invited challenges')
  const backendSegment = findSegment(transcript, 'backend team owned')
  const testingSegment = findSegment(
    transcript,
    'not yet owned an end-to-end testing strategy',
  )

  if (architectureSegment) {
    strengths.push(
      createTranscriptInsight(
        'analysis-strength-architecture',
        'Frontend architecture ownership',
        'The candidate clearly described ownership of the React architecture and frontend delivery plan.',
        architectureSegment,
      ),
      createTranscriptInsight(
        'analysis-strength-project-ownership',
        'Project ownership',
        'The candidate distinguished personal delivery and review responsibilities within the project.',
        architectureSegment,
      ),
    )
  }

  if (stateManagementSegment) {
    strengths.push(
      createTranscriptInsight(
        'analysis-strength-state-management',
        'React and state-management knowledge',
        'The candidate explained a deliberate separation between server state and local interface state.',
        stateManagementSegment,
      ),
    )
  }

  if (performanceSegment) {
    strengths.push(
      createTranscriptInsight(
        'analysis-strength-performance',
        'Performance debugging',
        'The candidate used profiling to identify repeated transformations and reported a measurable latency improvement.',
        performanceSegment,
      ),
    )
  }

  if (collaborationSegment) {
    strengths.push(
      createTranscriptInsight(
        'analysis-strength-collaboration',
        'Team collaboration',
        'The candidate documented a technical tradeoff, invited challenges, and tested the proposal before adoption.',
        collaborationSegment,
      ),
    )
  }

  if (backendSegment) {
    concerns.push(
      createTranscriptInsight(
        'analysis-concern-backend',
        'Backend implementation responsibility remains unclear',
        'The candidate contributed to API contracts but did not own production service or database implementation.',
        backendSegment,
      ),
    )
  }

  if (testingSegment) {
    concerns.push(
      createTranscriptInsight(
        'analysis-concern-testing',
        'Automated testing depth is limited',
        'The candidate has component and integration testing experience but has not owned an end-to-end strategy.',
        testingSegment,
      ),
    )
  }

  const evidence = [...strengths, ...concerns].map((insight) => ({
    ...insight,
    evidence: insight.evidence.map(copyEvidence),
  }))
  const unclearAreas = [
    ...(backendSegment
      ? [
          {
            id: 'analysis-unclear-backend',
            topic: 'Backend ownership',
            reason:
              'Production backend implementation depth was outside the candidate’s stated responsibilities.',
          },
        ]
      : []),
    ...(testingSegment
      ? [
          {
            id: 'analysis-unclear-testing',
            topic: 'Testing strategy ownership',
            reason:
              'The transcript does not demonstrate ownership of a complete end-to-end testing strategy.',
          },
        ]
      : []),
  ]
  const summary =
    architectureSegment && performanceSegment
      ? 'The candidate demonstrated frontend architecture ownership and described concrete React performance debugging experience.'
      : 'The interview transcript contains limited evidence for a detailed technical analysis.'

  return {
    interviewId: interview.id,
    transcriptId: transcript.id,
    summary,
    strengths,
    concerns,
    evidence,
    unclearAreas,
  }
}

export async function runFinalEvaluation(input: {
  applicationId: string
  applications: Application[]
  evaluations: Evaluation[]
  delayMs?: number
}): Promise<FinalEvaluationResult> {
  const application = input.applications.find(
    (item) => item.id === input.applicationId,
  )

  if (!application) {
    throw new DemoServiceError(
      'APPLICATION_NOT_FOUND',
      `Application ${input.applicationId} was not found.`,
    )
  }

  await demoDelay(input.delayMs ?? 2000)

  const evaluation = input.evaluations
    .filter(
      (item) =>
        item.applicationId === application.id &&
        item.evaluationType === 'FINAL' &&
        item.status === 'COMPLETED',
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]

  if (!evaluation) {
    throw new DemoServiceError(
      'FINAL_EVALUATION_NOT_FOUND',
      `No completed final evaluation exists for application ${application.id}.`,
    )
  }

  return {
    evaluation: {
      ...copyEvaluation(evaluation),
      overallScore: calculateWeightedScore(evaluation.criterionScores),
    },
  }
}

export async function generateCandidateEmail(input: {
  applicationId: string
  communications: Communication[]
  type?: CommunicationType
  delayMs?: number
}): Promise<CandidateEmailResult> {
  const matchingCommunications = input.communications
    .map((communication, sourceIndex) => ({ communication, sourceIndex }))
    .filter(
      ({ communication }) =>
        communication.applicationId === input.applicationId &&
        (!input.type || communication.type === input.type),
    )
    .sort((left, right) => {
      if (left.communication.sentAt && right.communication.sentAt) {
        return right.communication.sentAt.localeCompare(
          left.communication.sentAt,
        )
      }

      if (left.communication.sentAt) {
        return -1
      }

      if (right.communication.sentAt) {
        return 1
      }

      return left.sourceIndex - right.sourceIndex
    })

  await demoDelay(input.delayMs ?? 1200)

  const communication = matchingCommunications[0]?.communication

  if (!communication) {
    throw new DemoServiceError(
      'COMMUNICATION_NOT_FOUND',
      `No matching communication exists for application ${input.applicationId}.`,
    )
  }

  return { communication: { ...communication } }
}
