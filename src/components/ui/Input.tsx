import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FieldWrapperProps {
  label?: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

function FieldWrapper({ label, error, hint, className, children }: FieldWrapperProps) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ml-muted">{label}</span>
      )}
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-ml-red">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-ml-muted">{hint}</span>
      )}
    </label>
  )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, wrapperClassName, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} className={wrapperClassName}>
      <input ref={ref} className={cn('input-base', className)} {...props} />
    </FieldWrapper>
  )
)
Input.displayName = 'Input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, wrapperClassName, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} className={wrapperClassName}>
      <textarea ref={ref} className={cn('input-base min-h-[110px] resize-y', className)} {...props} />
    </FieldWrapper>
  )
)
Textarea.displayName = 'Textarea'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, wrapperClassName, className, children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} className={wrapperClassName}>
      <select ref={ref} className={cn('input-base appearance-none pr-8', className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  )
)
Select.displayName = 'Select'
