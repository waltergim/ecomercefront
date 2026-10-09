import { api } from '@/api/client'
import type { Address, Order, OrderStatus, Paginated } from '@/types'

export interface CreateOrderInput {
  items: { product: string; quantity: number }[]
  shippingAddress: Address
}

export const ordersApi = {
  create: async (payload: CreateOrderInput) => {
    const { data } = await api.post<{ order: Order }>('/orders', payload)
    return data.order
  },
  mine: async () => {
    const { data } = await api.get<{ items: Order[]; total: number }>('/orders/mine')
    return data.items
  },
  byId: async (id: string) => {
    const { data } = await api.get<{ order: Order }>(`/orders/${id}`)
    return data.order
  },
  adminList: async (params: { page?: number; limit?: number; status?: string } = {}) => {
    const { data } = await api.get<Paginated<Order>>('/orders', { params })
    return data
  },
  updateStatus: async ({ id, status }: { id: string; status: OrderStatus }) => {
    const { data } = await api.patch<{ order: Order }>(`/orders/${id}/status`, { status })
    return data.order
  },
}
