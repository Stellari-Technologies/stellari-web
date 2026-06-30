import { useState } from 'react'
import { Building2, ChevronDown, CheckCircle2 } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrgForm {
  orgName:           string
  orgType:           string
  currencyName:      string
  participantLabel:  string
}

interface FieldErrors {
  orgName?:          string
  orgType?:          string
  currencyName?:     string
  participantLabel?: string
}

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

const EMPTY_FORM: OrgForm = {
  orgName: '', orgType: '', currencyName: '', participantLabel: '',
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: OrgForm): FieldErrors {
  const errs: FieldErrors = {}
  if (!form.orgName.trim())          errs.orgName          = 'Organization name is required.'
  if (!form.orgType)                 errs.orgType          = 'Please select an organization type.'
  if (!form.currencyName.trim())     errs.currencyName     = 'Currency name is required.'
  if (!form.participantLabel.trim()) errs.participantLabel = 'Participant label is required.'
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function OrgSetupTab() {
  const [form,      setForm]      = useState<OrgForm>(EMPTY_FORM)
  const [errors,    setErrors]    = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<OrgForm | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(form)
  }

  const handleEdit = () => {
    setForm(submitted ?? EMPTY_FORM)
    setSubmitted(null)
  }

  // ── Success / saved state ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="cp-success">
        <div className="cp-success__icon"><CheckCircle2 size={36} /></div>
        <h2 className="cp-success__title">Organization Saved!</h2>
        <p className="cp-success__sub">
          Your organization settings have been configured.
        </p>
        <div className="cp-success__card">
          <div className="cp-success__row">
            <span className="cp-success__label">Organization Name</span>
            <span className="cp-success__value">{submitted.orgName}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Type</span>
            <span className="cp-success__value">{submitted.orgType}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Currency Name</span>
            <span className="cp-success__value">{submitted.currencyName}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Participants Called</span>
            <span className="cp-success__value">{submitted.participantLabel}</span>
          </div>
        </div>
        <Button variant="ghost" size="md" onClick={handleEdit}>
          Edit Settings
        </Button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="cp-wrap">
      <form className="cp-form" onSubmit={handleSubmit} noValidate>

        {/* ── Organization details ── */}
        <div className="cp-section-title">Organization Details</div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="orgName">Organization Name</label>
          <input
            id="orgName" name="orgName" type="text"
            className={`ui-input${errors.orgName ? ' field-error' : ''}`}
            placeholder="e.g. Northside Martial Arts"
            value={form.orgName} onChange={handleChange}
          />
          {errors.orgName && <span className="cp-error">{errors.orgName}</span>}
        </div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="orgType">Organization Type</label>
          <div className="cp-select-wrap">
            <select
              id="orgType" name="orgType"
              className={`ui-input cp-select${errors.orgType ? ' field-error' : ''}`}
              value={form.orgType} onChange={handleChange}
            >
              <option value="">Select a type…</option>
              {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={15} className="cp-select-arrow" />
          </div>
          {errors.orgType && <span className="cp-error">{errors.orgType}</span>}
        </div>

        {/* ── Program customization ── */}
        <div className="cp-section-title">Program Customization</div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="currencyName">
            Currency Name
          </label>
          <input
            id="currencyName" name="currencyName" type="text"
            className={`ui-input${errors.currencyName ? ' field-error' : ''}`}
            placeholder="e.g. Stars, Coins, Points, Gems"
            value={form.currencyName} onChange={handleChange}
          />
          <span className="org-hint">
            This is what participants earn when they complete activities.
          </span>
          {errors.currencyName && <span className="cp-error">{errors.currencyName}</span>}
        </div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="participantLabel">
            What do you call your participants?
          </label>
          <input
            id="participantLabel" name="participantLabel" type="text"
            className={`ui-input${errors.participantLabel ? ' field-error' : ''}`}
            placeholder="e.g. Students, Athletes, Members, Customers"
            value={form.participantLabel} onChange={handleChange}
          />
          <span className="org-hint">
            This label will be used throughout the platform.
          </span>
          {errors.participantLabel && <span className="cp-error">{errors.participantLabel}</span>}
        </div>

        <div className="cp-footer">
          <Button type="button" variant="ghost" size="lg"
            onClick={() => { setForm(EMPTY_FORM); setErrors({}) }}>
            Reset
          </Button>
          <Button type="submit" variant="primary" size="lg">
            <Building2 size={16} />
            Save Organization
          </Button>
        </div>

      </form>
    </div>
  )
}