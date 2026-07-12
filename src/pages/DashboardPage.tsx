import type { ReactNode } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Gift, UserPlus, Users, Zap, LayoutDashboard, ChevronRight, UserCog, ClipboardList, School, Building2 } from 'lucide-react'
import ActivitiesTab from '../components/ActivitiesTab'
import CreateParticipantTab from '../components/CreateParticipantTab'
import CreateStaffTab from '../components/CreateStaffTab'
import ClassroomTab from '../components/ClassroomTab'
import OrgSetupTab from '../components/OrgSetupTab'
import ParticipantDetailsTab from '../components/ParticipantDetailsTab'
import RewardsTab from '../components/RewardsTab'
import '../styles/dashboard.css'
import '../styles/ui.css'
import { signOut } from 'aws-amplify/auth'

// ─── Tab definitions per mode ─────────────────────────────────────────────────
const PARTICIPANT_TABS = [
  { key: 'activities',   label: 'Activities',         icon: <Zap size={15} /> },
  { key: 'create',       label: 'Create Participant', icon: <UserPlus size={15} /> },
  { key: 'classrooms',   label: 'Program',            icon: <School size={15} /> },
  { key: 'rewards',      label: 'Rewards',            icon: <Gift size={15} /> },
  { key: 'participants', label: 'Participant Details', icon: <Users size={15} /> },
]

const STAFF_TABS = [
  { key: 'orgSetup',      label: 'Organization Setup', icon: <Building2 size={15} /> },
  { key: 'createStaff',   label: 'Create Staff',        icon: <UserCog size={15} /> },
  { key: 'staffDetails',  label: 'Staff Details',       icon: <ClipboardList size={15} /> },
]

const TAB_META: Record<string, { title: string; subtitle: string; icon: ReactNode }> = {
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
  classrooms: {
    title:    'Program',
    subtitle: 'Organize participants into classrooms and manage rosters.',
    icon:     <School size={28} />,
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
  orgSetup: {
    title:    'Organization Setup',
    subtitle: 'Configure your organization name, type, and program settings.',
    icon:     <Building2 size={28} />,
  },
  createStaff: {
    title:    'Create Staff',
    subtitle: 'Add new staff members to Demo Organization.',
    icon:     <UserCog size={28} />,
  },
  staffDetails: {
    title:    'Staff Details',
    subtitle: 'View and manage staff profiles and permissions.',
    icon:     <ClipboardList size={28} />,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const mode      = searchParams.get('mode') ?? 'participant'
  const activeTab = searchParams.get('tab')  ?? (mode === 'staff' ? 'orgSetup' : 'activities')
  const tabs      = mode === 'staff' ? STAFF_TABS : PARTICIPANT_TABS
  const meta      = TAB_META[activeTab] ?? TAB_META.activities

  const setMode = (m: string) => {
    setSearchParams({ mode: m, tab: m === 'staff' ? 'orgSetup' : 'activities' })
  }

  const setTab = (key: string) => {
    setSearchParams({ mode, tab: key })
  }

  const handleSignOut = async () => {
    await signOut()
    localStorage.removeItem('orgId')
    navigate('/login')
  }

  return (
    <div className="dash-app">
      

      <nav className="dash-nav">
        <div className="dash-nav__logo">
          <span className="dash-nav__star">★</span>
          Stellari
        </div>
        <button
          className="ui-btn ui-btn-ghost ui-btn-sm"
          onClick={() => navigate('/dashboard')}
          style={{ borderRadius: 8, fontFamily: "'DM Sans', sans-serif", gap: 6 }}
        >
          <LayoutDashboard size={14} />
          Overview
        </button>
        <div className="dash-nav__user">
          Demo Organization
          <div className="dash-nav__avatar">DO</div>
          <button
            className="ui-btn ui-btn-ghost ui-btn-sm"
            onClick={handleSignOut}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign out
          </button>
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

          <div className="dash-mode-toggle">
            <button
              className={`dash-mode-btn${mode === 'participant' ? ' active' : ''}`}
              onClick={() => setMode('participant')}
            >
              Participants
            </button>
            <button
              className={`dash-mode-btn${mode === 'staff' ? ' active' : ''}`}
              onClick={() => setMode('staff')}
            >
              Staff
            </button>
          </div>

          <div className="dash-sidebar__section-label">
            {mode === 'participant' ? 'Participant Management' : 'Staff Management'}
          </div>

          {tabs.map(tab => (
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
            : activeTab === 'create'
            ? <CreateParticipantTab />
            // change to:
            : activeTab === 'classrooms'
            ? (
              <div className="dash-placeholder">
                <div className="dash-placeholder-icon"><School size={28} /></div>
                <p className="dash-placeholder-title">Program — Coming Soon</p>
                <p className="dash-placeholder-sub">This section is still in progress and will be available soon.</p>
              </div>
            )
            : activeTab === 'orgSetup'
            ? <OrgSetupTab />
            : activeTab === 'createStaff'
            ? <CreateStaffTab />
            : activeTab === 'participants'
            ? <ParticipantDetailsTab />
            : activeTab === 'rewards'
            ? <RewardsTab />
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
    </div>
  )
}