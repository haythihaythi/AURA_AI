import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <main className="standalone-page">
      <section className="standalone-card">
        <span className="public-brand__mark">A</span>
        <p className="page-heading__eyebrow">AURA AI Demo</p>
        <h1>Demo workspace</h1>
        <p>Authentication is not enabled in this frontend demonstration.</p>
        <Link className="button button--primary" to="/jobs">
          Open job workspace
        </Link>
      </section>
    </main>
  )
}
