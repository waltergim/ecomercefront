import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pages: number
  onChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pages, onChange, className }: PaginationProps) {
  if (pages <= 1) return null

  const numbers: number[] = []
  const from = Math.max(1, page - 2)
  const to = Math.min(pages, page + 2)
  for (let i = from; i <= to; i += 1) numbers.push(i)

  return (
    <nav
      className={cn('flex items-center justify-center gap-1.5 pt-2', className)}
      aria-label="Paginación"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md text-ml-muted hover:bg-white disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {from > 1 && <span className="px-1 text-sm text-ml-muted">…</span>}

      {numbers.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'h-9 min-w-9 rounded-md px-2 text-sm transition-colors',
            value === page
              ? 'bg-ml-blue font-semibold text-white'
              : 'text-ml-muted hover:bg-white'
          )}
        >
          {value}
        </button>
      ))}

      {to < pages && <span className="px-1 text-sm text-ml-muted">…</span>}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="flex h-9 w-9 items-center justify-center rounded-md text-ml-muted hover:bg-white disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
