import { ArrowRight, ExternalLink, FilePenLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useDemoStore } from '../hooks/useDemoStore'

function jobStatusTone(status: string) {
  return status === 'OPEN' ? 'success' : status === 'DRAFT' ? 'warning' : 'neutral'
}

export default function Jobs() {
  const { state } = useDemoStore()

  return (
    <PageContainer
      title="Job openings"
      description="Manage application entry points for each active hiring process."
    >
      <div className="jobs-grid">
        {state.jobs.map((job) => (
          <Card className="job-card" key={job.id}>
            <div className="job-card__topline">
              <span>{job.department}</span>
              <Badge tone={jobStatusTone(job.status)}>{job.status}</Badge>
            </div>
            <div>
              <h2>{job.title}</h2>
              <p>{job.description}</p>
            </div>
            <dl className="job-card__facts">
              <div><dt>Positions</dt><dd>{job.positionsCount}</dd></div>
              <div><dt>Deadline</dt><dd>{job.applicationDeadline}</dd></div>
            </dl>
            <div className="job-card__actions">
              <Link to={`/jobs/${job.id}`}><ArrowRight size={16} />View job</Link>
              <Link to={`/jobs/${job.id}/application-form`}><FilePenLine size={16} />Manage form</Link>
              <Link to={`/apply/${job.id}`}><ExternalLink size={16} />Public application</Link>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
