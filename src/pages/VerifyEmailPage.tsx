import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MailOpen } from 'lucide-react'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthAlert from '../components/AuthAlert'
import Button from '../components/Button'
import '../styles/auth.css'
import '../styles/ui.css'

const CODE_LENGTH = 6

export default function VerifyEmailPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const email          = searchParams.get('email') ?? ''

  const [digits,      setDigits]      = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [serverError, setServerError] = useState('')
  const [successMsg,  setSuccessMsg]  = useState('')
  const [loading,     setLoading]     = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const code       = digits.join('')
  const isComplete = digits.every(d => d !== '')

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, CODE_LENGTH)
      const next   = Array(CODE_LENGTH).fill('')
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
      setDigits(next)
      inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
      return
    }
    const digit = value.replace(/\D/g, '')
    const next  = [...digits]
    next[index] = digit
    setDigits(next)
    setServerError('')
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isComplete) return

    setLoading(true)
    setServerError('')
    try {
      await confirmSignUp({ username: email, confirmationCode: code })
      setSuccessMsg('Email verified! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await resendSignUpCode({ username: email })
      setSuccessMsg('A new code has been sent.')
      setResendTimer(60)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to resend code.')
    }
  }

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="ui-card verify-card">

          <div className="verify-icon-wrap">
            <MailOpen size={32} strokeWidth={1.5} />
          </div>

          <h1 className="verify-title">Check your email</h1>
          <p className="verify-subtitle">We sent you a 6-digit code to</p>
          <p className="verify-email">{email || 'your email address'}</p>

          {serverError && (
            <div style={{ marginTop: 16 }}>
              <AuthAlert variant="error">{serverError}</AuthAlert>
            </div>
          )}
          {successMsg && (
            <div style={{ marginTop: 16 }}>
              <AuthAlert variant="success">{successMsg}</AuthAlert>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="verify-otp-row">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onFocus={e => e.target.select()}
                  className={`verify-otp-box${digit ? ' filled' : ''}`}
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading || !isComplete}
              style={{ marginTop: 24 }}
            >
              {loading
                ? <><span className="auth-btn-spinner" /> Verifying…</>
                : 'Verify email'}
            </Button>
          </form>

          <div className="verify-footer">
            <p className="auth-footer-text">
              Didn't get it?{' '}
              <button
                type="button"
                className="auth-resend"
                onClick={handleResend}
                disabled={loading || resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
            </p>
            <p className="auth-footer-text">
              <Link to="/signup">← Back to sign up</Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}