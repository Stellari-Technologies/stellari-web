<<<<<<< HEAD
import { Link } from 'react-router-dom'

// Mock data — replace with real API calls once the backend exists
const mockStats = [
  { label: 'Active participants', value: 248 },
  { label: 'Rewards redeemed this month', value: 37 },
  { label: 'Pending redemptions', value: 5 },
]

const mockActivity = [
  { id: '1', text: 'Maya R. reached a milestone', time: '2h ago' },
  { id: '2', text: 'Jordan T. redeemed a reward', time: '5h ago' },
  { id: '3', text: 'New participant added: Sam K.', time: '1d ago' },
]

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome back</h1>
        <p>Here's what's happening with your rewards program.</p>
      </header>

      <div className="dashboard-stats">
        {mockStats.map((stat) => (
          <div key={stat.label} className="dashboard-stat-card">
            <span className="dashboard-stat-value">{stat.value}</span>
            <span className="dashboard-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <Link to="/scan" className="dashboard-scan-link">
        Open ninja scanning screen →
      </Link>

      <section className="dashboard-activity">
        <h2>Recent activity</h2>
        <ul>
          {mockActivity.map((item) => (
            <li key={item.id} className="dashboard-activity-item">
              <span>{item.text}</span>
              <span className="dashboard-activity-time">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
=======

import { useSearchParams, useNavigate } from 'react-router-dom'
import { Gift, UserPlus, Users, Zap, LayoutDashboard, ChevronRight } from 'lucide-react'
import ActivitiesTab from '../components/ActivitiesTab'
import '../styles/dashboard.css'
import '../styles/ui.css'

const TABS = [
  { key: 'activities',   label: 'Activities',         icon: <Zap size={15} /> },
  { key: 'create',       label: 'Create Participant', icon: <UserPlus size={15} /> },
  { key: 'rewards',      label: 'Rewards',            icon: <Gift size={15} /> },
  { key: 'participants', label: 'Participant Details', icon: <Users size={15} /> },
]

const TAB_META: Record<string, { title: string; subtitle: string; icon: React.ReactNode }> = {
  activities: {
    title:    'Activities',
    subtitle: 'Create and manage activities assigned to participant groups.',
    icon:     <Zap size={28} />,
  },
  create: {
    title:    'Create Participant',
    subtitle: 'Add new participants to Demo Organization.',
    icon:     <UserPlus size={28} />,
  },
  rewards: {
    title:    'Rewards',
    subtitle: 'Set up and manage the rewards catalogue for your participants.',
    icon:     <Gift size={28} />,
  },
  participants: {
    title:    'Participant Details',
    subtitle: 'View and manage individual participant profiles and progress.',
    icon:     <Users size={28} />,
  },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'activities'
  const meta = TAB_META[activeTab] ?? TAB_META['activities']

  const setTab = (key: string) => setSearchParams({ tab: key })

  return (
    <div className="dash-app">
      <nav className="dash-nav">
        <div className="dash-nav__logo">
          <span className="dash-nav__star">★</span>
          Stellari
        </div>
        <button
          className="ui-btn ui-btn-primary ui-btn-sm"
          onClick={() => navigate('/dashboard')}
          style={{ borderRadius: 999 }}
        >
          <LayoutDashboard size={14} />
          Dashboard
        </button>
        <div className="dash-nav__user">
          Demo Organization
          <div className="dash-nav__avatar">DO</div>
        </div>
      </nav>

      <div className="dash-app__body">
        <aside className="dash-sidebar">
          <div className="dash-sidebar__org">
            <div className="dash-sidebar__org-avatar">DO</div>
            <div>
              <div className="dash-sidebar__org-name">Demo Organization</div>
              <div className="dash-sidebar__org-sub">Admin</div>
            </div>
          </div>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`dash-sidebar__item${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setTab(tab.key)}
            >
              <span className="dash-sidebar__item-icon">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.key && (
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              )}
            </button>
          ))}
        </aside>

        <main className="dash-content">
          <div className="dash-content__topbar">
            <div>
              <h1 className="dash-content__title">{meta.title}</h1>
              <p className="dash-content__subtitle">{meta.subtitle}</p>
            </div>
          </div>

          {activeTab === 'activities'
            ? <ActivitiesTab />
            : (
              <div className="dash-placeholder">
                <div className="dash-placeholder-icon">{meta.icon}</div>
                <p className="dash-placeholder-title">{meta.title} — Coming Soon</p>
                <p className="dash-placeholder-sub">
                  This section is under construction. Content for "{meta.title}" will appear here.
                </p>
              </div>
            )
          }
        </main>
      </div>
>>>>>>> 2d007bd (Created the admin dashboard with 4 subtabs, Actvities, Rewards, Participant Details, and Create Participant.)
    </div>
  )
}