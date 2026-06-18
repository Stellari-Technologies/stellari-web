import { useNavigate } from 'react-router-dom'
import {
  Gift,
  UserPlus,
  Users,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_STATS = [
  { label: 'Total Participants', value: '142',  sub: '+12 this month' },
  { label: 'Active Rewards',     value: '38',   sub: '6 expiring soon' },
  { label: 'Activities Today',   value: '9',    sub: '3 in progress' },
  { label: 'Points Awarded',     value: '4.2k', sub: 'This week' },
]

const DEMO_ACTIVITY = [
  { dot: 'green', text: 'Demo User A completed "Build Project"',    time: '2 min ago' },
  { dot: 'amber', text: 'Demo User B redeemed 200 reward points',   time: '14 min ago' },
  { dot: 'navy',  text: 'New participant "Demo User C" was created', time: '1 hr ago' },
  { dot: 'green', text: 'Activity "Group Challenge" was published',  time: '2 hr ago' },
  { dot: 'amber', text: 'Demo User D reached Level 3',              time: '3 hr ago' },
]

const DEMO_PARTICIPANTS = [
  { initials: 'DA', name: 'Demo User A', role: 'Group A', badge: 'Active' },
  { initials: 'DB', name: 'Demo User B', role: 'Group B', badge: 'Active' },
  { initials: 'DC', name: 'Demo User C', role: 'Group C', badge: 'New' },
  { initials: 'DD', name: 'Demo User D', role: 'Group A', badge: 'Active' },
]

// ─── Quick action buttons ─────────────────────────────────────────────────────
const ACTIONS = [
  { label: 'Rewards',             tab: 'rewards',      icon: <Gift size={20} /> },
  { label: 'Create Participant',  tab: 'create',       icon: <UserPlus size={20} /> },
  { label: 'Participant Details', tab: 'participants', icon: <Users size={20} /> },
  { label: 'Activity Creation',   tab: 'activities',   icon: <Zap size={20} /> },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const navigate = useNavigate()

  const goToTab = (tab: string) => {
    navigate(`/dashboard/app?tab=${tab}`)
  }

  return (
    <div className="overview-page">

      {/* ── Navbar ── */}
      <nav className="dash-nav">
        <div className="dash-nav__logo">
          <span className="dash-nav__star">★</span>
          Stellari
        </div>
        <div className="dash-nav__links">
          <a href="#">Program</a>
          <a href="#">Participants</a>
          <a href="#">Rewards</a>
        </div>
        <div className="dash-nav__user">
          Demo Organization
          <div className="dash-nav__avatar">DO</div>
        </div>
      </nav>

      <main className="overview-main">

        {/* ── Breadcrumb ── */}
        <div className="overview-breadcrumb">
          <a href="#">Home</a>
          <span>›</span>
          <span>Admin Dashboard</span>
        </div>

        {/* ── Page header ── */}
        <div className="overview-header">
          <h1 className="overview-title">Admin Dashboard</h1>
          <p className="overview-subtitle">
            Manage participants, rewards, and activities for Demo Organization.
          </p>
        </div>

        {/* ── Quick action buttons ── */}
        <div className="overview-actions">
          {ACTIONS.map(action => (
            <button
              key={action.tab}
              className="overview-action-btn"
              onClick={() => goToTab(action.tab)}
            >
              <div className="overview-action-icon">{action.icon}</div>
              {action.label}
            </button>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="overview-stats">
          {DEMO_STATS.map(stat => (
            <div key={stat.label} className="overview-stat-card">
              <div className="overview-stat-label">{stat.label}</div>
              <div className="overview-stat-value">{stat.value}</div>
              <div className="overview-stat-sub">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Recent activity + participants ── */}
        <div className="overview-bottom">

          {/* Recent activity */}
          <div className="ui-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={16} color="var(--color-brand)" />
              <h2 className="overview-section-title" style={{ margin: 0 }}>Recent Activity</h2>
            </div>
            <div className="overview-activity-list">
              {DEMO_ACTIVITY.map((item, i) => (
                <div key={i} className="overview-activity-item">
                  <div className={`overview-activity-dot ${item.dot}`} />
                  <span className="overview-activity-text">{item.text}</span>
                  <span className="overview-activity-meta">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent participants */}
          <div className="ui-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Users size={16} color="var(--color-brand)" />
              <h2 className="overview-section-title" style={{ margin: 0 }}>Recent Participants</h2>
            </div>
            <div className="overview-participant-list">
              {DEMO_PARTICIPANTS.map((p, i) => (
                <div key={i} className="overview-participant-item">
                  <div className="overview-participant-avatar">{p.initials}</div>
                  <div>
                    <div className="overview-participant-name">{p.name}</div>
                    <div className="overview-participant-role">{p.role}</div>
                  </div>
                  <span className="overview-participant-badge">{p.badge}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}