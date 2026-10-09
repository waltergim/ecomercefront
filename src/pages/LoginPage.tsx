import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useLogin } from '@/features/auth/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/api/client'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  useDocumentTitle('Ingresar')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useLogin()

  const redirect = searchParams.get('redirect') ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit: SubmitHandler<LoginValues> = (values) => {
    login.mutate(values, {
      onSuccess: () => navigate(decodeURIComponent(redirect), { replace: true }),
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <div className="container-ml flex justify-center py-10">
      <div className="w-full max-w-[400px]">
        <div className="card p-6 sm:p-8">
          <h1 className="mb-6 text-xl font-semibold">Ingresá</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" fullWidth size="lg" loading={login.isPending}>
              Continuar
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ml-muted">
            ¿Todavía no tenés cuenta?{' '}
            <Link to="/registro" className="link-blue font-medium">
              Creala gratis
            </Link>
          </p>
        </div>

        <div className="mt-4 rounded-md border border-dashed border-ml-line bg-white/60 p-4 text-xs text-ml-muted">
          <p className="mb-1 font-semibold text-ml-text">Cuentas de prueba</p>
          <p>Cliente: cliente@ecomer.com / cliente1234</p>
          <p>Admin: admin@ecomer.com / admin1234</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
