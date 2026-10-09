import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        ORDER_STATUS_BADGE[status],
        className
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
