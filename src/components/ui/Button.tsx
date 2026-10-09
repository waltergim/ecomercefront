import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'yellow'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-ml-blue text-white hover:bg-ml-blueDark',
  secondary: 'bg-ml-yellow text-black hover:bg-ml-yellowDark',
  outline: 'border border-ml-blue/60 bg-white text-ml-blue hover:bg-ml-blueLight',
  ghost: 'bg-transparent text-ml-muted hover:bg-slate-100 hover:text-ml-text',
  danger: 'bg-white border border-ml-red/50 text-ml-red hover:bg-red-50',
  yellow: 'bg-ml-yellow text-black hover:bg-ml-yellowDark border border-black/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn-base',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
