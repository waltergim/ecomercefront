import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { CART_STORAGE_KEY } from './cartSlice'
import wishlistReducer, { WISHLIST_STORAGE_KEY } from './wishlistSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
})

const persist = () => {
  try {
    const state = store.getState()
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items))
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.wishlist.items))
  } catch {
    // storage no disponible (modo privado, etc.)
  }
}

store.subscribe(persist)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
