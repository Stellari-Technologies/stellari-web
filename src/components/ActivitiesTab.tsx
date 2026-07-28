import { useState } from 'react'
import { Plus, X, Zap, Calendar, Users, Award, RefreshCw } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Activity {
  id:            number
  title:         string
  description:   string
  assignee:      string
  dueDate:       string
  currencyValue: number
  isRepeatable:  boolean
}

interface FormState {
  title:         string
  description:   string
  assignee:      string
  dd:            string
  mm:            string
  yyyy:          string
  currencyValue: string
  isRepeatable:  boolean
}

interface FormErrors {
  title?:         string
  assignee?:      string
  currencyValue?: string
  date?:          string
}

// ─── Demo seed data ───────────────────────────────────────────────────────────
const SEED_ACTIVITIES: Activity[] = [
  {
    id:            1,
    title:         'Build Project',
    description:   'Finish the tutorial project and key learning concepts.',
    assignee:      'Group A',
    dueDate:       '30/06/2026',
    currencyValue: 50,
    isRepeatable:  false,
  },
  {
    id:            2,
    title:         'Build Project',
    description:   'Finish the tutorial project and key learning concepts.',
    assignee:      'Group C',
    dueDate:       '30/06/2026',
    currencyValue: 50,
    isRepeatable:  true,
  },
]

const EMPTY_FORM: FormState = {
  title: '', description: '', assignee: '', dd: '', mm: '', yyyy: '',
  currencyValue: '', isRepeatable: true,
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.title.trim())        errs.title         = 'Activity title is required.'
  if (!form.assignee.trim())     errs.assignee      = 'Assignee is required.'
  if (!form.currencyValue)       errs.currencyValue = 'Points value is required.'
  else if (isNaN(Number(form.currencyValue)) || Number(form.currencyValue) < 1)
                                 errs.currencyValue = 'Enter a valid points amount.'
  if (form.dd || form.mm || form.yyyy) {
    const d = Number(form.dd), m = Number(form.mm), y = Number(form.yyyy)
    if (!form.dd || !form.mm || !form.yyyy)
      errs.date = 'Enter a complete date or leave all fields empty.'
    else if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2024)
      errs.date = 'Enter a valid date.'
  }
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ActivitiesTab() {
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES)
  const [showModal,  setShowModal]  = useState(false)
  const [form,       setForm]       = useState<FormState>(EMPTY_FORM)
  const [errors,     setErrors]     = useState<FormErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handlePublish = () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const dueDate = form.dd && form.mm && form.yyyy
      ? `${form.dd.padStart(2,'0')}/${form.mm.padStart(2,'0')}/${form.yyyy}`
      : '—'

    const newActivity: Activity = {
      id:            Date.now(),
      title:         form.title.trim(),
      description:   form.description.trim(),
      assignee:      form.assignee.trim(),
      dueDate,
      currencyValue: Number(form.currencyValue),
      isRepeatable:  form.isRepeatable,
    }

    setActivities(prev => [newActivity, ...prev])
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(false)
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(false)
  }

  return (
    <>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button
          variant="brand"
          size="md"
          onClick={() => setShowModal(true)}
          style={{ borderRadius: 999, paddingLeft: 20, paddingRight: 20 }}
        >
          <Plus size={16} />
          Create Activity
        </Button>
      </div>

      {/* ── Activity list ── */}
      {activities.length === 0 ? (
        <div className="dash-placeholder">
          <div className="dash-placeholder-icon"><Zap size={28} /></div>
          <p className="dash-placeholder-title">No activities yet</p>
          <p className="dash-placeholder-sub">Click "Create Activity" to add your first one.</p>
        </div>
      ) : (
        <div className="act-list">
          {activities.map(activity => (
            <div key={activity.id} className="act-card">
              <div className="act-card__icon"><Zap size={18} /></div>
              <div className="act-card__body">
                <div className="act-card__name">{activity.title}</div>
                {activity.description && (
                  <div className="act-card__desc">{activity.description}</div>
                )}
                <div className="act-card__meta">
                  <span className="act-card__assignee">
                    <Users size={12} />
                    Assigned: <strong>{activity.assignee}</strong>
                  </span>
                  {activity.dueDate !== '—' && (
                    <span className="act-card__due">
                      <Calendar size={12} />
                      Due: {activity.dueDate}
                    </span>
                  )}
                  <span className="act-card__reward">
                    <Award size={12} />
                    {activity.currencyValue} pts
                  </span>
                  <span className="act-card__due">
                    <RefreshCw size={12} />
                    {activity.isRepeatable ? 'Repeatable' : 'One-time'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Activity Modal ── */}
      {showModal && (
        <div className="act-modal-overlay" onClick={handleCancel}>
          <div className="act-modal" onClick={e => e.stopPropagation()}>

            <div className="act-modal__header">
              <h2 className="act-modal__title">Create An Activity</h2>
              <button className="act-modal__close" onClick={handleCancel} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="act-modal__body">

              {/* Title */}
              <div className="act-field">
                <label className="ui-label" htmlFor="act-title">Activity Title</label>
                <input
                  id="act-title"
                  name="title"
                  className={`ui-input${errors.title ? ' field-error' : ''}`}
                  placeholder="e.g. Finish Addition Worksheet!"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="act-field-error">{errors.title}</span>}
              </div>

              {/* Description */}
              <div className="act-field">
                <label className="ui-label" htmlFor="act-desc">Activity Description</label>
                <textarea
                  id="act-desc"
                  name="description"
                  className="act-textarea"
                  placeholder="Describe what participants need to do and what they'll earn..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Assignee + Points value */}
              <div className="act-row">
                <div className="act-field">
                  <label className="ui-label" htmlFor="act-assignee">Assignee</label>
                  <input
                    id="act-assignee"
                    name="assignee"
                    className={`ui-input${errors.assignee ? ' field-error' : ''}`}
                    placeholder="e.g. Group A"
                    value={form.assignee}
                    onChange={handleChange}
                  />
                  {errors.assignee && <span className="act-field-error">{errors.assignee}</span>}
                </div>

                <div className="act-field">
                  <label className="ui-label" htmlFor="act-value">Points Earned</label>
                  <input
                    id="act-value"
                    name="currencyValue"
                    type="number"
                    min={1}
                    className={`ui-input${errors.currencyValue ? ' field-error' : ''}`}
                    placeholder="e.g. 50"
                    value={form.currencyValue}
                    onChange={handleChange}
                  />
                  {errors.currencyValue && <span className="act-field-error">{errors.currencyValue}</span>}
                </div>
              </div>

              {/* Due Date */}
              <div className="act-field">
                <label className="ui-label">Due Date <span style={{ fontWeight: 400, color: '#aab8c8' }}>(optional)</span></label>
                <div className="act-date-row">
                  <input
                    name="dd" className="ui-input act-date-input"
                    placeholder="DD" maxLength={2}
                    value={form.dd} onChange={handleChange}
                  />
                  <input
                    name="mm" className="ui-input act-date-input"
                    placeholder="MM" maxLength={2}
                    value={form.mm} onChange={handleChange}
                  />
                  <input
                    name="yyyy" className="ui-input act-date-input act-date-input--year"
                    placeholder="YYYY" maxLength={4}
                    value={form.yyyy} onChange={handleChange}
                  />
                </div>
                {errors.date && <span className="act-field-error">{errors.date}</span>}
              </div>

              {/* Repeatable toggle */}
              <label className="cp-checkbox-row">
                <input
                  type="checkbox"
                  name="isRepeatable"
                  checked={form.isRepeatable}
                  onChange={handleChange}
                  className="cp-checkbox"
                />
                <span className="cp-checkbox-label">Repeatable activity</span>
                <span style={{ fontSize: '0.75rem', color: '#aab8c8', marginLeft: 4 }}>
                  — participants can complete this more than once
                </span>
              </label>

            </div>

            <div className="act-modal__footer">
              <Button variant="brand" size="lg" fullWidth onClick={handlePublish}>
                Publish Activity
              </Button>
              <Button variant="primary" size="lg" fullWidth onClick={handleCancel}>
                Cancel
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}