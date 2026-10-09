import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Home, Package, Truck } from 'lucide-react'
import { useOrder } from '@/features/orders/hooks'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
} from '@/lib/constants'
import { formatDate, formatCurrency, getOrderNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { OrderStatus } from '@/types'

const stepIcon: Record<string, typeof Package> = {
  pending: Package,
  paid: Check,
  shipped: Truck,
  delivered: Home,
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUS_STEPS.indexOf(status)
  const cancelled = status === 'cancelled'

  return (
    <div className="flex items-center">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const Icon = stepIcon[step] ?? Package
        const done = !cancelled && index <= currentIndex

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors',
                  done
                    ? 'border-ml-blue bg-ml-blue text-white'
                    : 'border-ml-line bg-white text-slate-300'
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  'w-20 text-center text-[11px] leading-tight',
                  done ? 'font-medium text-ml-text' : 'text-ml-muted'
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {index < ORDER_STATUS_STEPS.length - 1 && (
              <span
                className={cn(
                  'mx-1 mb-6 h-0.5 flex-1 rounded-full',
                  !cancelled && index < currentIndex ? 'bg-ml-blue' : 'bg-ml-line'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(id)

  useDocumentTitle(order ? `Pedido ${getOrderNumber(order._id)}` : 'Pedido')

  if (isLoading) return <PageLoader label="Cargando pedido..." />

  if (isError || !order) {
    return (
      <div className="container-ml py-8">
        <EmptyState
          icon={<Package className="h-7 w-7" />}
          title="No encontramos el pedido"
          description="Puede que no exista o no tengas permisos para verlo."
          action={
            <Link to="/mis-pedidos" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
              Volver a mis pedidos
            </Link>
          }
        />
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container-ml max-w-4xl py-5">
      <Link to="/mis-pedidos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ml-muted hover:text-ml-blue">
        <ArrowLeft className="h-4 w-4" /> Mis pedidos
      </Link>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Pedido {getOrderNumber(order._id)}</h1>
          <p className="text-sm text-ml-muted">Realizado el {formatDate(order.createdAt, true)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <section className="card mb-4 p-5">
        <StatusTimeline status={order.status} />
        {order.status === 'cancelled' && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-ml-red">
            Este pedido fue cancelado.
          </p>
        )}
        {order.status === 'pending' && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Estamos esperando la confirmación del pago.
          </p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
        <section className="card p-5">
          <h2 className="mb-3 text-base font-semibold">Productos</h2>
          <ul className="divide-y divide-ml-line">
            {order.items.map((item, index) => (
              <li key={index} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-ml-muted">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-1.5 border-t border-ml-line pt-4 text-sm">
            <div className="flex justify-between text-ml-muted">
              <span>Productos</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ml-muted">
              <span>Envío</span>
              <span className={order.shippingCost === 0 ? 'text-ml-green' : ''}>
                {order.shippingCost === 0 ? 'Gratis' : formatCurrency(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="card p-5">
            <h2 className="mb-2 text-sm font-semibold">Dirección de envío</h2>
            <p className="text-sm text-ml-muted">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.province}
              <br />
              CP {order.shippingAddress.zipCode}
              {order.shippingAddress.phone && (
                <>
                  <br />
                  Tel: {order.shippingAddress.phone}
                </>
              )}
            </p>
          </section>

          <section className="card p-5">
            <h2 className="mb-2 text-sm font-semibold">Pago</h2>
            <p className="text-sm text-ml-muted capitalize">
              {order.payment?.provider ?? 'mercadopago'}
            </p>
            <p className="mt-1 text-xs text-ml-muted">
              Estado: {ORDER_STATUS_LABELS[order.status]}
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetailPage
