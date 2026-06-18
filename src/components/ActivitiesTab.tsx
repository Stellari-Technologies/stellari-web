import { useState } from 'react'
import { Plus, X, Zap, Calendar, Users, Award } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Activity {
  id: number
  name:        string
  description: string
  assignee:    string
  dueDate:     string
  reward:      number
}

interface FormState {
  name:        string
  description: string
  assignee:    string
  dd:          string
  mm:          string
  yyyy:        string
  reward:      string
}

interface FormErrors {
  name?:     string
  assignee?: string
  reward?:   string
  date?:     string
}

// ─── Demo seed data ───────────────────────────────────────────────────────────
const SEED_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name:        'Build Project',
    description: 'Finish the tutorial project and key learning concepts.',
    assignee:    'Group A',
    dueDate:     '30/06/2026',
    reward:      50,
  },
  {
    id: 2,
    name:        'Build Project',
    description: 'Finish the tutorial project and key learning concepts.',
    assignee:    'Group C',
    dueDate:     '30/06/2026',
    reward:      50,
  },
]

const EMPTY_FORM: FormState = {
  name: '', description: '', assignee: '', dd: '', mm: '', yyyy: '', reward: '',
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.name.trim())     errs.name     = 'Activity name is required.'
  if (!form.assignee.trim()) errs.assignee = 'Assignee is required.'
  if (!form.reward)          errs.reward   = 'Reward amount is required.'
  else if (isNaN(Number(form.reward)) || Number(form.reward) < 1)
                             errs.reward   = 'Enter a valid reward amount.'
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
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handlePublish = () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const dueDate = form.dd && form.mm && form.yyyy
      ? `${form.dd.padStart(2,'0')}/${form.mm.padStart(2,'0')}/${form.yyyy}`
      : '—'

    const newActivity: Activity = {
      id:          Date.now(),
      name:        form.name.trim(),
      description: form.description.trim(),
      assignee:    form.assignee.trim(),
      dueDate,
      reward:      Number(form.reward),
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
          + Create Activity
        </Button>
      </div>

      {/* ── Activity list ── */}
      {activities.length === 0 ? (
        <div className="dash-placeholder">
          <div className="dash-placeholder-icon"><Zap size={28} /></div>
          <p className="dash-placeholder-title">No activities yet</p>
          <p className="dash-placeholder-sub">Click "+ Create Activity" to add your first one.</p>
        </div>
      ) : (
        <div className="act-list">
          {activities.map(activity => (
            <div key={activity.id} className="act-card">
              <div className="act-card__icon">
                <Zap size={18} />
              </div>
              <div className="act-card__body">
                <div className="act-card__name">{activity.name}</div>
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
                    {activity.reward} pts
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

            {/* Header */}
            <div className="act-modal__header">
              <h2 className="act-modal__title">Create An Activity</h2>
              <button className="act-modal__close" onClick={handleCancel} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="act-modal__body">

              {/* Activity Name */}
              <div className="act-field">
                <label className="ui-label" htmlFor="act-name">Activity Name</label>
                <input
                  id="act-name"
                  name="name"
                  className={`ui-input${errors.name ? ' field-error' : ''}`}
                  placeholder="e.g. Finish Addition Worksheet!"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="act-field-error">{errors.name}</span>}
              </div>

              {/* Activity Description */}
              <div className="act-field">
                <label className="ui-label" htmlFor="act-desc">Activity Description</label>
                <textarea
                  id="act-desc"
                  name="description"
                  className="act-textarea"
                  placeholder="Describe what participants need to do and what they'll earn..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              {/* Two column: Assignee + Reward */}
              <div className="act-row">
                <div className="act-field">
                  <label className="ui-label" htmlFor="act-assignee">Activity Assignee</label>
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
                  <label className="ui-label" htmlFor="act-reward">Reward Amount (pts)</label>
                  <input
                    id="act-reward"
                    name="reward"
                    type="number"
                    min={1}
                    className={`ui-input${errors.reward ? ' field-error' : ''}`}
                    placeholder="e.g. 50"
                    value={form.reward}
                    onChange={handleChange}
                  />
                  {errors.reward && <span className="act-field-error">{errors.reward}</span>}
                </div>
              </div>

              {/* Due Date */}
              <div className="act-field">
                <label className="ui-label">Activity Due Date</label>
                <div className="act-date-row">
                  <input
                    name="dd"
                    className="ui-input act-date-input"
                    placeholder="DD"
                    maxLength={2}
                    value={form.dd}
                    onChange={handleChange}
                  />
                  <input
                    name="mm"
                    className="ui-input act-date-input"
                    placeholder="MM"
                    maxLength={2}
                    value={form.mm}
                    onChange={handleChange}
                  />
                  <input
                    name="yyyy"
                    className="ui-input act-date-input act-date-input--year"
                    placeholder="YYYY"
                    maxLength={4}
                    value={form.yyyy}
                    onChange={handleChange}
                  />
                </div>
                {errors.date && <span className="act-field-error">{errors.date}</span>}
              </div>

            </div>

            {/* Footer buttons */}
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