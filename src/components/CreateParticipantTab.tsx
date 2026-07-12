import { useState } from 'react'
import { UserPlus, CheckCircle2, ChevronDown } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'
import { createParticipant } from '../lib/api'
import { useOrg } from '../context/OrgContext'
import AuthAlert from './AuthAlert'

// ─── Types ───────────────────────────────────────────────────────────────────
interface ParticipantForm {
  firstName:         string
  lastName:          string
  displayName:       string
  username:          string
  program:           string
  email:             string
  phone:             string
  birthday:          string
  hasParent:         boolean
  parentFirstName:   string
  parentLastName:    string
  parentEmail:       string
  parentPhone:       string
}

interface FieldErrors {
  firstName?:        string
  lastName?:         string
  displayName?:      string
  username?:         string
  program?:          string
  email?:            string
  phone?:            string
  birthday?:         string
  parentFirstName?:  string
  parentLastName?:   string
  parentEmail?:      string
  parentPhone?:      string
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
  firstName: '', lastName: '', displayName: '', username: '', program: '', email: '', phone: '', birthday: '',
  hasParent: false, parentFirstName: '', parentLastName: '', parentEmail: '', parentPhone: '',
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: ParticipantForm): FieldErrors {
  const errs: FieldErrors = {}
  const emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRe    = /^[\d\s\-+().]{7,}$/
  const birthdayRe = /^\d{4}-\d{2}-\d{2}$/

  if (!form.firstName.trim())    errs.firstName   = 'First name is required.'
  if (!form.lastName.trim())     errs.lastName    = 'Last name is required.'
  if (!form.displayName.trim())  errs.displayName = 'Display name is required.'
  if (!form.username.trim())     errs.username    = 'Username is required.'
  else if (/\s/.test(form.username)) errs.username = 'Username cannot contain spaces.'
  if (!form.program)             errs.program     = 'Please select a program.'
  if (!form.email.trim())        errs.email       = 'Email is required.'
  else if (!emailRe.test(form.email)) errs.email  = 'Enter a valid email address.'
  if (form.phone && !phoneRe.test(form.phone))
                                 errs.phone       = 'Enter a valid phone number.'
  if (form.birthday && !birthdayRe.test(form.birthday))
                                 errs.birthday    = 'Use the format YYYY-MM-DD (e.g. 2015-05-01).'

  if (form.hasParent) {
    if (!form.parentFirstName.trim()) errs.parentFirstName = 'First name is required.'
    if (!form.parentLastName.trim())  errs.parentLastName  = 'Last name is required.'
    if (!form.parentEmail.trim())     errs.parentEmail     = 'Parent email is required.'
    else if (!emailRe.test(form.parentEmail))
                                      errs.parentEmail     = 'Enter a valid email address.'
    if (form.parentPhone && !phoneRe.test(form.parentPhone))
                                      errs.parentPhone     = 'Enter a valid phone number.'
  }
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CreateParticipantTab() {
  const { orgId } = useOrg()
  const [form,      setForm]      = useState<ParticipantForm>(EMPTY_FORM)
  const [errors,    setErrors]    = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<ParticipantForm | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FieldErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (!orgId) { setServerError('Organization not found. Please log in again.'); return }

    setLoading(true)
    setServerError('')
    try {
      await createParticipant(orgId, {
        firstName:        form.firstName,
        lastName:         form.lastName,
        dateOfBirth:      form.birthday || undefined,
        parentFirstName:  form.hasParent ? form.parentFirstName : undefined,
        parentLastName:   form.hasParent ? form.parentLastName  : undefined,
      })
      setSubmitted(form)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
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
            <span className="cp-success__label">First Name</span>
            <span className="cp-success__value">{submitted.firstName}</span>
          </div>
          <div className="cp-success__row">
            <span className="cp-success__label">Last Name</span>
            <span className="cp-success__value">{submitted.lastName}</span>
          </div>
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
          {submitted.birthday && (
            <div className="cp-success__row">
              <span className="cp-success__label">Birthday</span>
              <span className="cp-success__value">{submitted.birthday}</span>
            </div>
          )}
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
                <span className="cp-success__value">{submitted.parentFirstName} {submitted.parentLastName}</span>
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
      {serverError && <AuthAlert variant="error">{serverError}</AuthAlert>}
      <form className="cp-form" onSubmit={handleSubmit} noValidate>

        {/* ── Participant info ── */}
        <div className="cp-section-title">Participant Information</div>

        <div className="cp-row">
          <div className="cp-field">
            <label className="ui-label" htmlFor="firstName">First Name</label>
            <input
              id="firstName" name="firstName" type="text"
              className={`ui-input${errors.firstName ? ' field-error' : ''}`}
              placeholder="Ahmed"
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
        <div className="cp-row">
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

          <div className="cp-field">
            <label className="ui-label" htmlFor="birthday">
              Date of Birth <span className="cp-optional">(optional)</span>
            </label>
            <input
              id="birthday" name="birthday" type="text"
              className={`ui-input${errors.birthday ? ' field-error' : ''}`}
              placeholder="YYYY-MM-DD (e.g. 2015-05-01)"
              value={form.birthday} onChange={handleChange}
            />
            {errors.birthday && <span className="cp-error">{errors.birthday}</span>}
          </div>
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
            <label className="ui-label" htmlFor="phone">
              Customer Phone <span className="cp-optional">(optional)</span>
            </label>
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

        {/* ── Parent fields ── */}
        {form.hasParent && (
          <div className="cp-parent-section">
            <div className="cp-section-title" style={{ marginTop: 0 }}>Parent / Guardian</div>

            <div className="cp-row">
              <div className="cp-field">
                <label className="ui-label" htmlFor="parentFirstName">First Name</label>
                <input
                  id="parentFirstName" name="parentFirstName" type="text"
                  className={`ui-input${errors.parentFirstName ? ' field-error' : ''}`}
                  placeholder="Jane"
                  value={form.parentFirstName} onChange={handleChange}
                />
                {errors.parentFirstName && <span className="cp-error">{errors.parentFirstName}</span>}
              </div>

              <div className="cp-field">
                <label className="ui-label" htmlFor="parentLastName">Last Name</label>
                <input
                  id="parentLastName" name="parentLastName" type="text"
                  className={`ui-input${errors.parentLastName ? ' field-error' : ''}`}
                  placeholder="Smith"
                  value={form.parentLastName} onChange={handleChange}
                />
                {errors.parentLastName && <span className="cp-error">{errors.parentLastName}</span>}
              </div>
            </div>

            <div className="cp-row">
              <div className="cp-field">
                <label className="ui-label" htmlFor="parentEmail">Email</label>
                <input
                  id="parentEmail" name="parentEmail" type="email"
                  className={`ui-input${errors.parentEmail ? ' field-error' : ''}`}
                  placeholder="parent@email.com"
                  value={form.parentEmail} onChange={handleChange}
                />
                {errors.parentEmail && <span className="cp-error">{errors.parentEmail}</span>}
              </div>

              <div className="cp-field">
                <label className="ui-label" htmlFor="parentPhone">
                  Phone <span className="cp-optional">(optional)</span>
                </label>
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
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? <><span className="auth-btn-spinner" /> Adding…</> : <><UserPlus size={16} />Add Member</>}
          </Button>
        </div>
      
      </form>
    </div>
  )
}