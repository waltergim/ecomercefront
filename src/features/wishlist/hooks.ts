import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeFavorite, toggleFavorite } from '@/store/wishlistSlice'
import type { Product } from '@/types'

export function useWishlist() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.wishlist.items)

  const ids = useMemo(() => new Set(items.map((item) => item._id)), [items])

  const isFavorite = useCallback((id: string) => ids.has(id), [ids])
  const toggle = useCallback((product: Product) => dispatch(toggleFavorite(product)), [dispatch])
  const remove = useCallback((id: string) => dispatch(removeFavorite(id)), [dispatch])

  return { items, isFavorite, toggle, remove, count: items.length }
}
