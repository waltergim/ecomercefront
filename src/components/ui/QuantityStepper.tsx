import { Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  onRemove?: () => void
  size?: 'sm' | 'md'
  className?: string
}

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  onRemove,
  size = 'md',
  className,
}: QuantityStepperProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  const buttonClass = cn(
    'flex items-center justify-center text-ml-blue transition-colors disabled:cursor-not-allowed disabled:text-slate-300',
    size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
    'hover:bg-ml-blueLight rounded-md'
  )

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-ml-line bg-white',
        className
      )}
    >
      <button
        type="button"
        onClick={() => (canDecrement ? onChange(value - 1) : onRemove?.())}
        disabled={!canDecrement && !onRemove}
        className={cn(buttonClass, !canDecrement && !onRemove && 'opacity-40')}
        aria-label={canDecrement ? 'Restar uno' : 'Quitar del carrito'}
      >
        {canDecrement ? <Minus className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
      </button>

      <span
        className={cn(
          'min-w-8 text-center font-medium text-ml-text',
          size === 'sm' ? 'text-sm' : 'text-base'
        )}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        className={cn(buttonClass, !canIncrement && 'opacity-40')}
        aria-label="Sumar uno"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
