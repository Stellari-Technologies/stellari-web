import { useState } from 'react'
import {
  User, Mail, Phone, Users, Award,
  CheckCircle2, Clock, BookOpen, ChevronRight,
} from 'lucide-react'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Activity {
  id:          number
  name:        string
  description: string
  reward:      number
  dueDate:     string
  completed:   boolean
}

interface DemoParticipant {
  displayName:  string
  username:     string
  program:      string
  email:        string
  phone:        string
  initials:     string
  group:        string
  joinDate:     string
  totalPoints:  number
  parentName:   string
  parentEmail:  string
  parentPhone:  string
  activities:   Activity[]
}

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_PARTICIPANT: DemoParticipant = {
  displayName:  'Demo User A',
  username:     'demousera',
  program:      'JR Program',
  email:        'demo.usera@email.com',
  phone:        '+1 (555) 012-3456',
  initials:     'DA',
  group:        'Group A',
  joinDate:     'January 10, 2026',
  totalPoints:  320,
  parentName:   'Demo Parent A',
  parentEmail:  'parent.a@email.com',
  parentPhone:  '+1 (555) 098-7654',
  activities: [
    {
      id:          1,
      name:        'Build Project',
      description: 'Finish the tutorial project and demonstrate key learning concepts.',
      reward:      50,
      dueDate:     '30/06/2026',
      completed:   true,
    },
    {
      id:          2,
      name:        'Group Challenge',
      description: 'Work with your group to solve the weekly problem set.',
      reward:      75,
      dueDate:     '28/06/2026',
      completed:   true,
    },
    {
      id:          3,
      name:        'Reading Assignment',
      description: 'Read chapters 4–6 and submit a short summary.',
      reward:      40,
      dueDate:     '05/07/2026',
      completed:   false,
    },
    {
      id:          4,
      name:        'Peer Review',
      description: "Review two classmates' projects and leave constructive feedback.",
      reward:      30,
      dueDate:     '07/07/2026',
      completed:   false,
    },
  ],
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ParticipantDetailsTab() {
  const [view, setView] = useState<'info' | 'progress'>('info')
  const p = DEMO_PARTICIPANT

  const completed   = p.activities.filter(a => a.completed)
  const outstanding = p.activities.filter(a => !a.completed)

  return (
    <div className="pd-wrap">

      {/* ── Participant header ── */}
      <div className="pd-header">
        <div className="pd-avatar">{p.initials}</div>
        <div className="pd-header__info">
          <h2 className="pd-name">{p.displayName}</h2>
          <div className="pd-meta">
            <span className="pd-badge pd-badge--program">{p.program}</span>
            <span className="pd-badge pd-badge--group">{p.group}</span>
          </div>
        </div>
        <div className="pd-points">
          <Award size={16} />
          <span className="pd-points__value">{p.totalPoints}</span>
          <span className="pd-points__label">pts earned</span>
        </div>
      </div>

      {/* ── Info / Progress toggle ── */}
      <div className="pd-toggle">
        <button
          className={`pd-toggle-btn${view === 'info' ? ' active' : ''}`}
          onClick={() => setView('info')}
        >
          <User size={14} />
          Information
        </button>
        <button
          className={`pd-toggle-btn${view === 'progress' ? ' active' : ''}`}
          onClick={() => setView('progress')}
        >
          <BookOpen size={14} />
          Progress
        </button>
      </div>

      {/* ── Information view ── */}
      {view === 'info' && (
        <div className="pd-sections">

          {/* Participant info */}
          <div className="pd-section">
            <div className="pd-section__title">
              <User size={14} />
              Participant Details
            </div>
            <div className="pd-fields">
              <div className="pd-field">
                <span className="pd-field__label">Display Name</span>
                <span className="pd-field__value">{p.displayName}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">Username</span>
                <span className="pd-field__value">@{p.username}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">Program</span>
                <span className="pd-field__value">{p.program}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">Group</span>
                <span className="pd-field__value">{p.group}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">
                  <Mail size={12} /> Email
                </span>
                <span className="pd-field__value">{p.email}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">
                  <Phone size={12} /> Phone
                </span>
                <span className="pd-field__value">{p.phone}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">Joined</span>
                <span className="pd-field__value">{p.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Parent / Guardian info */}
          <div className="pd-section">
            <div className="pd-section__title">
              <Users size={14} />
              Parent / Guardian
            </div>
            <div className="pd-fields">
              <div className="pd-field">
                <span className="pd-field__label">Name</span>
                <span className="pd-field__value">{p.parentName}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">
                  <Mail size={12} /> Email
                </span>
                <span className="pd-field__value">{p.parentEmail}</span>
              </div>
              <div className="pd-field">
                <span className="pd-field__label">
                  <Phone size={12} /> Phone
                </span>
                <span className="pd-field__value">{p.parentPhone}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── Progress view ── */}
      {view === 'progress' && (
        <div className="pd-sections">

          {/* Completed */}
          <div className="pd-section">
            <div className="pd-section__title">
              <CheckCircle2 size={14} />
              Completed ({completed.length})
            </div>
            <div className="pd-activity-list">
              {completed.map(a => (
                <div key={a.id} className="pd-activity pd-activity--done">
                  <div className="pd-activity__icon pd-activity__icon--done">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="pd-activity__body">
                    <div className="pd-activity__name">{a.name}</div>
                    <div className="pd-activity__desc">{a.description}</div>
                    <div className="pd-activity__meta">
                      <span className="pd-activity__reward">
                        <Award size={11} /> +{a.reward} pts
                      </span>
                      <span className="pd-activity__due">
                        <ChevronRight size={11} /> Due {a.dueDate}
                      </span>
                    </div>
                  </div>
                  <span className="pd-status pd-status--done">Completed</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding */}
          <div className="pd-section">
            <div className="pd-section__title">
              <Clock size={14} />
              Outstanding ({outstanding.length})
            </div>
            <div className="pd-activity-list">
              {outstanding.map(a => (
                <div key={a.id} className="pd-activity pd-activity--pending">
                  <div className="pd-activity__icon pd-activity__icon--pending">
                    <Clock size={16} />
                  </div>
                  <div className="pd-activity__body">
                    <div className="pd-activity__name">{a.name}</div>
                    <div className="pd-activity__desc">{a.description}</div>
                    <div className="pd-activity__meta">
                      <span className="pd-activity__reward">
                        <Award size={11} /> +{a.reward} pts
                      </span>
                      <span className="pd-activity__due">
                        <ChevronRight size={11} /> Due {a.dueDate}
                      </span>
                    </div>
                  </div>
                  <span className="pd-status pd-status--pending">Pending</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}