import { api } from '@/api/client'
import type { Address, PublicUser } from '@/types'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface AddressInput {
  street: string
  city: string
  province: string
  zipCode: string
  phone?: string
}

export const authApi = {
  me: async () => {
    const { data } = await api.get<{ user: PublicUser }>('/auth/me')
    return data.user
  },
  login: async (payload: LoginInput) => {
    const { data } = await api.post<{ user: PublicUser }>('/auth/login', payload)
    return data.user
  },
  register: async (payload: RegisterInput) => {
    const { data } = await api.post<{ user: PublicUser }>('/auth/register', payload)
    return data.user
  },
  logout: async () => {
    const { data } = await api.post<{ message: string }>('/auth/logout')
    return data.message
  },
  updateProfile: async (payload: { name: string }) => {
    const { data } = await api.put<{ user: PublicUser }>('/users/me', payload)
    return data.user
  },
  getAddresses: async () => {
    const { data } = await api.get<{ addresses: Address[] }>('/users/addresses')
    return data.addresses
  },
  addAddress: async (payload: AddressInput) => {
    const { data } = await api.post<{ addresses: Address[] }>('/users/addresses', payload)
    return data.addresses
  },
  removeAddress: async (id: string) => {
    const { data } = await api.delete<{ addresses: Address[] }>(`/users/addresses/${id}`)
    return data.addresses
  },
}
