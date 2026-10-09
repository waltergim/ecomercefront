import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { useOrder } from '@/features/orders/hooks'
import { PageLoader } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency, getOrderNumber } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('pedido') ?? ''
  const { data: order, isLoading } = useOrder(orderId)

  useDocumentTitle('Pedido confirmado')

  if (isLoading && orderId) return <PageLoader label="Cargando tu pedido..." />

  return (
    <div className="container-ml py-8">
      <div className="mx-auto max-w-2xl animate-fadeUp">
        <div className="card p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-ml-green">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <h1 className="text-xl font-semibold sm:text-2xl">¡Gracias por tu compra!</h1>
          <p className="mt-2 text-sm text-ml-muted">
            Recibimos tu pedido correctamente. Te vamos a mantener informado del estado.
          </p>

          {order && (
            <>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="rounded-md bg-slate-100 px-3 py-1.5 font-medium">
                  Pedido {getOrderNumber(order._id)}
                </span>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-6 rounded-md border border-ml-line p-4 text-left">
                <div className="flex items-center justify-between border-b border-ml-line pb-3">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-ml-blue" /> Resumen
                  </span>
                  <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-ml-muted">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between gap-3">
                      <span className="truncate">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-ml-line pt-3 text-xs text-ml-muted">
                  Envío a: {order.shippingAddress.street}, {order.shippingAddress.city} (
                  {order.shippingAddress.province})
                </div>
              </div>
            </>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              to={orderId ? `/mis-pedidos/${orderId}` : '/mis-pedidos'}
              className="btn-base h-11 bg-ml-blue px-5 text-sm text-white hover:bg-ml-blueDark"
            >
              Ver mi pedido <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/buscar"
              className="btn-base h-11 border border-ml-line bg-white px-5 text-sm text-ml-text hover:bg-slate-50"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccessPage
