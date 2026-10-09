import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FREE_SHIPPING_MIN, SHIPPING_COST } from './constants'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-AR')

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatNumber = (value: number) => numberFormatter.format(value)

export const getInstallments = (price: number, count = 12) => ({
  count,
  amount: Math.round(price / count),
  label: `${count} cuotas de ${currencyFormatter.format(Math.round(price / count))}`,
})

export const getShippingCost = (subtotal: number) =>
  subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST

export const isFreeShipping = (subtotal: number) => getShippingCost(subtotal) === 0

export const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value

export const buildImageUrl = (src?: string | null): string | null => {
  if (!src) return null
  const value = src.trim()
  if (!value) return null
  if (/^(https?:|data:|blob:)/.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`
  return value.startsWith('/') ? value : `/${value}`
}

export const formatDate = (value: string | Date, withTime = false) => {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

export const getOrderNumber = (id: string) => `#${id.slice(-8).toUpperCase()}`
