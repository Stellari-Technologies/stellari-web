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
    </div>
  )
}