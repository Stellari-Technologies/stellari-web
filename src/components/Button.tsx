import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'brand'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`ui-btn ui-btn-${variant} ui-btn-${size} ${fullWidth ? 'ui-btn-full' : ''} ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}