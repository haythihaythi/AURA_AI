import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DynamicFormField } from '../components/forms/DynamicFormField'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useDemoStore } from '../hooks/useDemoStore'
import { prepareApplicationSubmission, type PreparedApplicationSubmission } from '../services/applicationSubmission'
import { selectJobById, selectPublishedApplicationFormByJobId } from '../store/demoSelectors'
import type { ApplicationSubmissionValue, CandidateSubmission } from '../types/application'
import { validateApplicationSubmission } from '../utils/applicationSubmissionValidation'

const DEMO_TIMESTAMP = '2026-07-16T10:30:00Z'

export default function PublicJobApplication() {
  const { jobId = '' } = useParams()
  const { state, dispatch } = useDemoStore()
  const [values, setValues] = useState<Record<string, ApplicationSubmissionValue | undefined>>({})
  const [errors, setErrors] = useState<string[]>([])
  const [submitted, setSubmitted] = useState<PreparedApplicationSubmission>()
  const job = selectJobById(state, jobId)
  const form = selectPublishedApplicationFormByJobId(state, jobId)

  if (!job) {
    return <PublicUnavailable title="Job not found" message="This job opening does not exist." />
  }

  if (job.status !== 'OPEN' || !form) {
    return <PublicUnavailable title={job.title} message="Applications are not currently available." />
  }

  if (submitted) {
    return (
      <main className="public-page">
        <section className="success-card">
          <CheckCircle2 size={42} aria-hidden="true" />
          <p className="page-heading__eyebrow">Application submitted</p>
          <h1>Thank you, {submitted.candidate.fullName}.</h1>
          <p>Your application for {job.title} has been received.</p>
          <dl><dt>Application ID</dt><dd>{submitted.application.id}</dd></dl>
          <Link className="button button--primary" to="/jobs">Back to job openings</Link>
        </section>
      </main>
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submission: CandidateSubmission = {
      formId: form.id,
      jobId: job.id,
      answers: form.fields
        .filter((field) => values[field.id] !== undefined)
        .map((field) => ({
          fieldId: field.id,
          fieldKey: field.key,
          fieldType: field.type,
          value: values[field.id] ?? '',
        })),
    }
    const validation = validateApplicationSubmission(form, submission)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    const emailField = form.fields.find((field) => field.key === 'email')
    const emailValue = emailField ? values[emailField.id] : undefined
    const normalizedEmail = typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : ''
    const existingCandidate = state.candidates.find((candidate) => candidate.email.toLowerCase() === normalizedEmail)
    const duplicateApplication = existingCandidate
      ? state.applications.some((application) => application.candidateId === existingCandidate.id && application.jobId === job.id)
      : false

    if (duplicateApplication) {
      setErrors(['An application already exists for this email and job.'])
      return
    }

    const sequence = String(
      Math.max(state.candidates.length, state.applications.length) + 1,
    ).padStart(3, '0')
    try {
      const prepared = prepareApplicationSubmission({
        form,
        submission,
        existingCandidates: state.candidates,
        candidateId: `candidate-demo-${sequence}`,
        applicationId: `application-demo-${sequence}`,
        documentId: `document-demo-${sequence}-cv`,
        submittedAt: DEMO_TIMESTAMP,
      })

      dispatch({ type: 'ADD_CANDIDATE', payload: prepared.candidate })
      dispatch({ type: 'ADD_APPLICATION', payload: prepared.application })
      setSubmitted(prepared)
      setErrors([])
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Application submission failed.'])
    }
  }

  return (
    <main className="public-page">
      <header className="public-header">
        <Link to="/jobs" className="public-brand"><span className="public-brand__mark">A</span><span>AURA AI</span></Link>
        <span>Demo Application Portal</span>
      </header>
      <section className="public-hero">
        <p className="page-heading__eyebrow">AURA Technology</p>
        <h1>{job.title}</h1>
        <p>{job.department} · Apply for this position</p>
      </section>
      <Card className="public-form-card">
        <header><h2>{form.name}</h2><p>Complete the fields below. Required fields are marked clearly.</p></header>
        {errors.length > 0 ? (
          <div className="message-list message-list--error" role="alert">
            <strong>Review your application</strong>
            <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
          </div>
        ) : null}
        <form onSubmit={handleSubmit} noValidate>
          <div className="public-form-fields">
            {form.fields.map((field) => (
              <DynamicFormField
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))}
              />
            ))}
          </div>
          <div className="public-form-actions">
            <Link to="/jobs"><ArrowLeft size={16} />Back to job openings</Link>
            <Button type="submit">Submit application</Button>
          </div>
        </form>
      </Card>
    </main>
  )
}

function PublicUnavailable({ title, message }: { title: string; message: string }) {
  return (
    <main className="public-page public-page--centered">
      <section className="standalone-card">
        <span className="public-brand__mark">A</span>
        <p className="page-heading__eyebrow">Demo Application Portal</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="button button--secondary" to="/jobs">Back to job openings</Link>
      </section>
    </main>
  )
}
