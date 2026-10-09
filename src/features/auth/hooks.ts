import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi, type AddressInput, type LoginInput, type RegisterInput } from './api'
import type { PublicUser } from '@/types'

export const AUTH_QUERY_KEY = ['auth', 'me'] as const

export function useAuth() {
  const query = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  return {
    user: (query.data ?? null) as PublicUser | null,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(query.data),
  }
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user)
      toast.success(`¡Hola, ${user.name}!`)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterInput) => authApi.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user)
      toast.success('Tu cuenta fue creada')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      queryClient.removeQueries({ queryKey: ['orders'] })
      toast.success('Sesión cerrada')
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string }) => authApi.updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user)
      toast.success('Perfil actualizado')
    },
  })
}

export function useAddresses() {
  return useQuery({
    queryKey: ['auth', 'addresses'],
    queryFn: authApi.getAddresses,
  })
}

export function useAddAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddressInput) => authApi.addAddress(payload),
    onSuccess: (addresses) => {
      queryClient.setQueryData(['auth', 'addresses'], addresses)
      toast.success('Dirección agregada')
    },
  })
}

export function useRemoveAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => authApi.removeAddress(id),
    onSuccess: (addresses) => {
      queryClient.setQueryData(['auth', 'addresses'], addresses)
      toast.success('Dirección eliminada')
    },
  })
}
