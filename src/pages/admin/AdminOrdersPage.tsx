import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReceiptText, Search } from 'lucide-react'
import { useAdminOrders, useUpdateOrderStatus } from '@/features/orders/hooks'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import {
  ORDER_STATUS_LABELS,
} from '@/lib/constants'
import { formatDate, formatCurrency, getOrderNumber } from '@/lib/utils'
import { getErrorMessage } from '@/api/client'
import { toast } from 'sonner'
import type { Order, OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

function OrderRow({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus()
  const user =
    typeof order.user === 'object' && order.user
      ? `${order.user.name ?? ''} ${order.user.email ?? ''}`.trim()
      : 'Cliente'

  return (
    <tr className="align-middle">
      <td className="py-3 pr-3">
        <p className="font-medium">{getOrderNumber(order._id)}</p>
        <p className="text-xs text-ml-muted">{formatDate(order.createdAt, true)}</p>
      </td>
      <td className="py-3 pr-3 text-ml-muted">
        <p className="font-medium text-ml-text">{user}</p>
        <p className="text-xs">
          {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
        </p>
      </td>
      <td className="py-3 pr-3 font-medium">{formatCurrency(order.total)}</td>
      <td className="py-3 pr-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="py-3 pr-3">
        <Select
          aria-label={`Cambiar estado del pedido ${getOrderNumber(order._id)}`}
          value={order.status}
          disabled={updateStatus.isPending}
          onChange={(event) =>
            updateStatus.mutate(
              { id: order._id, status: event.target.value as OrderStatus },
              { onError: (error) => toast.error(getErrorMessage(error)) }
            )
          }
          className="h-10 py-1.5 text-sm"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </td>
      <td className="py-3 pr-3 text-right">
        <Link to={`/mis-pedidos/${order._id}`} className="link-blue text-sm">
          Ver
        </Link>
      </td>
    </tr>
  )
}

export function AdminOrdersPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useAdminOrders({
    page,
    limit: 10,
    status: status || undefined,
  })

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Pedidos</h2>
        <div className="w-full max-w-[200px]">
          <Select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Todos los estados</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {ORDER_STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Cargando pedidos..." />
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center text-ml-muted">
          <ReceiptText className="h-7 w-7" />
          <p className="text-sm">No hay pedidos con esos filtros.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ml-line text-xs uppercase tracking-wide text-ml-muted">
                  <th className="py-2.5 pr-3 font-medium">Pedido</th>
                  <th className="py-2.5 pr-3 font-medium">Cliente</th>
                  <th className="py-2.5 pr-3 font-medium">Total</th>
                  <th className="py-2.5 pr-3 font-medium">Estado</th>
                  <th className="py-2.5 pr-3 font-medium">Cambiar a</th>
                  <th className="py-2.5 pr-3 text-right font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ml-line">
                {data.items.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={data.page} pages={data.pages} onChange={setPage} className="mt-4" />
        </>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-ml-line pt-4 text-sm">
        <span className="text-ml-muted">
          <Search className="mr-1 inline h-4 w-4" />
          {data?.total ?? 0} pedidos en total
        </span>
        <Link to="/admin/productos" className="link-blue">
          Ir a productos →
        </Link>
      </div>
    </div>
  )
}

export default AdminOrdersPage
