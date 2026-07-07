import { useState } from 'react'
import { Plus, X, Gift, Tag, FileText, Coins } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Reward {
  id:           number
  title:        string
  description:  string
  currencyCost: number
}

interface FormState {
  title:        string
  description:  string
  currencyCost: string
}

interface FormErrors {
  title?:        string
  currencyCost?: string
}

// ─── Demo seed data ───────────────────────────────────────────────────────────
const SEED_REWARDS: Reward[] = [
  {
    id:           1,
    title:        'Free Snack',
    description:  'Redeem for a snack of your choice from the front desk.',
    currencyCost: 100,
  },
  {
    id:           2,
    title:        'Extra Screen Time',
    description:  '30 minutes of extra screen time during free period.',
    currencyCost: 150,
  },
  {
    id:           3,
    title:        'Skip One Homework',
    description:  'Use this reward to skip one homework assignment, no questions asked.',
    currencyCost: 300,
  },
  {
    id:           4,
    title:        'Lunch With Teacher',
    description:  'Get to have lunch with your favourite teacher.',
    currencyCost: 500,
  },
]

const EMPTY_FORM: FormState = { title: '', description: '', currencyCost: '' }

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.title.trim()) errs.title = 'Reward title is required.'
  if (!form.currencyCost) errs.currencyCost = 'Point cost is required.'
  else if (isNaN(Number(form.currencyCost)) || Number(form.currencyCost) < 1)
    errs.currencyCost = 'Enter a valid point amount.'
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function RewardsTab() {
  const [rewards,   setRewards]   = useState<Reward[]>(SEED_REWARDS)
  const [showModal, setShowModal] = useState(false)
  const [form,      setForm]      = useState<FormState>(EMPTY_FORM)
  const [errors,    setErrors]    = useState<FormErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleCreate = () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const newReward: Reward = {
      id:           Date.now(),
      title:        form.title.trim(),
      description:  form.description.trim(),
      currencyCost: Number(form.currencyCost),
    }

    setRewards(prev => [newReward, ...prev])
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
          Create Reward
        </Button>
      </div>

      {/* ── Rewards grid ── */}
      {rewards.length === 0 ? (
        <div className="dash-placeholder">
          <div className="dash-placeholder-icon"><Gift size={28} /></div>
          <p className="dash-placeholder-title">No rewards yet</p>
          <p className="dash-placeholder-sub">Click "Create Reward" to add your first one.</p>
        </div>
      ) : (
        <div className="rw-grid">
          {rewards.map(reward => (
            <div key={reward.id} className="rw-card">
              <div className="rw-card__icon"><Gift size={20} /></div>
              <div className="rw-card__body">
                <div className="rw-card__title">{reward.title}</div>
                {reward.description && (
                  <div className="rw-card__desc">{reward.description}</div>
                )}
              </div>
              <div className="rw-card__footer">
                <Coins size={13} />
                {reward.currencyCost} pts to redeem
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Reward Modal ── */}
      {showModal && (
        <div className="act-modal-overlay" onClick={handleCancel}>
          <div className="act-modal" onClick={e => e.stopPropagation()}>

            <div className="act-modal__header">
              <h2 className="act-modal__title">Create A Reward</h2>
              <button className="act-modal__close" onClick={handleCancel} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="act-modal__body">

              {/* Title */}
              <div className="act-field">
                <label className="ui-label" htmlFor="rw-title">
                  <Tag size={12} style={{ display: 'inline', marginRight: 5 }} />
                  Reward Title
                </label>
                <input
                  id="rw-title"
                  name="title"
                  className={`ui-input${errors.title ? ' field-error' : ''}`}
                  placeholder="e.g. Free Snack, Extra Screen Time"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="act-field-error">{errors.title}</span>}
              </div>

              {/* Description */}
              <div className="act-field">
                <label className="ui-label" htmlFor="rw-desc">
                  <FileText size={12} style={{ display: 'inline', marginRight: 5 }} />
                  Description <span style={{ fontWeight: 400, color: '#aab8c8' }}>(optional)</span>
                </label>
                <textarea
                  id="rw-desc"
                  name="description"
                  className="act-textarea"
                  placeholder="Describe what the participant gets when they redeem this reward..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Point cost */}
              <div className="act-field">
                <label className="ui-label" htmlFor="rw-cost">
                  <Coins size={12} style={{ display: 'inline', marginRight: 5 }} />
                  Points Required to Redeem
                </label>
                <input
                  id="rw-cost"
                  name="currencyCost"
                  type="number"
                  min={1}
                  className={`ui-input${errors.currencyCost ? ' field-error' : ''}`}
                  placeholder="e.g. 100"
                  value={form.currencyCost}
                  onChange={handleChange}
                />
                <span className="org-hint">
                  How many points a participant needs to spend to redeem this reward.
                </span>
                {errors.currencyCost && <span className="act-field-error">{errors.currencyCost}</span>}
              </div>

            </div>

            <div className="act-modal__footer">
              <Button variant="brand" size="lg" fullWidth onClick={handleCreate}>
                Publish Reward
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