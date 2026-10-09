import { ProductCard } from './ProductCard'
import { ProductSkeleton } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  skeletons?: number
  emptyMessage?: string
  className?: string
}

export function ProductGrid({
  products,
  loading = false,
  skeletons = 8,
  emptyMessage = 'No encontramos productos',
  className,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
        {Array.from({ length: skeletons }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="card px-6 py-14 text-center text-ml-muted">{emptyMessage}</div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
