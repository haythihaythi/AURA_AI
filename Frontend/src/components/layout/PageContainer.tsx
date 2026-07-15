import type { ReactNode } from 'react'

type PageContainerProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageContainer({
  title,
  description,
  actions,
  children,
}: PageContainerProps) {
  return (
    <section className="page-container">
      <header className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Recruitment operations</p>
          <h1>{title}</h1>
          {description ? <p className="page-heading__description">{description}</p> : null}
        </div>
        {actions ? <div className="page-heading__actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}
