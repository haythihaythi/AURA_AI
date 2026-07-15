import type { ApplicationForm } from '../../types/applicationForm'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

type FormPreviewProps = {
  form: ApplicationForm
}

export function FormPreview({ form }: FormPreviewProps) {
  return (
    <Card className="form-preview">
      <header className="form-preview__header">
        <div>
          <p className="form-preview__eyebrow">Candidate application</p>
          <h2>{form.name}</h2>
          <p>Version {form.version} · {form.fields.length} fields</p>
        </div>
        <Badge tone={form.status === 'PUBLISHED' ? 'success' : 'warning'}>
          {form.status}
        </Badge>
      </header>
      <div className="form-preview__fields">
        {form.fields.map((field) => (
          <div className="preview-field" key={field.id}>
            <div className="preview-field__label">
              <span>{field.label}</span>
              <small>{field.required ? 'Required' : 'Optional'}</small>
            </div>
            {field.helpText ? <p>{field.helpText}</p> : null}
            {field.type === 'MULTI_SELECT' ? (
              <div className="preview-options">
                {(field.options ?? []).map((option) => (
                  <span key={option.id}>{option.label}</span>
                ))}
              </div>
            ) : field.type === 'TEXTAREA' ? (
              <div className="preview-control preview-control--textarea">{field.placeholder ?? 'Long answer'}</div>
            ) : field.type === 'FILE' ? (
              <div className="preview-control preview-control--file">Choose a file</div>
            ) : (
              <div className="preview-control">{field.placeholder ?? field.type.replace('_', ' ')}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
