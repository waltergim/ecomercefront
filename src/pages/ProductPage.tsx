import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Heart, Package, ShieldCheck, Truck, Store } from 'lucide-react'
import { useProduct, useProducts } from '@/features/products/hooks'
import { useCart } from '@/features/cart/hooks'
import { useWishlist } from '@/features/wishlist/hooks'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { categoryLabel, FREE_SHIPPING_MIN } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toast } from 'sonner'

export function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isError } = useProduct(slug)
  const { add } = useCart()
  const { isFavorite, toggle } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const related = useProducts(
    { category: product?.category ?? '', limit: 8 },
    { enabled: Boolean(product?.category) }
  )

  useDocumentTitle(product?.name ?? 'Producto')

  if (isLoading) return <PageLoader label="Cargando producto..." />

  if (isError || !product) {
    return (
      <div className="container-ml py-10">
        <EmptyState
          icon={<Package className="h-7 w-7" />}
          title="Producto no encontrado"
          description="Puede que se haya eliminado o el enlace no sea válido."
          action={
            <Link to="/buscar" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
              Ir a buscar productos
            </Link>
          }
        />
      </div>
    )
  }

  const freeShipping = product.price >= FREE_SHIPPING_MIN
  const favorite = isFavorite(product._id)
  const outOfStock = product.stock === 0

  const handleAdd = (goToCart = false) => {
    add(product, quantity)
    toast.success('Agregado al carrito', {
      description: `${product.name} × ${quantity}`,
      action: { label: 'Ver carrito', onClick: () => navigate('/carrito') },
    })
    if (goToCart) navigate('/carrito')
  }

  const handleBuyNow = () => {
    add(product, quantity)
    navigate('/checkout')
  }

  return (
    <div className="container-ml py-5">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ml-muted">
        <Link to="/" className="hover:text-ml-blue">
          Inicio
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/buscar?categoria=${encodeURIComponent(product.category)}`} className="hover:text-ml-blue">
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-ml-text">{product.name}</span>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="card p-4 sm:p-6">
          <ProductGallery images={product.images ?? []} name={product.name} />
        </section>

        <aside className="card h-fit p-5 lg:sticky lg:top-40">
          <div className="mb-1 flex items-center gap-2 text-xs text-ml-muted">
            <Store className="h-3.5 w-3.5" /> Tienda oficial ecomer
          </div>

          <h1 className="mb-3 text-lg font-normal leading-snug text-ml-text sm:text-xl">
            {product.name}
          </h1>

          <Price value={product.price} size="xl" installments />

          <div className="mt-4 space-y-2 text-sm">
            {freeShipping ? (
              <p className="flex items-center gap-2 font-medium text-ml-green">
                <Truck className="h-4 w-4" /> Llega gratis mañana
              </p>
            ) : (
              <p className="flex items-center gap-2 text-ml-muted">
                <Truck className="h-4 w-4" /> Envío calculado al finalizar
              </p>
            )}

            <p className="flex items-center gap-2 text-ml-muted">
              <ShieldCheck className="h-4 w-4" /> Compra protegida
            </p>

            <p className={outOfStock ? 'font-medium text-ml-red' : 'text-ml-muted'}>
              {outOfStock
                ? 'Sin stock disponible'
                : product.stock <= 5
                  ? `¡Quedan ${product.stock} unidades!`
                  : `${product.stock} disponibles`}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm text-ml-muted">Cantidad</span>
            <QuantityStepper
              value={quantity}
              max={Math.max(product.stock, 1)}
              onChange={setQuantity}
              size="sm"
            />
          </div>

          <div className="mt-5 space-y-2.5">
            <Button fullWidth size="lg" onClick={handleBuyNow} disabled={outOfStock}>
              Comprar ahora
            </Button>
            <Button
              fullWidth
              size="lg"
              variant="outline"
              onClick={() => handleAdd(false)}
              disabled={outOfStock}
            >
              Agregar al carrito
            </Button>
            <button
              type="button"
              onClick={() => toggle(product)}
              className={`mx-auto flex items-center gap-2 text-sm transition-colors ${
                favorite ? 'text-ml-red' : 'text-ml-muted hover:text-ml-red'
              }`}
            >
              <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
              {favorite ? 'Guardado en favoritos' : 'Agregar a favoritos'}
            </button>
          </div>

          <div className="mt-5 space-y-2 border-t border-ml-line pt-4 text-xs text-ml-muted">
            <p>
              <span className="font-medium text-ml-text">Devolución gratis.</span> Tenés 30 días
              desde que recibís el producto.
            </p>
            <p>
              <span className="font-medium text-ml-text">Garantía:</span> 12 meses de garantía de
              fábrica.
            </p>
          </div>
        </aside>
      </div>

      <section className="card mt-4 p-5 sm:p-6">
        <h2 className="mb-3 text-lg font-semibold">Descripción</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-ml-muted">
          {product.description?.trim() || 'Sin descripción disponible.'}
        </p>
        <div className="mt-5 grid gap-3 border-t border-ml-line pt-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-ml-muted">Categoría</p>
            <Link
              to={`/buscar?categoria=${encodeURIComponent(product.category)}`}
              className="link-blue"
            >
              {categoryLabel(product.category)}
            </Link>
          </div>
          <div>
            <p className="text-ml-muted">Publicado</p>
            <p>{new Date(product.createdAt).toLocaleDateString('es-AR')}</p>
          </div>
          <div>
            <p className="text-ml-muted">Enviado por</p>
            <p>ecomer</p>
          </div>
        </div>
      </section>

      {(related.data?.items?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">También te puede interesar</h2>
          <ProductGrid
            products={(related.data?.items ?? []).filter((item) => item._id !== product._id).slice(0, 4)}
            loading={related.isLoading}
            skeletons={4}
          />
        </section>
      )}

      <div className="mt-6 flex items-center justify-between rounded-md bg-ml-yellow px-5 py-4">
        <p className="text-sm font-medium text-black">
          ¿Querés vender uno igual? Publicá tu producto en minutos.
        </p>
        <span className="hidden text-sm text-black/60 sm:block">
          Total: {formatCurrency(product.price)} estimado
        </span>
      </div>
    </div>
  )
}

export default ProductPage
