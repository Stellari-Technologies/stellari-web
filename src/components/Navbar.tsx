import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="ui-nav">
      <div className="ui-nav__logo">
        <span className="ui-nav__star">★</span>
        Stellari
      </div>
      <div className="ui-nav__links">
        <a href="#">About</a>
        <a href="#">Features</a>
        <a href="#">Overview</a>
      </div>
      <div className="ui-nav__actions">
        <button
          className="ui-btn ui-btn-ghost ui-btn-md"
          onClick={() => navigate('/login')}
          style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}
        >
          Log in
        </button>
        <button className="ui-btn ui-btn-primary ui-btn-md" onClick={() => navigate('/signup')}>Sign up</button>
      </div>
    </nav>
  )
}