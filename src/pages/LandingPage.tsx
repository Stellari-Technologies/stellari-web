import { useNavigate } from 'react-router-dom'
import { Bell, User, Users, BarChart2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Footer from '../components/Footer'
import './LandingPage.css'

const features = [
  {
    icon: <Bell size={28} />,
    title: 'Smart Notifications',
    desc: 'Stay on top of every participant milestone and activity update without missing a beat.',
  },
  {
    icon: <User size={28} />,
    title: 'Easy Customer Management',
    desc: 'Manage all your participants, staff, and organizations from one clean dashboard.',
  },
  {
    icon: <Users size={28} />,
    title: 'Easy Employee Access',
    desc: 'Give your team the right access they need — invite staff and manage roles effortlessly.',
  },
  {
    icon: <BarChart2 size={28} />,
    title: 'Built In Data Management',
    desc: 'Track every star earned, reward redeemed, and activity completed — all in one place.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <Navbar />

      {/* HERO */}
      <div className="landing-hero-wrap">
        <div className="landing-hero">
          <h1 className="landing-hero__headline">
            Manage your business{' '}
            <span className="landing-hero__accent">smarter,</span>
            <br />not harder.
          </h1>
          <p className="landing-hero__sub">
            Stellari helps you reward progress, track activities, and keep your
            customers coming back — all from one simple platform.
          </p>
          <Button variant="brand" size="lg" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="landing-features-wrap">
        <div className="landing-features">
          <div className="landing-features__header">
            <h2 className="landing-features__title">
              One platform for all the customer management you could possibly need.
            </h2>
            <p className="landing-features__sub">
              Everything your team needs to manage participants, assign stars, and redeem rewards — without the mess.
            </p>
          </div>
          <div className="landing-features__grid">
            {features.map((f) => (
              <div className="landing-feature-card" key={f.title}>
                <div className="landing-feature-card__icon">{f.icon}</div>
                <h3 className="landing-feature-card__title">{f.title}</h3>
                <p className="landing-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIGN UP PROMPT */}
      <div className="landing-signup-wrap">
        <div className="landing-signup">
          <p className="landing-signup__eyebrow">
            A customer management tool created with business owners in mind
          </p>
          <h2 className="landing-signup__headline">
            Built to grow with you,<br />and your business.
          </h2>
          <div className="landing-signup__actions">
            <Button variant="brand" size="lg" onClick={() => navigate('/signup')}>
              Start Today
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}