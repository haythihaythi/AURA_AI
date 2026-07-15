import { ExternalLink, FilePenLine } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useDemoStore } from '../hooks/useDemoStore'
import { selectJobById } from '../store/demoSelectors'

export default function JobDetail() {
  const { jobId = '' } = useParams()
  const { state } = useDemoStore()
  const job = selectJobById(state, jobId)

  if (!job) {
    return (
      <PageContainer title="Job not found">
        <Card className="empty-state"><p>The requested job opening does not exist.</p></Card>
      </PageContainer>
    )
  }

  const requiredSkills = job.requiredSkills.filter((skill) => skill.priority === 'REQUIRED')
  const preferredSkills = job.requiredSkills.filter((skill) => skill.priority === 'PREFERRED')

  return (
    <PageContainer
      title={job.title}
      description={`${job.department} · ${job.positionsCount} open position${job.positionsCount === 1 ? '' : 's'}`}
      actions={
        <>
          <Link className="button button--secondary" to={`/apply/${job.id}`}><ExternalLink size={16} />Open public application</Link>
          <Link className="button button--primary" to={`/jobs/${job.id}/application-form`}><FilePenLine size={16} />Manage application form</Link>
        </>
      }
    >
      <div className="detail-grid">
        <Card className="detail-card detail-card--wide">
          <div className="section-heading"><h2>Role overview</h2><Badge tone={job.status === 'OPEN' ? 'success' : 'warning'}>{job.status}</Badge></div>
          <p>{job.description}</p>
        </Card>
        <Card className="detail-card">
          <h2>Hiring details</h2>
          <dl className="detail-list">
            <div><dt>Department</dt><dd>{job.department}</dd></div>
            <div><dt>Positions</dt><dd>{job.positionsCount}</dd></div>
            <div><dt>Application deadline</dt><dd>{job.applicationDeadline}</dd></div>
          </dl>
        </Card>
        <Card className="detail-card">
          <h2>Required skills</h2>
          <ul className="skill-list">
            {requiredSkills.map((skill) => <li key={skill.name}><span>{skill.name}</span><Badge>Required</Badge></li>)}
          </ul>
        </Card>
        <Card className="detail-card">
          <h2>Preferred skills</h2>
          <ul className="skill-list">
            {preferredSkills.map((skill) => <li key={skill.name}><span>{skill.name}</span><Badge tone="neutral">Preferred</Badge></li>)}
          </ul>
        </Card>
      </div>
    </PageContainer>
  )
}
