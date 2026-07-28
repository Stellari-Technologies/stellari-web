import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ui.css'
import '../styles/auth.css'

interface Stat {
  value: string
  label: string
}

interface AuthLayoutProps {
  /** Headline in the left branding panel. Wrap words in <em> for amber colour. */
  headline: ReactNode
  /** Supporting copy below the headline. */
  subtext: string
  /** Stats displayed at the bottom of the branding panel. */
  stats?: Stat[]
  /** The form / content to render in the right panel. */
  children: ReactNode
}

const DEFAULT_STATS: Stat[] = [
  { value: '8+',   label: 'Active businesses' },
  { value: '99%',  label: 'Satisfaction rate' },
  { value: '4.7★', label: 'Google Play' },
]

export default function AuthLayout({
  headline,
  subtext,
  stats = DEFAULT_STATS,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="ui-card auth-split">

          {/* ── Left branding panel ── */}
          <div className="auth-panel">
            <Link to="/" className="auth-panel-logo">
              <span className="auth-panel-logo-star">★</span>
              Stellari
            </Link>

            <div className="auth-panel-body">
              <h1 className="auth-panel-headline">{headline}</h1>
              <p className="auth-panel-sub">{subtext}</p>
            </div>

            <div className="auth-panel-stats">
              {stats.map(s => (
                <div key={s.label}>
                  <span className="auth-stat-value">{s.value}</span>
                  <span className="auth-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="auth-form-panel">
            {children}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}