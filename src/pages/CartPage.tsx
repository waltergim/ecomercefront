import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/features/cart/hooks'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { EmptyState } from '@/components/ui/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function CartPage() {
  useDocumentTitle('Carrito')
  const { items, subtotal, shipping, total, count, setQuantity, remove } = useCart()

  if (items.length === 0) {
    return (
      <div className="container-ml py-8">
        <EmptyState
          icon={<ShoppingCart className="h-7 w-7" />}
          title="Tu carrito está vacío"
          description="Explorá el catálogo y agregá lo que te guste. Guardamos tu carrito para la próxima vez."
          action={
            <Link to="/buscar" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
              Ir a comprar
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-ml py-5">
      <h1 className="mb-4 text-lg font-semibold">Carrito de compras</h1>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card p-4 sm:p-5">
          <p className="mb-1 text-sm text-ml-muted">
            {count} {count === 1 ? 'producto' : 'productos'}
          </p>
          {items.map((item) => (
            <CartItemRow
              key={item.product}
              item={item}
              onQuantityChange={setQuantity}
              onRemove={remove}
            />
          ))}
        </section>

        <aside className="h-fit lg:sticky lg:top-40">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            count={count}
            actionLabel="Continuar compra"
            actionTo="/checkout"
          />
          <div className="card mt-3 p-4 text-xs text-ml-muted">
            <p className="mb-1 font-medium text-ml-text">Compra protegida</p>
            <p>
              Recibí el producto que esperabas o te devolvemos tu dinero. Siempre.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CartPage
