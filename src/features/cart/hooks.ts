import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addItem, clearCart, removeItem, updateQuantity } from '@/store/cartSlice'
import { getShippingCost } from '@/lib/utils'
import type { Product } from '@/types'

export function useCart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )
  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )
  const shipping = useMemo(() => getShippingCost(subtotal), [subtotal])
  const total = subtotal + shipping

  const add = useCallback(
    (product: Product, quantity = 1) => dispatch(addItem({ product, quantity })),
    [dispatch]
  )
  const remove = useCallback((id: string) => dispatch(removeItem(id)), [dispatch])
  const setQuantity = useCallback(
    (id: string, quantity: number) => dispatch(updateQuantity({ product: id, quantity })),
    [dispatch]
  )
  const clear = useCallback(() => dispatch(clearCart()), [dispatch])

  return { items, subtotal, shipping, total, count, add, remove, setQuantity, clear }
}
