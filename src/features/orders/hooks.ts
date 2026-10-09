import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { ordersApi, type CreateOrderInput } from './api'
import type { OrderStatus } from '@/types'

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: ordersApi.mine,
  })
}

export function useOrder(id?: string) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => ordersApi.byId(id as string),
    enabled: Boolean(id),
  })
}

export function useAdminOrders(params: {
  page?: number
  limit?: number
  status?: string
} = {}) {
  return useQuery({
    queryKey: ['orders', 'admin', params],
    queryFn: () => ordersApi.adminList(params),
    placeholderData: keepPreviousData,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrderInput) => ordersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('¡Pedido confirmado!')
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { id: string; status: OrderStatus }) => ordersApi.updateStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Estado actualizado')
    },
  })
}
