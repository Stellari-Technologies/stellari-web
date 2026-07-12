import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  PieChart, Pie, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { TrendingUp, Users, ArrowRight, Activity, Gift, Zap, UserPlus, Award } from 'lucide-react'
import '../styles/dashboard.css'
import '../styles/ui.css'

// ─── Chart data ───────────────────────────────────────────────────────────────
const WEEKLY_POINTS = [
  { day: 'Mon', points: 240 },
  { day: 'Tue', points: 380 },
  { day: 'Wed', points: 310 },
  { day: 'Thu', points: 520 },
  { day: 'Fri', points: 410 },
  { day: 'Sat', points: 180 },
  { day: 'Sun', points: 290 },
]

const ACTIVITY_STATUS = [
  { name: 'Completed', value: 14, color: '#3db87a' },
  { name: 'In Progress', value: 3, color: '#f5a623' },
  { name: 'Not Started', value: 6, color: '#e8edf3' },
]

const MONTHLY_PARTICIPANTS = [
  { month: 'Jan', count: 98 },
  { month: 'Feb', count: 107 },
  { month: 'Mar', count: 115 },
  { month: 'Apr', count: 119 },
  { month: 'May', count: 130 },
  { month: 'Jun', count: 142 },
]

// ─── Other demo data ──────────────────────────────────────────────────────────
const DEMO_STATS = [
  { label: 'Total Participants', value: '142', sub: '+12 this month',  subColor: '#3db87a', icon: <Users size={16} /> },
  { label: 'Active Rewards',     value: '38',  sub: '6 expiring soon', subColor: '#f5a623', icon: <Gift size={16} /> },
  { label: 'Activities Today',   value: '9',   sub: '3 in progress',   subColor: '#3db87a', icon: <Zap size={16} /> },
  { label: 'Points This Week',   value: '2.3k',sub: '+18% vs last wk', subColor: '#3db87a', icon: <Award size={16} /> },
]

const DEMO_ACTIVITY = [
  { dot: 'green', text: 'Demo User A completed "Build Project"',    time: '2m ago' },
  { dot: 'amber', text: 'Demo User B redeemed 200 reward points',   time: '14m ago' },
  { dot: 'navy',  text: 'New participant "Demo User C" was created', time: '1h ago' },
  { dot: 'green', text: 'Activity "Group Challenge" was published',  time: '2h ago' },
  { dot: 'amber', text: 'Demo User D reached Level 3',              time: '3h ago' },
]

const DEMO_PARTICIPANTS = [
  { initials: 'DA', name: 'Demo User A', role: 'Group A', badge: 'Active', badgeColor: '#3db87a' },
  { initials: 'DB', name: 'Demo User B', role: 'Group B', badge: 'Active', badgeColor: '#3db87a' },
  { initials: 'DC', name: 'Demo User C', role: 'Group C', badge: 'New',    badgeColor: '#f5a623' },
  { initials: 'DD', name: 'Demo User D', role: 'Group A', badge: 'Active', badgeColor: '#3db87a' },
]

const QUICK_LINKS = [
  { label: 'Create Participant', icon: <UserPlus size={15} />, tab: 'create' },
  { label: 'Activity Creation',  icon: <Zap size={15} />,     tab: 'activities' },
  { label: 'Rewards',            icon: <Gift size={15} />,    tab: 'rewards' },
  { label: 'Participants',       icon: <Users size={15} />,   tab: 'participants' },
]

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e8edf3', borderRadius: 8,
      padding: '8px 14px', fontSize: 13, color: '#1a3561',
      boxShadow: '0 4px 12px rgba(26,53,97,0.1)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ color: '#f5a623', fontWeight: 600 }}>{payload[0].value} {payload[0].name}</div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const navigate = useNavigate()
  const total = ACTIVITY_STATUS.reduce((s, d) => s + d.value, 0)
  const completedPct = Math.round((ACTIVITY_STATUS[0].value / total) * 100)

  return (
    <div className="ov2-page">

      {/* ── Navbar ── */}
      <nav className="ov2-nav">
        <div className="ov2-nav__logo">
          <span className="ov2-nav__star">★</span>
          Stellari
        </div>
        <div className="ov2-nav__user">
          <div className="ov2-nav__org">Demo Organization</div>
          <div className="ov2-nav__avatar">DO</div>
        </div>
      </nav>

      <main className="ov2-main">

        {/* ── Hero ── */}
        <div className="ov2-hero">
          <div className="ov2-hero__left">
            <div className="ov2-hero__eyebrow">Admin Dashboard</div>
            <h1 className="ov2-hero__title">Good morning,<br />Demo Organization 👋</h1>
            <p className="ov2-hero__sub">Here's what's happening across your program today.</p>
            <button className="ov2-hero__cta" onClick={() => navigate('/dashboard/app?tab=activities')}>
              Go to Management <ArrowRight size={16} />
            </button>
          </div>
          <div className="ov2-hero__links">
            <div className="ov2-hero__links-label">Quick access</div>
            <div className="ov2-hero__links-grid">
              {QUICK_LINKS.map(l => (
                <button key={l.tab} className="ov2-quick-link" onClick={() => navigate(`/dashboard/app?tab=${l.tab}`)}>
                  <span className="ov2-quick-link__icon">{l.icon}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="ov2-stats">
          {DEMO_STATS.map(stat => (
            <div key={stat.label} className="ov2-stat">
              <div className="ov2-stat__top">
                <span className="ov2-stat__label">{stat.label}</span>
                <span className="ov2-stat__icon">{stat.icon}</span>
              </div>
              <div className="ov2-stat__value">{stat.value}</div>
              <div className="ov2-stat__sub" style={{ color: stat.subColor }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="ov2-charts">

          {/* Weekly points area chart */}
          <div className="ov2-card ov2-card--wide">
            <div className="ov2-card__header">
              <TrendingUp size={15} />
              Points Awarded This Week
              <span className="ov2-card__badge">2,330 total</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={WEEKLY_POINTS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pointsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a3561" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a3561" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#aab8c8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aab8c8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="points" name="pts" stroke="#1a3561" strokeWidth={2} fill="url(#pointsGrad)" dot={{ fill: '#1a3561', r: 3 }} activeDot={{ r: 5, fill: '#f5a623' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity completion donut */}
          <div className="ov2-card">
            <div className="ov2-card__header">
              <Activity size={15} />
              Activity Completion
            </div>
            <div className="ov2-donut-wrap">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={ACTIVITY_STATUS} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {ACTIVITY_STATUS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="ov2-donut-center">
                <span className="ov2-donut-pct">{completedPct}%</span>
                <span className="ov2-donut-label">done</span>
              </div>
            </div>
            <div className="ov2-donut-legend">
              {ACTIVITY_STATUS.map(s => (
                <div key={s.name} className="ov2-legend-item">
                  <span className="ov2-legend-dot" style={{ background: s.color }} />
                  <span className="ov2-legend-name">{s.name}</span>
                  <span className="ov2-legend-val">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Participant growth bar chart */}
          <div className="ov2-card">
            <div className="ov2-card__header">
              <Users size={15} />
              Participant Growth
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={MONTHLY_PARTICIPANTS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#aab8c8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aab8c8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} domain={[80, 160]} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="participants" radius={[4, 4, 0, 0]}>
                  {MONTHLY_PARTICIPANTS.map((_, i) => (
                    <Cell key={i} fill={i === MONTHLY_PARTICIPANTS.length - 1 ? '#f5a623' : '#1a3561'} fillOpacity={i === MONTHLY_PARTICIPANTS.length - 1 ? 1 : 0.55} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#aab8c8', marginTop: 4, fontFamily: 'DM Sans' }}>
              Last 6 months · Latest month highlighted
            </div>
          </div>

        </div>

        {/* ── Activity + Participants ── */}
        <div className="ov2-bottom">
          <div className="ov2-card">
            <div className="ov2-card__header"><TrendingUp size={15} />Recent Activity</div>
            <div className="ov2-activity-list">
              {DEMO_ACTIVITY.map((item, i) => (
                <div key={i} className="ov2-activity-item">
                  <span className={`ov2-activity-dot ${item.dot}`} />
                  <span className="ov2-activity-text">{item.text}</span>
                  <span className="ov2-activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ov2-card">
            <div className="ov2-card__header"><Users size={15} />Recent Participants</div>
            <div className="ov2-participant-list">
              {DEMO_PARTICIPANTS.map((p, i) => (
                <div key={i} className="ov2-participant-item">
                  <div className="ov2-participant-avatar">{p.initials}</div>
                  <div className="ov2-participant-info">
                    <div className="ov2-participant-name">{p.name}</div>
                    <div className="ov2-participant-role">{p.role}</div>
                  </div>
                  <span className="ov2-participant-badge" style={{ color: p.badgeColor, background: `${p.badgeColor}18` }}>
                    {p.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}