import { api } from '@/api/client'
import type { Paginated, Product, ProductListParams } from '@/types'

export interface ProductInput {
  name: string
  slug?: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
}

export const productsApi = {
  list: async (params: ProductListParams = {}) => {
    const { data } = await api.get<Paginated<Product>>('/products', { params })
    return data
  },
  bySlug: async (slug: string) => {
    const { data } = await api.get<{ product: Product }>(`/products/slug/${slug}`)
    return data.product
  },
  byId: async (id: string) => {
    const { data } = await api.get<{ product: Product }>(`/products/${id}`)
    return data.product
  },
  adminList: async (params: { page?: number; limit?: number; q?: string } = {}) => {
    const { data } = await api.get<Paginated<Product>>('/products/admin', { params })
    return data
  },
  create: async (payload: ProductInput) => {
    const { data } = await api.post<{ product: Product }>('/products', payload)
    return data.product
  },
  update: async ({ id, payload }: { id: string; payload: Partial<ProductInput> }) => {
    const { data } = await api.put<{ product: Product }>(`/products/${id}`, payload)
    return data.product
  },
  remove: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`)
    return data.message
  },
}
