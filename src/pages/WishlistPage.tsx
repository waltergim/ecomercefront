import { Link } from 'react-router-dom'
import { HeartOff, Heart } from 'lucide-react'
import { useWishlist } from '@/features/wishlist/hooks'
import { ProductGrid } from '@/components/product/ProductGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function WishlistPage() {
  useDocumentTitle('Favoritos')
  const { items } = useWishlist()

  return (
    <div className="container-ml py-5">
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-ml-red" />
        <h1 className="text-lg font-semibold">Mis favoritos</h1>
        <span className="text-sm text-ml-muted">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<HeartOff className="h-7 w-7" />}
          title="No tenés favoritos todavía"
          description="Tocá el corazón en cualquier producto para guardarlo acá y encontrarlo rápido."
          action={
            <Link to="/buscar" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
              Explorar productos
            </Link>
          }
        />
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  )
}

export default WishlistPage
