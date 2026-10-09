import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

interface ApiErrorBody {
  message?: string
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ??
      (error.code === 'ECONNABORTED'
        ? 'La petición tardó demasiado, probá de nuevo'
        : error.message === 'Network Error'
          ? 'No se pudo conectar con el servidor'
          : 'Ocurrió un error, probá de nuevo en unos minutos')

    return Promise.reject(new ApiRequestError(message, status))
  }
)

export const getErrorMessage = (error: unknown, fallback = 'Ocurrió un error') =>
  error instanceof Error ? error.message : fallback
