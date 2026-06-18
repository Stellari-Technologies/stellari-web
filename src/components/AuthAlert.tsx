import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import '../styles/auth.css'


// AuthAlert is a reusable banner component used to show feedback messages
// to the user — either an error (something went wrong) or a success (it worked).
// It's used in LoginPage, SignUpPage, and VerifyEmailPage.


// This defines what information the parent component must pass in when using
interface AuthAlertProps {

  // variant controls which style and icon to show.
  variant: 'error' | 'success'
  // children is whatever you put between the opening and closing tags.
  // e.g. <AuthAlert variant="error">Something went wrong</AuthAlert>
  children: ReactNode
}

export default function AuthAlert({ variant, children }: AuthAlertProps) {
  return (
    // The className combines the base 'auth-alert' style with either
    // 'error' or 'success' — these map to .auth-alert.error and
    // .auth-alert.success in auth.css, which set the background and text colour.
    <div className={`auth-alert ${variant}`}>
      {variant === 'error'
        ? <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        : <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
      {children}
    </div>
  )
}