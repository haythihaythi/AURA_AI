import type {
  Application,
  ApplicationAnswer,
  CandidateSubmission,
} from '../types/application'
import type { ApplicationForm } from '../types/applicationForm'
import type { Candidate } from '../types/candidate'
import { validateApplicationSubmission } from '../utils/applicationSubmissionValidation'
import { DemoServiceError } from './DemoServiceError'

export type PreparedApplicationSubmission = {
  candidate: Candidate
  application: Application
}

const candidateFieldKeys = new Set([
  'full_name',
  'email',
  'phone',
  'current_position',
  'years_experience',
  'location',
  'skills',
  'cv',
])

export function prepareApplicationSubmission(input: {
  form: ApplicationForm
  submission: CandidateSubmission
  existingCandidates: Candidate[]
  candidateId: string
  applicationId: string
  documentId: string
  submittedAt: string
}): PreparedApplicationSubmission {
  const validation = validateApplicationSubmission(input.form, input.submission)

  if (!validation.valid) {
    throw new DemoServiceError(
      'INVALID_SERVICE_INPUT',
      `Invalid application submission: ${validation.errors.join(' ')}`,
    )
  }

  const fieldsById = new Map(
    input.form.fields.map((field) => [field.id, field]),
  )
  const answersByKey = new Map(
    input.submission.answers.map((answer) => [answer.fieldKey, answer.value]),
  )
  const readString = (key: string) => {
    const value = answersByKey.get(key)
    return typeof value === 'string' ? value : ''
  }
  const yearsExperience = answersByKey.get('years_experience')
  const skills = answersByKey.get('skills')
  const fullName = readString('full_name').trim()
  const email = readString('email').trim()
  const cvFileName = readString('cv').trim()

  if (!fullName || !email || !cvFileName) {
    throw new DemoServiceError(
      'INVALID_SERVICE_INPUT',
      'Application submission must include full_name, email, and cv values.',
    )
  }

  const existingCandidate = input.existingCandidates.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  )
  const candidate: Candidate = existingCandidate
    ? { ...existingCandidate, skills: [...existingCandidate.skills] }
    : {
        id: input.candidateId,
        fullName,
        email,
        phone: readString('phone').trim(),
        currentPosition: readString('current_position').trim(),
        yearsExperience:
          typeof yearsExperience === 'number' ? yearsExperience : 0,
        skills: Array.isArray(skills) ? [...skills] : [],
        location: readString('location').trim(),
      }

  const answers: ApplicationAnswer[] = input.submission.answers
    .filter((answer) => !candidateFieldKeys.has(answer.fieldKey))
    .map((answer) => {
      const field = fieldsById.get(answer.fieldId)

      return {
        id: `${input.applicationId}-${answer.fieldId}`,
        fieldKey: answer.fieldKey,
        label: field?.label ?? answer.fieldKey,
        value: Array.isArray(answer.value)
          ? [...answer.value]
          : answer.value,
      }
    })

  return {
    candidate,
    application: {
      id: input.applicationId,
      jobId: input.form.jobId,
      candidateId: candidate.id,
      status: 'SUBMITTED',
      currentStage: 'APPLICATION',
      answers,
      documents: [
        {
          id: input.documentId,
          documentType: 'CV',
          fileName: cvFileName,
          filePath: `/demo/cvs/${cvFileName}`,
        },
      ],
      submittedAt: input.submittedAt,
    },
  }
}
