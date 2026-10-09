import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useRegister } from '@/features/auth/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/api/client'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().trim().toLowerCase().email('Ingresá un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(72, 'La contraseña es demasiado larga'),
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  useDocumentTitle('Creá tu cuenta')
  const navigate = useNavigate()
  const registerUser = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit: SubmitHandler<RegisterValues> = (values) => {
    registerUser.mutate(values, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <div className="container-ml flex justify-center py-10">
      <div className="w-full max-w-[400px]">
        <div className="card p-6 sm:p-8">
          <h1 className="mb-1 text-xl font-semibold">Creá tu cuenta</h1>
          <p className="mb-6 text-sm text-ml-muted">
            Es rápido y gratis. Guardá tus datos para comprar en segundos.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Nombre y apellido"
              autoComplete="name"
              placeholder="María Pérez"
              error={errors.name?.message}
              {...register('name')}
            />
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
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              hint="Usá 6 caracteres o más"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" fullWidth size="lg" loading={registerUser.isPending}>
              Crear cuenta
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ml-muted">
            ¿Ya tenés cuenta?{' '}
            <Link to="/ingresar" className="link-blue font-medium">
              Ingresá
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-ml-muted">
          Al crear tu cuenta aceptás nuestros términos y condiciones y políticas de privacidad.
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
