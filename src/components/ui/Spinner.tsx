import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-ml-blue', className)} />
}

export function PageLoader({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 text-ml-muted">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-md', className)} />
}

export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden p-4">
      <Skeleton className="mb-4 aspect-square w-full rounded-sm" />
      <Skeleton className="mb-2 h-3 w-3/4" />
      <Skeleton className="mb-3 h-3 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  )
}
