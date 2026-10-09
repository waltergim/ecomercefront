import { formatCurrency, getInstallments, cn } from '@/lib/utils'

interface PriceProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  installments?: boolean
  className?: string
}

const sizes = {
  sm: { currency: 'text-xs', amount: 'text-lg' },
  md: { currency: 'text-sm', amount: 'text-2xl' },
  lg: { currency: 'text-sm', amount: 'text-3xl' },
  xl: { currency: 'text-base', amount: 'text-4xl' },
}

export function Price({ value, size = 'md', installments = false, className }: PriceProps) {
  const style = sizes[size]
  const text = formatCurrency(value)
  const [, ...rest] = text.split(' ')

  return (
    <div className={cn('leading-none text-ml-text', className)}>
      <p className="flex items-start gap-1">
        <span className={cn('mt-1 font-normal text-ml-muted', style.currency)}>
          {rest.length ? rest[0] : ''}
        </span>
        <span className={cn('font-light tracking-tight', style.amount)}>
          {rest.length ? rest.slice(1).join(' ') : text}
        </span>
      </p>
      {installments && (
        <p className="mt-1.5 text-xs text-ml-green">
          {getInstallments(value).label} con 0% de interés
        </p>
      )}
    </div>
  )
}

export function PriceInline({ value, className }: { value: number; className?: string }) {
  return <span className={cn('font-medium', className)}>{formatCurrency(value)}</span>
}
