import { type SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import { MapPin, Trash2, User } from 'lucide-react'
import {
  useAddAddress,
  useAuth,
  useRemoveAddress,
  useUpdateProfile,
} from '@/features/auth/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/api/client'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toast } from 'sonner'
import type { Address } from '@/types'

interface ProfileValues {
  name: string
}

interface AddressValues {
  street: string
  city: string
  province: string
  zipCode: string
  phone: string
}

const emptyAddress: AddressValues = {
  street: '',
  city: '',
  province: '',
  zipCode: '',
  phone: '',
}

export function AccountPage() {
  useDocumentTitle('Mi cuenta')
  const { user } = useAuth()
  const updateProfile = useUpdateProfile()
  const addAddress = useAddAddress()
  const removeAddress = useRemoveAddress()
  const [showAddressForm, setShowAddressForm] = useState(false)

  const profileForm = useForm<ProfileValues>({
    defaultValues: { name: user?.name ?? '' },
    values: { name: user?.name ?? '' },
  })

  const addressForm = useForm<AddressValues>({ defaultValues: emptyAddress })

  const onProfile: SubmitHandler<ProfileValues> = (values) => {
    updateProfile.mutate(values, {
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  const onAddress: SubmitHandler<AddressValues> = (values) => {
    addAddress.mutate(
      { ...values, phone: values.phone || undefined },
      {
        onSuccess: () => {
          addressForm.reset(emptyAddress)
          setShowAddressForm(false)
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    )
  }

  const onDeleteAddress = (address: Address) => {
    if (!address._id) return
    removeAddress.mutate(address._id, {
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  const addresses = user?.addresses ?? []

  return (
    <div className="container-ml max-w-4xl py-5">
      <h1 className="mb-4 text-lg font-semibold">Mi cuenta</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <User className="h-4 w-4 text-ml-blue" /> Mis datos
          </h2>

          <form onSubmit={profileForm.handleSubmit(onProfile)} className="space-y-4" noValidate>
            <Input label="Nombre" {...profileForm.register('name')} />
            <Input label="Email" value={user?.email ?? ''} readOnly className="bg-slate-50" />
            <Input
              label="Tipo de cuenta"
              value={user?.role === 'admin' ? 'Administrador' : 'Cliente'}
              readOnly
              className="bg-slate-50"
            />
            <Button
              type="submit"
              variant="outline"
              loading={updateProfile.isPending}
              disabled={!profileForm.formState.isDirty}
            >
              Guardar cambios
            </Button>
          </form>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="h-4 w-4 text-ml-blue" /> Direcciones
            </h2>
            <button
              type="button"
              onClick={() => setShowAddressForm((prev) => !prev)}
              className="link-blue text-sm"
            >
              {showAddressForm ? 'Cancelar' : 'Agregar'}
            </button>
          </div>

          {addresses.length === 0 && !showAddressForm && (
            <p className="text-sm text-ml-muted">
              Todavía no cargaste direcciones. Agregá una para agilizar tus compras.
            </p>
          )}

          <ul className="space-y-2">
            {addresses.map((address) => (
              <li
                key={address._id ?? address.street}
                className="flex items-start justify-between gap-3 rounded-md border border-ml-line p-3"
              >
                <span className="text-sm">
                  <span className="block font-medium">{address.street}</span>
                  <span className="block text-ml-muted">
                    {address.city}, {address.province} — {address.zipCode}
                  </span>
                  {address.phone && <span className="block text-ml-muted">Tel: {address.phone}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteAddress(address)}
                  className="rounded-md p-1.5 text-ml-muted hover:bg-red-50 hover:text-ml-red"
                  aria-label="Eliminar dirección"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          {showAddressForm && (
            <form
              onSubmit={addressForm.handleSubmit(onAddress)}
              className="mt-4 space-y-3 border-t border-ml-line pt-4"
              noValidate
            >
              <Input
                label="Calle y número"
                placeholder="Av. Corrientes 1234"
                error={addressForm.formState.errors.street?.message}
                {...addressForm.register('street', { required: 'Obligatorio' })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Ciudad"
                  error={addressForm.formState.errors.city?.message}
                  {...addressForm.register('city', { required: 'Obligatorio' })}
                />
                <Input
                  label="Provincia"
                  error={addressForm.formState.errors.province?.message}
                  {...addressForm.register('province', { required: 'Obligatorio' })}
                />
                <Input
                  label="Código postal"
                  error={addressForm.formState.errors.zipCode?.message}
                  {...addressForm.register('zipCode', { required: 'Obligatorio' })}
                />
                <Input label="Teléfono (opcional)" {...addressForm.register('phone')} />
              </div>
              <Button type="submit" size="sm" loading={addAddress.isPending}>
                Guardar dirección
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default AccountPage
