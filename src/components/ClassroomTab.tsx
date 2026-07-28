import { useState } from 'react'
import { Plus, X, School, Users, ArrowLeft, Mail } from 'lucide-react'
import Button from './Button'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Participant {
  id:       number
  name:     string
  email:    string
  initials: string
}

interface Classroom {
  id:             number
  name:           string
  description:    string
  maxParticipants: number
  participants:   Participant[]
}

interface FormState {
  name:            string
  description:     string
  maxParticipants: string
}

interface FormErrors {
  name?:            string
  maxParticipants?: string
}

// ─── Demo seed data ───────────────────────────────────────────────────────────
const SEED_CLASSROOMS: Classroom[] = [
  {
    id:             1,
    name:           'Ms. Johns Grade 1 Classroom',
    description:    'Morning session focused on foundational reading and math skills.',
    maxParticipants: 20,
    participants: [
      { id: 1, name: 'Demo User A', email: 'demo.usera@email.com', initials: 'DA' },
      { id: 2, name: 'Demo User B', email: 'demo.userb@email.com', initials: 'DB' },
      { id: 3, name: 'Demo User C', email: 'demo.userc@email.com', initials: 'DC' },
      { id: 4, name: 'Demo User D', email: 'demo.userd@email.com', initials: 'DD' },
      { id: 5, name: 'Demo User E', email: 'demo.usere@email.com', initials: 'DE' },
    ],
  },
]

const EMPTY_FORM: FormState = { name: '', description: '', maxParticipants: '' }

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.name.trim()) errs.name = 'Program name is required.'
  if (!form.maxParticipants) errs.maxParticipants = 'Max participants is required.'
  else if (isNaN(Number(form.maxParticipants)) || Number(form.maxParticipants) < 1)
    errs.maxParticipants = 'Enter a valid number.'
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ClassroomTab() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(SEED_CLASSROOMS)
  const [showModal,  setShowModal]  = useState(false)
  const [form,       setForm]       = useState<FormState>(EMPTY_FORM)
  const [errors,     setErrors]     = useState<FormErrors>({})
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selected = classrooms.find(c => c.id === selectedId) ?? null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleCreate = () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const newClassroom: Classroom = {
      id:              Date.now(),
      name:            form.name.trim(),
      description:     form.description.trim(),
      maxParticipants: Number(form.maxParticipants),
      participants:    [],
    }

    setClassrooms(prev => [newClassroom, ...prev])
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(false)
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(false)
  }

  // ── Classroom detail view (roster) ──────────────────────────────────────────
  if (selected) {
    return (
      <div>
        <button className="cr-back" onClick={() => setSelectedId(null)}>
          <ArrowLeft size={15} />
          Back to programs
        </button>

        <div className="cr-detail-header">
          <div className="cr-detail-icon"><School size={22} /></div>
          <div>
            <h2 className="cr-detail-title">{selected.name}</h2>
            {selected.description && <p className="cr-detail-desc">{selected.description}</p>}
          </div>
          <div className="cr-detail-count">
            <Users size={14} />
            {selected.participants.length} / {selected.maxParticipants}
          </div>
        </div>

        {selected.participants.length === 0 ? (
          <div className="dash-placeholder">
            <div className="dash-placeholder-icon"><Users size={28} /></div>
            <p className="dash-placeholder-title">No participants yet</p>
            <p className="dash-placeholder-sub">This program doesn't have any participants assigned.</p>
          </div>
        ) : (
          <div className="cr-roster">
            {selected.participants.map(p => (
              <div key={p.id} className="cr-roster-item">
                <div className="cr-roster-avatar">{p.initials}</div>
                <div className="cr-roster-info">
                  <div className="cr-roster-name">{p.name}</div>
                  <div className="cr-roster-email">
                    <Mail size={11} />
                    {p.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Classroom grid view ─────────────────────────────────────────────────────
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button
          variant="brand"
          size="md"
          onClick={() => setShowModal(true)}
          style={{ borderRadius: 999, paddingLeft: 20, paddingRight: 20 }}
        >
          <Plus size={16} />
          Create Program
        </Button>
      </div>

      {classrooms.length === 0 ? (
        <div className="dash-placeholder">
          <div className="dash-placeholder-icon"><School size={28} /></div>
          <p className="dash-placeholder-title">No programs yet</p>
          <p className="dash-placeholder-sub">Click "Create Program" to add your first one.</p>
        </div>
      ) : (
        <div className="cr-grid">
          {classrooms.map(classroom => (
            <button
              key={classroom.id}
              className="cr-card"
              onClick={() => setSelectedId(classroom.id)}
            >
              <div className="cr-card__icon"><School size={20} /></div>
              <div className="cr-card__name">{classroom.name}</div>
              {classroom.description && (
                <div className="cr-card__desc">{classroom.description}</div>
              )}
              <div className="cr-card__footer">
                <Users size={13} />
                {classroom.participants.length} / {classroom.maxParticipants} participants
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Create Classroom Modal ── */}
      {showModal && (
        <div className="act-modal-overlay" onClick={handleCancel}>
          <div className="act-modal" onClick={e => e.stopPropagation()}>

            <div className="act-modal__header">
              <h2 className="act-modal__title">Create A Program</h2>
              <button className="act-modal__close" onClick={handleCancel} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="act-modal__body">
              <div className="act-field">
                <label className="ui-label" htmlFor="cr-name">Program Name</label>
                <input
                  id="cr-name"
                  name="name"
                  className={`ui-input${errors.name ? ' field-error' : ''}`}
                  placeholder="e.g. Ms. Johns Grade 1 Classroom"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="act-field-error">{errors.name}</span>}
              </div>

              <div className="act-field">
                <label className="ui-label" htmlFor="cr-desc">Program Description</label>
                <textarea
                  id="cr-desc"
                  name="description"
                  className="act-textarea"
                  placeholder="Describe the program's focus, schedule, or anything notable..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="act-field">
                <label className="ui-label" htmlFor="cr-max">Max Participants</label>
                <input
                  id="cr-max"
                  name="maxParticipants"
                  type="number"
                  min={1}
                  className={`ui-input${errors.maxParticipants ? ' field-error' : ''}`}
                  placeholder="e.g. 20"
                  value={form.maxParticipants}
                  onChange={handleChange}
                />
                {errors.maxParticipants && <span className="act-field-error">{errors.maxParticipants}</span>}
              </div>
            </div>

            <div className="act-modal__footer">
              <Button variant="brand" size="lg" fullWidth onClick={handleCreate}>
                Create Program
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