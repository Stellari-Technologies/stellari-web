import { useState } from 'react'
import { UserPlus, CheckCircle2, ChevronDown } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface ParticipantForm {
  displayName:   string
  username:      string
  program:       string
  email:         string
  phone:         string
  hasParent:     boolean
  parentName:    string
  parentEmail:   string
  parentPhone:   string
}

interface FieldErrors {
  displayName?:  string
  username?:     string
  program?:      string
  email?:        string
  phone?:        string
  parentName?:   string
  parentEmail?:  string
  parentPhone?:  string
}

// ─── Demo programs dropdown options ──────────────────────────────────────────
const PROGRAMS = [
  'JR Program',
  'SR Program',
  'Elite Program',
  'Demo Program A',
  'Demo Program B',
]

const EMPTY_FORM: ParticipantForm = {
  displayName: '', username: '', program: '', email: '', phone: '',
  hasParent: false, parentName: '', parentEmail: '', parentPhone: '',
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: ParticipantForm): FieldErrors {
  const errs: FieldErrors = {}
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRe = /^[\d\s\-+().]{7,}$/

  if (!form.displayName.trim())  errs.displayName = 'Display name is required.'
  if (!form.username.trim())     errs.username    = 'Username is required.'
  else if (/\s/.test(form.username)) errs.username = 'Username cannot contain spaces.'
  if (!form.program)             errs.program     = 'Please select a program.'
  if (!form.email.trim())        errs.email       = 'Email is required.'
  else if (!emailRe.test(form.email)) errs.email  = 'Enter a valid email address.'
  if (form.phone && !phoneRe.test(form.phone))
                                 errs.phone       = 'Enter a valid phone number.'

  if (form.hasParent) {
    if (!form.parentName.trim())  errs.parentName  = 'Parent name is required.'
    if (!form.parentEmail.trim()) errs.parentEmail = 'Parent email is required.'
    else if (!emailRe.test(form.parentEmail))
                                  errs.parentEmail = 'Enter a valid email address.'
    if (form.parentPhone && !phoneRe.test(form.parentPhone))
                                  errs.parentPhone = 'Enter a valid phone number.'
  }
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CreateParticipantTab() {
  const [form,      setForm]      = useState<ParticipantForm>(EMPTY_FORM)
  const [errors,    setErrors]    = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<ParticipantForm | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
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
        <h2 className="cp-success__title">Participant Added!</h2>
        <p className="cp-success__sub">
          <strong>{submitted.displayName}</strong> has been added to <strong>{submitted.program}</strong>.
        </p>
        <div className="cp-success__card">
          <div className="cp-success__row">
            <span className="cp-success__label">Display Name</span>
            <span className="cp-success__value">{submitted.displayName}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Username</span>
            <span className="cp-success__value">@{submitted.username}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Program</span>
            <span className="cp-success__value">{submitted.program}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Email</span>
            <span className="cp-success__value">{submitted.email}</span>
          </div>
          {submitted.phone && (
            <div className="cp-success__row">
              <span className="cp-success__label">Phone</span>
              <span className="cp-success__value">{submitted.phone}</span>
            </div>
          )}
          {submitted.hasParent && (
            <>
              <div className="cp-success__divider">Parent / Guardian</div>
              <div className="cp-success__row">
                <span className="cp-success__label">Name</span>
                <span className="cp-success__value">{submitted.parentName}</span>
              </div>
              <div className="cp-success__row">
                <span className="cp-success__label">Email</span>
                <span className="cp-success__value">{submitted.parentEmail}</span>
              </div>
              {submitted.parentPhone && (
                <div className="cp-success__row">
                  <span className="cp-success__label">Phone</span>
                  <span className="cp-success__value">{submitted.parentPhone}</span>
                </div>
              )}
            </>
          )}
        </div>
        <Button variant="primary" size="md" onClick={handleReset}>
          <UserPlus size={15} />
          Add Another Participant
        </Button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="cp-wrap">
      <form className="cp-form" onSubmit={handleSubmit} noValidate>

        {/* ── Participant info ── */}
        <div className="cp-section-title">Participant Information</div>

        <div className="cp-row">
          <div className="cp-field">
            <label className="ui-label" htmlFor="displayName">Display Name</label>
            <input
              id="displayName" name="displayName" type="text"
              className={`ui-input${errors.displayName ? ' field-error' : ''}`}
              placeholder="How should we call them?"
              value={form.displayName} onChange={handleChange}
            />
            {errors.displayName && <span className="cp-error">{errors.displayName}</span>}
          </div>

          <div className="cp-field">
            <label className="ui-label" htmlFor="username">Username</label>
            <input
              id="username" name="username" type="text"
              className={`ui-input${errors.username ? ' field-error' : ''}`}
              placeholder="Choose a username"
              value={form.username} onChange={handleChange}
            />
            {errors.username && <span className="cp-error">{errors.username}</span>}
          </div>
        </div>

        <div className="cp-field">
          <label className="ui-label" htmlFor="program">Program</label>
          <div className="cp-select-wrap">
            <select
              id="program" name="program"
              className={`ui-input cp-select${errors.program ? ' field-error' : ''}`}
              value={form.program} onChange={handleChange}
            >
              <option value="">Select a program…</option>
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={15} className="cp-select-arrow" />
          </div>
          {errors.program && <span className="cp-error">{errors.program}</span>}
        </div>

        <div className="cp-row">
          <div className="cp-field">
            <label className="ui-label" htmlFor="email">Customer Email</label>
            <input
              id="email" name="email" type="email"
              className={`ui-input${errors.email ? ' field-error' : ''}`}
              placeholder="participant@email.com"
              value={form.email} onChange={handleChange}
            />
            {errors.email && <span className="cp-error">{errors.email}</span>}
          </div>

          <div className="cp-field">
            <label className="ui-label" htmlFor="phone">Customer Phone <span className="cp-optional">(optional)</span></label>
            <input
              id="phone" name="phone" type="tel"
              className={`ui-input${errors.phone ? ' field-error' : ''}`}
              placeholder="+1 (555) 000-0000"
              value={form.phone} onChange={handleChange}
            />
            {errors.phone && <span className="cp-error">{errors.phone}</span>}
          </div>
        </div>

        {/* ── Parent / Guardian toggle ── */}
        <label className="cp-checkbox-row">
          <input
            type="checkbox"
            name="hasParent"
            checked={form.hasParent}
            onChange={handleChange}
            className="cp-checkbox"
          />
          <span className="cp-checkbox-label">Include Parent / Guardian Information</span>
        </label>

        {/* ── Parent fields — only shown when checkbox is checked ── */}
        {form.hasParent && (
          <div className="cp-parent-section">
            <div className="cp-section-title" style={{ marginTop: 0 }}>Parent / Guardian</div>

            <div className="cp-field">
              <label className="ui-label" htmlFor="parentName">Parent / Guardian Name</label>
              <input
                id="parentName" name="parentName" type="text"
                className={`ui-input${errors.parentName ? ' field-error' : ''}`}
                placeholder="Full name"
                value={form.parentName} onChange={handleChange}
              />
              {errors.parentName && <span className="cp-error">{errors.parentName}</span>}
            </div>

            <div className="cp-row">
              <div className="cp-field">
                <label className="ui-label" htmlFor="parentEmail">Parent / Guardian Email</label>
                <input
                  id="parentEmail" name="parentEmail" type="email"
                  className={`ui-input${errors.parentEmail ? ' field-error' : ''}`}
                  placeholder="parent@email.com"
                  value={form.parentEmail} onChange={handleChange}
                />
                {errors.parentEmail && <span className="cp-error">{errors.parentEmail}</span>}
              </div>

              <div className="cp-field">
                <label className="ui-label" htmlFor="parentPhone">Parent / Guardian Phone <span className="cp-optional">(optional)</span></label>
                <input
                  id="parentPhone" name="parentPhone" type="tel"
                  className={`ui-input${errors.parentPhone ? ' field-error' : ''}`}
                  placeholder="+1 (555) 000-0000"
                  value={form.parentPhone} onChange={handleChange}
                />
                {errors.parentPhone && <span className="cp-error">{errors.parentPhone}</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Buttons ── */}
        <div className="cp-footer">
          <Button type="button" variant="ghost" size="lg" onClick={handleReset}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg">
            <UserPlus size={16} />
            Add Member
          </Button>
        </div>

      </form>
    </div>
  )
}