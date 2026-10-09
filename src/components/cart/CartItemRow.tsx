import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Price } from '@/components/ui/Price'
import type { CartItem } from '@/types'

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 border-b border-ml-line py-5 last:border-b-0">
      <Link
        to={`/producto/${item.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-slate-50 sm:h-28 sm:w-28"
      >
        <ProductImage src={item.image} alt={item.name} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/producto/${item.slug}`}
            className="line-clamp-2 text-sm text-ml-text hover:text-ml-blue sm:text-base"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item.product)}
            className="shrink-0 rounded-md p-1.5 text-ml-muted transition-colors hover:bg-red-50 hover:text-ml-red"
            aria-label={`Quitar ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.stock <= 5 && item.stock > 0 && (
          <span className="text-xs font-medium text-ml-red">
            ¡Últimas {item.stock} unidades!
          </span>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            max={item.stock}
            size="sm"
            onChange={(value) => onQuantityChange(item.product, value)}
            onRemove={() => onRemove(item.product)}
          />
          <Price value={item.price * item.quantity} size="sm" />
        </div>
      </div>
    </div>
  )
}
