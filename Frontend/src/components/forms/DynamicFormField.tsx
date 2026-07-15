import type { ApplicationSubmissionValue } from '../../types/application'
import type { ApplicationFormField } from '../../types/applicationForm'
import { Input } from '../ui/Input'

type DynamicFormFieldProps = {
  field: ApplicationFormField
  value: ApplicationSubmissionValue | undefined
  onChange: (value: ApplicationSubmissionValue) => void
  error?: string
}

export function DynamicFormField({
  field,
  value,
  onChange,
  error,
}: DynamicFormFieldProps) {
  const controlId = `application-${field.id}`
  const stringValue = typeof value === 'string' ? value : ''

  const renderControl = () => {
    if (field.type === 'TEXTAREA') {
      return (
        <textarea
          id={controlId}
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          aria-invalid={Boolean(error)}
        />
      )
    }

    if (field.type === 'MULTI_SELECT') {
      const selectedValues = Array.isArray(value) ? value : []

      return (
        <div className="multi-select" aria-describedby={error ? `${controlId}-error` : undefined}>
          {(field.options ?? []).map((option) => (
            <label className="check-control" key={option.id}>
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((item) => item !== option.value),
                  )
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )
    }

    if (field.type === 'FILE') {
      return (
        <div>
          <Input
            id={controlId}
            type="file"
            onChange={(event) => onChange(event.target.files?.[0]?.name ?? '')}
            aria-invalid={Boolean(error)}
          />
          {stringValue ? <p className="file-name">Selected: {stringValue}</p> : null}
          <p className="field-note">
            Demo mode: the selected file is represented by filename metadata only.
          </p>
        </div>
      )
    }

    if (field.type === 'NUMBER') {
      return (
        <Input
          id={controlId}
          type="number"
          value={typeof value === 'number' ? value : ''}
          placeholder={field.placeholder}
          onChange={(event) => {
            if (event.target.value === '') {
              onChange('')
              return
            }

            const nextValue = Number(event.target.value)
            if (Number.isFinite(nextValue)) {
              onChange(nextValue)
            }
          }}
          aria-invalid={Boolean(error)}
        />
      )
    }

    const inputType =
      field.type === 'EMAIL'
        ? 'email'
        : field.type === 'PHONE'
          ? 'tel'
          : 'text'

    return (
      <Input
        id={controlId}
        type={inputType}
        value={stringValue}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
    )
  }

  return (
    <div className="dynamic-field">
      <label className="dynamic-field__label" htmlFor={field.type === 'MULTI_SELECT' ? undefined : controlId}>
        {field.label}
        {field.required ? <span className="required-marker">Required</span> : <span className="optional-marker">Optional</span>}
      </label>
      {field.helpText ? <p className="dynamic-field__help">{field.helpText}</p> : null}
      {renderControl()}
      {error ? <p id={`${controlId}-error`} className="field-error" role="alert">{error}</p> : null}
    </div>
  )
}
