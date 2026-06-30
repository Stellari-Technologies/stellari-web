import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { signUp } from 'aws-amplify/auth'
import AuthLayout from '../components/AuthLayout'
import AuthInput from '../components/AuthInput'
import AuthAlert from '../components/AuthAlert'
import Button from '../components/Button'
import '../styles/auth.css'

interface SignUpForm {
  firstName: string
  lastName:  string
  email:     string
  password:  string
}

interface FieldErrors {
  firstName?: string
  lastName?:  string
  email?:     string
  password?:  string
}

function validate(form: SignUpForm): FieldErrors {
  const errs: FieldErrors = {}
  if (!form.firstName.trim()) errs.firstName = 'First name is required.'
  if (!form.lastName.trim())  errs.lastName  = 'Last name is required.'
  if (!form.email)            errs.email     = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              errs.email     = 'Enter a valid email address.'
  if (!form.password)         errs.password  = 'Password is required.'
  else if (form.password.length < 8)
                              errs.password  = 'Password must be at least 8 characters.'
  return errs
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form,        setForm]        = useState<SignUpForm>({ firstName: '', lastName: '', email: '', password: '' })
  const [errors,      setErrors]      = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading,     setLoading]     = useState(false)

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
      await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            given_name: form.firstName,
            family_name: form.lastName,
          }
        }
      })
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      headline={<>Start building <em>something great</em></>}
      subtext="Join businesses that trust Stellari to streamline operations and drive growth."
    >
      <h2 className="auth-form-title">Create your account</h2>
      <p className="auth-form-subtitle">Get started — it only takes a minute</p>

      {serverError && <AuthAlert variant="error">{serverError}</AuthAlert>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-name-row">
          <AuthInput
            id="firstName" name="firstName" type="text"
            label="First name" icon={<User size={15} />}
            placeholder="Jane" autoComplete="given-name"
            value={form.firstName} onChange={handleChange}
            error={errors.firstName}
          />
          <AuthInput
            id="lastName" name="lastName" type="text"
            label="Last name" icon={<User size={15} />}
            placeholder="Smith" autoComplete="family-name"
            value={form.lastName} onChange={handleChange}
            error={errors.lastName}
          />
        </div>
        <AuthInput
          id="email" name="email" type="email"
          label="Work email" icon={<Mail size={15} />}
          placeholder="you@company.com" autoComplete="email"
          value={form.email} onChange={handleChange}
          error={errors.email}
        />
        <AuthInput
          id="password" name="password"
          label="Password" icon={<Lock size={15} />}
          placeholder="Min. 8 characters" autoComplete="new-password"
          value={form.password} onChange={handleChange}
          error={errors.password}
          passwordToggle
        />
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading
            ? <><span className="auth-btn-spinner" /> Creating account…</>
            : 'Create account'}
        </Button>
        <p className="auth-terms">
          By creating an account you agree to our{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>

      <p className="auth-footer-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}