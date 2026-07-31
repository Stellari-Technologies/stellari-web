import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { signIn } from 'aws-amplify/auth'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import AuthInput from '../components/AuthInput'
import AuthAlert from '../components/AuthAlert'
import Button from '../components/Button'
import '../styles/auth.css'

interface LoginForm   { email: string; password: string }
interface FieldErrors { email?: string; password?: string }

function validate(form: LoginForm): FieldErrors {
  const errs: FieldErrors = {}
  if (!form.email)    errs.email    = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                      errs.email    = 'Enter a valid email address.'
  if (!form.password) errs.password = 'Password is required.'
  return errs
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [form,        setForm]        = useState<LoginForm>({ email: '', password: '' })
  const [errors,      setErrors]      = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading,     setLoading]     = useState(false)

  if (authLoading) return null
  if (user) return <Navigate to="/dashboard/app" replace />

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await signIn({ username: form.email, password: form.password })
      navigate('/dashboard/app')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'UserAlreadyAuthenticatedException') {
        navigate('/dashboard/app')
        return
      }
      setServerError(err instanceof Error ? err.message : 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      headline={<>Welcome <em>back</em></>}
      subtext="Sign in to access your dashboard, manage your team, and track performance — all in one place."
    >
      <h2 className="auth-form-title">Sign in</h2>
      <p className="auth-form-subtitle">Welcome back to Stellari</p>

      {serverError && <AuthAlert variant="error">{serverError}</AuthAlert>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="email" name="email" type="email"
          label="Email address" icon={<Mail size={15} />}
          placeholder="you@company.com" autoComplete="email"
          value={form.email} onChange={handleChange}
          error={errors.email}
        />
        <AuthInput
          id="password" name="password"
          label="Password" icon={<Lock size={15} />}
          placeholder="Enter your password" autoComplete="current-password"
          value={form.password} onChange={handleChange}
          error={errors.password}
          passwordToggle
          labelAction={
            <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
          }
        />
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading
            ? <><span className="auth-btn-spinner" /> Signing in…</>
            : 'Sign in'}
        </Button>
      </form>

      <p className="auth-footer-text">
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </AuthLayout>
  )
}