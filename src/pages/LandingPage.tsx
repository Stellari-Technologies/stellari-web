import { useNavigate } from 'react-router-dom'
import { Trophy, Users, BarChart2, Bell } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'
import placeholderImg from '../assets/placeholder.svg'
import heroImg from '../assets/hero-illustration.svg'
import codeNinjasImg from '../assets/CodeNinjasLogo.png'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <Navbar />

      {/* HERO */}
      <section className="landing-hero">
        {/* NEW WRAPPER CONTAINER */}
        <div className="landing-hero__content">
          <h1 className="landing-hero__headline">
            Where businesses<br />
            <span className="landing-hero__accent">reward</span> progress
          </h1>
          <p className="landing-hero__sub">
            Stellari helps you run a rewards program your participants actually love —
            track activities, recognize achievements, and keep them coming back.
          </p>
          <div className="landing-hero__actions">
            <button className="ui-btn ui-btn-brand ui-btn-lg" onClick={() => navigate('/signup')}>
              Get Started Free
            </button>
            <button className="ui-btn ui-btn-ghost ui-btn-lg" onClick={() => navigate('/login')}>
              Log in
            </button>
          </div>
        </div>

        {/* HERO IMAGE (Now free to expand up to 1100px) */}
        <div className="landing-hero__img">
          <img src={heroImg} alt="Stellari platform preview" className="landing-hero__placeholder" />
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="landing-trusted">
        <p className="landing-trusted__label">Trusted by businesses like</p>
        <div className="landing-trusted__card">
          <div className="landing-trusted__photo">
            <img src={codeNinjasImg} alt="Code Ninjas North Edmonton" className="landing-trusted__logo" />
          </div>
          <div className="landing-trusted__body">
            <p className="landing-trusted__quote">
              "Stellari helped us manage all our students and their progress effortlessly.
              Our staff can track every ninja's achievements in one place."
            </p>
            <p className="landing-trusted__name">Code Ninjas North Edmonton</p>
            <p className="landing-trusted__location">Edmonton, AB</p>
          </div>
        </div>
      </section>

      {/* FEATURE 1 */}
      <section className="landing-feature">
        <div className="landing-feature__text">
          <div className="landing-feature__icon landing-feature__icon--amber">
            <Trophy size={22} />
          </div>
          <h2 className="landing-feature__headline">
            Recognize every<br />achievement
          </h2>
          <p className="landing-feature__desc">
            Reward participants when they complete activities or hit milestones.
            Every achievement recognized keeps them engaged and coming back.
          </p>
        </div>
        <div className="landing-feature__visual">
          <img src={placeholderImg} alt="Rewards" className="landing-feature__img" />
          <p className="landing-feature__img-label">Rewards illustration goes here</p>
        </div>
      </section>

      <div className="landing-divider" />

      {/* FEATURE 2 */}
      <section className="landing-feature landing-feature--reverse">
        <div className="landing-feature__text">
          <div className="landing-feature__icon landing-feature__icon--blue">
            <Users size={22} />
          </div>
          <h2 className="landing-feature__headline">
            Manage your whole<br />team in one place
          </h2>
          <p className="landing-feature__desc">
            Invite staff, assign roles, and manage participants across your
            organization — no spreadsheets needed.
          </p>
        </div>
        <div className="landing-feature__visual">
          <img src={placeholderImg} alt="Team management" className="landing-feature__img" />
          <p className="landing-feature__img-label">Team management illustration goes here</p>
        </div>
      </section>

      <div className="landing-divider" />

      {/* FEATURE 3 */}
      <section className="landing-feature">
        <div className="landing-feature__text">
          <div className="landing-feature__icon landing-feature__icon--green">
            <BarChart2 size={22} />
          </div>
          <h2 className="landing-feature__headline">
            Track every activity<br />and redemption
          </h2>
          <p className="landing-feature__desc">
            See exactly which activities were completed, what rewards were earned,
            and what was redeemed — all in one dashboard.
          </p>
        </div>
        <div className="landing-feature__visual">
          <img src={placeholderImg} alt="Analytics" className="landing-feature__img" />
          <p className="landing-feature__img-label">Analytics illustration goes here</p>
        </div>
      </section>

      <div className="landing-divider" />

      {/* FEATURE 4 */}
      <section className="landing-feature landing-feature--reverse">
        <div className="landing-feature__text">
          <div className="landing-feature__icon landing-feature__icon--purple">
            <Bell size={22} />
          </div>
          <h2 className="landing-feature__headline">
            Stay on top of<br />every update
          </h2>
          <p className="landing-feature__desc">
            Get notified when participants hit milestones or have rewards ready
            to redeem — so nothing slips through.
          </p>
        </div>
        <div className="landing-feature__visual">
          <img src={placeholderImg} alt="Notifications" className="landing-feature__img" />
          <p className="landing-feature__img-label">Notifications illustration goes here</p>
        </div>
      </section>

      {/* SIGN UP PROMPT */}
      <section className="landing-signup">
        <p className="landing-signup__eyebrow">
          A rewards platform built with business owners in mind
        </p>
        <h2 className="landing-signup__headline">
          Ready to start rewarding<br />your customers?
        </h2>
        <p className="landing-signup__sub">
          Join businesses already using Stellari to keep their participants
          engaged and coming back.
        </p>
        <button className="ui-btn ui-btn-brand ui-btn-lg" onClick={() => navigate('/signup')}>
          Start Today
        </button>
      </section>

      <Footer />
    </div>
  )
}