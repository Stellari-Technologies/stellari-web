import { useState, forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import '../styles/auth.css'


// AuthInput is a reusable form field component used across all auth pages.
// It bundles together everything a single input needs: a label, a left-side icon,
// the input box itself, an optional show/hide toggle for passwords, and an
// optional error message underneath.
//
// Instead of writing all this HTML every time you need a field, you just do:
// <AuthInput label="Email" icon={<Mail size={15} />} ... />

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  /** Lucide icon (or any ReactNode) rendered on the left side of the input. */
  icon: ReactNode
  /** Field-level validation error message. */
  error?: string
  /** Right-side slot — e.g. a "Forgot password?" link. */
  labelAction?: ReactNode
  /** If true, renders a show/hide toggle for password fields. */
  passwordToggle?: boolean
}

// ─── forwardRef ───────────────────────────────────────────────────────────────
// Normally a parent component can't directly access a child's DOM element.
// forwardRef lets the parent pass a 'ref' down into this component so it can
// access the actual <input> element if needed (e.g. to call .focus() on it).
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(({
  label,
  icon,
  error,
  labelAction,
  passwordToggle = false,
  id,
  type,
  className,
  ...rest
  // '...rest' collects all remaining standard HTML input props
            // (placeholder, value, onChange, autoComplete, etc.)
            // and passes them straight through to the <input> below
}, ref) => {

  // 'visible' tracks whether the password text is showing or hidden.
  // useState(false) means it starts hidden.
  // setVisible is the function we call to change it.
  const [visible, setVisible] = useState(false)
  const inputType = passwordToggle ? (visible ? 'text' : 'password') : type

  return (
      // Outer wrapper — stacks label, input, and error vertically with a 6px gap
    <div className="auth-field" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Label row */}
      <div className={labelAction ? 'auth-field-row' : undefined}>
        <label className="ui-label" htmlFor={id}>{label}</label>
        {labelAction}
      </div>

      {/* Input */}
      <div className="auth-input-wrap">
        <span className="auth-input-icon">{icon}</span>

        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`ui-input${error ? ' field-error' : ''}${passwordToggle ? ' has-toggle' : ''}${className ? ` ${className}` : ''}`}
          {...rest}
        />

        {passwordToggle && (
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setVisible(v => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && <span className="auth-field-error">{error}</span>}
    </div>
  )
})

AuthInput.displayName = 'AuthInput'
export default AuthInput