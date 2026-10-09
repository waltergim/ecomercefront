import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'

export const WISHLIST_STORAGE_KEY = 'ecomer:wishlist:v1'

const readStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Product[]) : []
  } catch {
    return []
  }
}

interface WishlistState {
  items: Product[]
}

const initialState: WishlistState = {
  items: typeof window === 'undefined' ? [] : readStorage(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex((item) => item._id === action.payload._id)
      if (index === -1) state.items.unshift(action.payload)
      else state.items.splice(index, 1)
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
    },
  },
})

export const { toggleFavorite, removeFavorite, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
