export type Role = 'customer' | 'admin'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PublicUser {
  id: string
  name: string
  email: string
  role: Role
  addresses: Address[]
  createdAt?: string
}

export interface Address {
  _id?: string
  street: string
  city: string
  province: string
  zipCode: string
  phone?: string
}

export interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  _id: string
  user: string | { _id: string; name?: string; email?: string }
  items: OrderItem[]
  shippingAddress: Address
  shippingCost: number
  total: number
  status: OrderStatus
  payment?: {
    provider?: string
    paymentId?: string
    status?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: string
  slug: string
  name: string
  price: number
  image: string | null
  stock: number
  quantity: number
}

export interface ProductListParams {
  page?: number
  limit?: number
  q?: string
  category?: string
}
