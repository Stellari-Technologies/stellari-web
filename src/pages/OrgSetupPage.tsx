import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, ChevronDown } from 'lucide-react'
import { setupOrganization } from '../lib/api'
import { useOrg } from '../context/OrgContext'
import AuthAlert from '../components/AuthAlert'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/auth.css'
import '../styles/ui.css'

// ─── Org type options ─────────────────────────────────────────────────────────
const ORG_TYPES = [
  'School',
  'Gym / Fitness Studio',
  'Martial Arts Studio',
  'Sports Club',
  'Tutoring Centre',
  'After-School Program',
  'Community Centre',
  'Daycare / Childcare',
  'Corporate Training',
  'Other',
]

interface FormState {
  organizationName: string
  organizationType: string
}

interface FieldErrors {
  organizationName?: string
  organizationType?: string
}

function validate(form: FormState): FieldErrors {
  const errs: FieldErrors = {}
  if (!form.organizationName.trim()) errs.organizationName = 'Organization name is required.'
  if (!form.organizationType)        errs.organizationType = 'Please select an organization type.'
  return errs
}

export default function OrgSetupPage() {
  const navigate = useNavigate()
  const { setOrgId } = useOrg()

  const [form,        setForm]        = useState<FormState>({ organizationName: '', organizationType: '' })
  const [errors,      setErrors]      = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading,     setLoading]     = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')

    try {
      const result = await setupOrganization(
        form.organizationName.trim(),
        form.organizationType,
      )

      setOrgId(result.organization.id)   // updates context + localStorage in one call

      navigate('/dashboard')
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="ui-card verify-card" style={{ maxWidth: 520, padding: '48px 44px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="verify-icon-wrap" style={{ margin: '0 auto 16px' }}>
              <Building2 size={32} strokeWidth={1.5} />
            </div>
            <h1 className="verify-title">Set up your organization</h1>
            <p className="verify-subtitle">
              Tell us a bit about your organization to get started.
            </p>
          </div>

          {serverError && (
            <div style={{ marginBottom: 20 }}>
              <AuthAlert variant="error">{serverError}</AuthAlert>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Organization name */}
            <div className="auth-field" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="ui-label" htmlFor="organizationName">Organization Name</label>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                className={`ui-input${errors.organizationName ? ' field-error' : ''}`}
                placeholder="e.g. Northside Martial Arts"
                value={form.organizationName}
                onChange={handleChange}
              />
              {errors.organizationName && (
                <span className="auth-field-error">{errors.organizationName}</span>
              )}
            </div>

            {/* Organization type */}
            <div className="auth-field" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="ui-label" htmlFor="organizationType">Organization Type</label>
              <div className="cp-select-wrap">
                <select
                  id="organizationType"
                  name="organizationType"
                  className={`ui-input cp-select${errors.organizationType ? ' field-error' : ''}`}
                  value={form.organizationType}
                  onChange={handleChange}
                >
                  <option value="">Select a type…</option>
                  {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={15} className="cp-select-arrow" />
              </div>
              {errors.organizationType && (
                <span className="auth-field-error">{errors.organizationType}</span>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading
                ? <><span className="auth-btn-spinner" /> Setting up…</>
                : <>
                    <Building2 size={16} />
                    Create Organization
                  </>}
            </Button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}