import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { productsApi, type ProductInput } from './api'
import type { ProductListParams } from '@/types'

export const productsKey = (params: ProductListParams) => ['products', params] as const

export function useProducts(
  params: ProductListParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: productsKey(params),
    queryFn: () => productsApi.list(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })
}

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsApi.bySlug(slug as string),
    enabled: Boolean(slug),
  })
}

export function useProductById(id?: string) {
  return useQuery({
    queryKey: ['products', 'id', id],
    queryFn: () => productsApi.byId(id as string),
    enabled: Boolean(id),
  })
}

export function useAdminProducts(params: { page?: number; limit?: number; q?: string } = {}) {
  return useQuery({
    queryKey: ['products', 'admin', params],
    queryFn: () => productsApi.adminList(params),
    placeholderData: keepPreviousData,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductInput) => productsApi.create(payload),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(`"${product.name}" fue creado`)
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { id: string; payload: Partial<ProductInput> }) =>
      productsApi.update(input),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(`"${product.name}" fue actualizado`)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto eliminado')
    },
  })
}
