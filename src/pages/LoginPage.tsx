import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import AuthInput from '../components/AuthInput'
import Button from '../components/Button'
import '../styles/auth.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface LoginForm   { email: string; password: string }
interface FieldErrors { email?: string; password?: string }

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form: LoginForm): FieldErrors {
  const errs: FieldErrors = {}
  if (!form.email)    errs.email    = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                      errs.email    = 'Enter a valid email address.'
  if (!form.password) errs.password = 'Password is required.'
  return errs
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate()
  const [form,   setForm]   = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    // TODO: call POST /auth/login when backend is ready
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      headline={<>Welcome <em>back</em></>}
      subtext="Sign in to access your dashboard, manage your team, and track performance — all in one place."
    >
      <h2 className="auth-form-title">Sign in</h2>
      <p className="auth-form-subtitle">Welcome back to Stellari</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          icon={<Mail size={15} />}
          placeholder="you@company.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <AuthInput
          id="password"
          name="password"
          label="Password"
          icon={<Lock size={15} />}
          placeholder="Enter your password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          passwordToggle
          labelAction={
            <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
          }
        />

        <Button type="submit" variant="primary" size="lg" fullWidth>
          Sign in
        </Button>
      </form>

      <p className="auth-footer-text">
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </AuthLayout>
  )
}