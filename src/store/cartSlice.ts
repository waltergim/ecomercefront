import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, Product } from '@/types'

export const CART_STORAGE_KEY = 'ecomer:cart:v1'

const readStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: typeof window === 'undefined' ? [] : readStorage(),
}

const toCartItem = (product: Product, quantity: number): CartItem => ({
  product: product._id,
  slug: product.slug,
  name: product.name,
  price: product.price,
  image: product.images?.[0] ?? null,
  stock: product.stock,
  quantity,
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.product === product._id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock)
      } else {
        state.items.push(toCartItem(product, Math.min(quantity, product.stock)))
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.product !== action.payload)
    },
    updateQuantity(
      state,
      action: PayloadAction<{ product: string; quantity: number }>
    ) {
      const item = state.items.find((entry) => entry.product === action.payload.product)
      if (!item) return
      const next = action.payload.quantity
      if (next <= 0) {
        state.items = state.items.filter((entry) => entry.product !== action.payload.product)
        return
      }
      item.quantity = Math.min(next, item.stock)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
