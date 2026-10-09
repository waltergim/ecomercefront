import { Link } from 'react-router-dom'
import { Heart, Truck } from 'lucide-react'
import { useWishlist } from '@/features/wishlist/hooks'
import { Price } from '@/components/ui/Price'
import { ProductImage } from '@/components/ui/ProductImage'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { isFavorite, toggle } = useWishlist()
  const favorite = isFavorite(product._id)
  const freeShipping = product.price >= 50000

  return (
    <article
      className={cn(
        'group card relative flex h-full flex-col p-4 transition-shadow hover:shadow-hover',
        className
      )}
    >
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          toggle(product)
        }}
        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={favorite}
        className={cn(
          'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card transition-all hover:scale-110',
          favorite ? 'text-ml-red' : 'text-slate-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        )}
      >
        <Heart className={cn('h-5 w-5', favorite && 'fill-current')} />
      </button>

      <Link to={`/producto/${product.slug}`} className="flex flex-1 flex-col">
        <div className="mb-4 aspect-square w-full overflow-hidden rounded-sm bg-slate-50">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          {freeShipping && (
            <span className="flex items-center gap-1 text-xs font-medium text-ml-green">
              <Truck className="h-3.5 w-3.5" /> Envío gratis
            </span>
          )}
          <h3 className="line-clamp-2 text-sm text-ml-muted transition-colors group-hover:text-ml-text">
            {product.name}
          </h3>
          <Price value={product.price} size="md" className="mt-1" />
          {product.stock === 0 && (
            <span className="text-xs font-medium text-ml-red">Sin stock</span>
          )}
        </div>
      </Link>
    </article>
  )
}
