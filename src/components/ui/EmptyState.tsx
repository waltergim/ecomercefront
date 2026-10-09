import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'card flex flex-col items-center justify-center gap-3 px-6 py-14 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ml-blueLight text-ml-blue">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-ml-text">{title}</h2>
      {description && <p className="max-w-sm text-sm text-ml-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
