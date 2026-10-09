import { Link } from 'react-router-dom'
import { ChevronRight, PackageSearch } from 'lucide-react'
import { useMyOrders } from '@/features/orders/hooks'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate, formatCurrency, getOrderNumber } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function OrdersPage() {
  useDocumentTitle('Mis pedidos')
  const { data: orders, isLoading } = useMyOrders()

  if (isLoading) return <PageLoader label="Cargando tus pedidos..." />

  if (!orders || orders.length === 0) {
    return (
      <div className="container-ml py-8">
        <EmptyState
          icon={<PackageSearch className="h-7 w-7" />}
          title="Todavía no hiciste ningún pedido"
          description="Cuando compres, vas a poder seguir acá el estado de tus envíos."
          action={
            <Link to="/buscar" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
              Empezar a comprar
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-ml max-w-4xl py-5">
      <h1 className="mb-4 text-lg font-semibold">Mis pedidos</h1>

      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order._id}>
            <Link
              to={`/mis-pedidos/${order._id}`}
              className="card flex flex-wrap items-center gap-4 p-4 transition-shadow hover:shadow-hover"
            >
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-ml-muted"
                  >
                    {item.quantity}×
                  </span>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  Pedido {getOrderNumber(order._id)} · {formatDate(order.createdAt)}
                </p>
                <p className="truncate text-sm text-ml-muted">
                  {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'} —{' '}
                  {order.items.map((item) => item.name).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="font-semibold">{formatCurrency(order.total)}</span>
                <ChevronRight className="h-4 w-4 text-ml-muted" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OrdersPage
