import type { OrderStatus } from '@/types'

export interface Category {
  value: string
  label: string
  icon: string
  color: string
}

export const CATEGORIES: Category[] = [
  { value: 'electronica', label: 'Electrónica', icon: '🎧', color: 'bg-blue-100' },
  { value: 'ropa', label: 'Ropa y moda', icon: '👕', color: 'bg-pink-100' },
  { value: 'hogar', label: 'Hogar y muebles', icon: '🛋️', color: 'bg-amber-100' },
  { value: 'deportes', label: 'Deportes', icon: '⚽', color: 'bg-green-100' },
  { value: 'tecnologia', label: 'Tecnología', icon: '💻', color: 'bg-indigo-100' },
  { value: 'supermercado', label: 'Supermercado', icon: '🛒', color: 'bg-lime-100' },
  { value: 'bebidas', label: 'Bebidas', icon: '🍷', color: 'bg-purple-100' },
  { value: 'jugueteria', label: 'Juguetería', icon: '🧸', color: 'bg-orange-100' },
]

export const categoryLabel = (value: string): string => {
  const found = CATEGORIES.find((c) => c.value === value)
  if (found) return found.label
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const categoryIcon = (value: string): string =>
  CATEGORIES.find((c) => c.value === value)?.icon ?? '🏷️'

export const FREE_SHIPPING_MIN = Number(import.meta.env.VITE_FREE_SHIPPING_MIN ?? 50000)

export const SHIPPING_COST = Number(import.meta.env.VITE_SHIPPING_COST ?? 0)

export const FREE_SHIPPING_LABEL = `Envío gratis desde $ ${FREE_SHIPPING_MIN.toLocaleString(
  'es-AR'
)}`

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_STEPS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered']

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-ml-blueDark',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-ml-green',
  cancelled: 'bg-red-100 text-ml-red',
}
