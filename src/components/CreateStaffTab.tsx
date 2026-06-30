import { useState } from 'react'
import { UserCog, CheckCircle2, ChevronDown } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface StaffForm {
  firstName: string
  lastName:  string
  email:     string
  role:      string
}

interface FieldErrors {
  firstName?: string
  lastName?:  string
  email?:     string
  role?:      string
}

// ─── Demo role dropdown options ──────────────────────────────────────────────
const ROLES = [
  'Admin',
  'Program Manager',
  'Coach / Instructor',
  'Front Desk',
  'Volunteer',
]

const EMPTY_FORM: StaffForm = {
  firstName: '', lastName: '', email: '', role: '',
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: StaffForm): FieldErrors {
  const errs: FieldErrors = {}
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.firstName.trim()) errs.firstName = 'First name is required.'
  if (!form.lastName.trim())  errs.lastName  = 'Last name is required.'
  if (!form.email.trim())     errs.email     = 'Email is required.'
  else if (!emailRe.test(form.email)) errs.email = 'Enter a valid email address.'
  if (!form.role)             errs.role      = 'Please select a role.'

  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CreateStaffTab() {
  const [form,      setForm]      = useState<StaffForm>(EMPTY_FORM)
  const [errors,    setErrors]    = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<StaffForm | null>(null)

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

  const handleReset = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitted(null)
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="cp-success">
        <div className="cp-success__icon"><CheckCircle2 size={36} /></div>
        <h2 className="cp-success__title">Staff Member Added!</h2>
        <p className="cp-success__sub">
          <strong>{submitted.firstName} {submitted.lastName}</strong> has been added as <strong>{submitted.role}</strong>.
        </p>
        <div className="cp-success__card">
          <div className="cp-success__row">
            <span className="cp-success__label">Name</span>
            <span className="cp-success__value">{submitted.firstName} {submitted.lastName}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Email</span>
            <span className="cp-success__value">{submitted.email}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Role</span>
            <span className="cp-success__value">{submitted.role}</span>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={handleReset}>
          <UserCog size={15} />
          Add Another Staff Member
        </Button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="cp-wrap">
      <form className="cp-form" onSubmit={handleSubmit} noValidate>

        <div className="cp-section-title">Staff Information</div>

        <div className="cp-row">
          <div className="cp-field">
            <label className="ui-label" htmlFor="firstName">First Name</label>
            <input
              id="firstName" name="firstName" type="text"
              className={`ui-input${errors.firstName ? ' field-error' : ''}`}
              placeholder="Jane"
              value={form.firstName} onChange={handleChange}
            />
            {errors.firstName && <span className="cp-error">{errors.firstName}</span>}
          </div>

          <div className="cp-field">
            <label className="ui-label" htmlFor="lastName">Last Name</label>
            <input
              id="lastName" name="lastName" type="text"
              className={`ui-input${errors.lastName ? ' field-error' : ''}`}
              placeholder="Smith"
              value={form.lastName} onChange={handleChange}
            />
            {errors.lastName && <span className="cp-error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="email">Email</label>
          <input
            id="email" name="email" type="email"
            className={`ui-input${errors.email ? ' field-error' : ''}`}
            placeholder="staff@email.com"
            value={form.email} onChange={handleChange}
          />
          {errors.email && <span className="cp-error">{errors.email}</span>}
        </div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="role">Role</label>
          <div className="cp-select-wrap">
            <select
              id="role" name="role"
              className={`ui-input cp-select${errors.role ? ' field-error' : ''}`}
              value={form.role} onChange={handleChange}
            >
              <option value="">Select a role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={15} className="cp-select-arrow" />
          </div>
          {errors.role && <span className="cp-error">{errors.role}</span>}
        </div>

        <div className="cp-footer">
          <Button type="button" variant="ghost" size="lg" onClick={handleReset}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg">
            <UserCog size={16} />
            Add Staff Member
          </Button>
        </div>

      </form>
    </div>
  )
}