import { Link } from 'react-router-dom'
import { Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FREE_SHIPPING_MIN, SHIPPING_COST } from '@/lib/constants'
import { formatCurrency, getShippingCost, cn } from '@/lib/utils'

interface OrderSummaryProps {
  subtotal: number
  shipping?: number
  total?: number
  count?: number
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
  actionLoading?: boolean
  actionDisabled?: boolean
  showCheckoutButton?: boolean
}

export function OrderSummary({
  subtotal,
  shipping,
  total,
  count,
  actionLabel = 'Continuar compra',
  actionTo = '/checkout',
  onAction,
  actionLoading = false,
  actionDisabled = false,
  showCheckoutButton = true,
}: OrderSummaryProps) {
  const shippingCost = shipping ?? getShippingCost(subtotal)
  const finalTotal = total ?? subtotal + shippingCost
  const freeShipping = shippingCost === 0 && subtotal > 0

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-base font-semibold">Resumen de compra</h2>

      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between text-ml-muted">
          <dt>
            Productos{typeof count === 'number' ? ` (${count})` : ''}
          </dt>
          <dd className="text-ml-text">{formatCurrency(subtotal)}</dd>
        </div>

        <div className="flex justify-between text-ml-muted">
          <dt className="flex items-center gap-1.5">
            <Truck className="h-4 w-4" /> Envío
          </dt>
          <dd className={freeShipping ? 'font-medium text-ml-green' : 'text-ml-text'}>
            {freeShipping ? 'Gratis' : formatCurrency(shippingCost)}
          </dd>
        </div>
      </dl>

      {freeShipping && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-xs text-ml-green">
          ¡Tu pedido tiene envío gratis!
        </p>
      )}

      {!freeShipping && SHIPPING_COST === 0 && subtotal < FREE_SHIPPING_MIN && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-xs text-ml-green">
          Agregá {formatCurrency(FREE_SHIPPING_MIN - subtotal)} más y tenés envío gratis.
        </p>
      )}

      <div className="mt-4 flex items-end justify-between border-t border-ml-line pt-4">
        <span className="text-sm text-ml-muted">Total</span>
        <span className="text-2xl font-semibold">{formatCurrency(finalTotal)}</span>
      </div>

      {showCheckoutButton &&
        (onAction ? (
          <Button
            fullWidth
            size="lg"
            className="mt-4"
            onClick={onAction}
            loading={actionLoading}
            disabled={actionDisabled}
          >
            {actionLabel}
          </Button>
        ) : (
          <Link
            to={actionTo}
            className={cn('btn-base mt-4 h-12 w-full bg-ml-blue px-6 text-base text-white hover:bg-ml-blueDark', actionDisabled && 'pointer-events-none opacity-60')}
          >
            {actionLabel}
          </Link>
        ))}

      <p className="mt-3 text-center text-xs text-ml-muted">
        Podés pagar con tarjeta, débito o transferencia
      </p>
    </div>
  )
}
