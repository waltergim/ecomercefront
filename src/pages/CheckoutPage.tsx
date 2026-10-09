import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, ShieldCheck } from 'lucide-react'
import { useAddresses, useAuth } from '@/features/auth/hooks'
import { useCart } from '@/features/cart/hooks'
import { useCreateOrder } from '@/features/orders/hooks'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { getErrorMessage } from '@/api/client'
import { cn } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toast } from 'sonner'
import type { Address } from '@/types'

interface FormState {
  street: string
  city: string
  province: string
  zipCode: string
  phone: string
}

const emptyForm: FormState = {
  street: '',
  city: '',
  province: '',
  zipCode: '',
  phone: '',
}

export function CheckoutPage() {
  useDocumentTitle('Finalizar compra')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: savedAddresses = [] } = useAddresses()
  const { items, subtotal, shipping, total, count } = useCart()
  const createOrder = useCreateOrder()

  const [selectedId, setSelectedId] = useState<string>(
    () => savedAddresses[0]?._id ?? 'new'
  )
  const [form, setForm] = useState<FormState>(emptyForm)

  useEffect(() => {
    if (savedAddresses.length > 0 && selectedId === 'new') {
      setSelectedId(savedAddresses[0]._id ?? 'new')
    }
  }, [savedAddresses, selectedId])

  if (items.length === 0) {
    return (
      <div className="container-ml py-8">
        <EmptyState
          icon={<CreditCard className="h-7 w-7" />}
          title="No hay nada para comprar"
          description="Agregá productos al carrito para continuar con el pedido."
          action={
            <Link to="/buscar" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
              Ver productos
            </Link>
          }
        />
      </div>
    )
  }

  const saved = savedAddresses.find((address) => address._id === selectedId)
  const useNewForm = selectedId === 'new' || !saved

  const update = (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const resolveAddress = (): Address | null => {
    if (!useNewForm && saved) return saved
    if (!form.street || !form.city || !form.province || !form.zipCode) return null
    return {
      street: form.street,
      city: form.city,
      province: form.province,
      zipCode: form.zipCode,
      phone: form.phone || undefined,
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const address = resolveAddress()
    if (!address) {
      toast.error('Completá los datos de envío')
      return
    }

    createOrder.mutate(
      {
        items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
        shippingAddress: address,
      },
      {
        onSuccess: (order) => {
          navigate(`/checkout/exito?pedido=${order._id}`, { replace: true })
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    )
  }

  return (
    <div className="container-ml py-5">
      <h1 className="mb-4 text-lg font-semibold">Finalizar compra</h1>

      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <MapPin className="h-4 w-4 text-ml-blue" /> ¿Dónde lo recibís?
            </h2>

            {savedAddresses.length > 0 && (
              <div className="mb-4 space-y-2">
                {savedAddresses.map((address) => (
                  <label
                    key={address._id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
                      selectedId === address._id
                        ? 'border-ml-blue bg-ml-blueLight'
                        : 'border-ml-line hover:border-slate-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1 accent-ml-blue"
                      checked={selectedId === address._id}
                      onChange={() => setSelectedId(address._id ?? 'new')}
                    />
                    <span className="text-sm">
                      <span className="block font-medium">{address.street}</span>
                      <span className="block text-ml-muted">
                        {address.city}, {address.province} — {address.zipCode}
                      </span>
                    </span>
                  </label>
                ))}
                <label
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
                    useNewForm ? 'border-ml-blue bg-ml-blueLight' : 'border-ml-line hover:border-slate-300'
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 accent-ml-blue"
                    checked={useNewForm}
                    onChange={() => setSelectedId('new')}
                  />
                  <span className="text-sm font-medium">Usar otra dirección</span>
                </label>
              </div>
            )}

            {useNewForm && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Calle y número"
                  placeholder="Av. Corrientes 1234"
                  value={form.street}
                  onChange={update('street')}
                  required
                  wrapperClassName="sm:col-span-2"
                />
                <Input
                  label="Ciudad"
                  placeholder="CABA"
                  value={form.city}
                  onChange={update('city')}
                  required
                />
                <Input
                  label="Provincia"
                  placeholder="Buenos Aires"
                  value={form.province}
                  onChange={update('province')}
                  required
                />
                <Input
                  label="Código postal"
                  placeholder="1425"
                  value={form.zipCode}
                  onChange={update('zipCode')}
                  required
                />
                <Input
                  label="Teléfono (opcional)"
                  placeholder="11 5555 5555"
                  value={form.phone}
                  onChange={update('phone')}
                />
              </div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
              <CreditCard className="h-4 w-4 text-ml-blue" /> Pago
            </h2>
            <p className="text-sm text-ml-muted">
              Al confirmar, el pedido queda registrado como <strong>pendiente de pago</strong>.
              Podés abonar por transferencia y el pedido pasa a <strong>pagado</strong> cuando
              lo verifiquemos.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-ml-muted">
              <ShieldCheck className="h-4 w-4 text-ml-green" />
              Tus datos se manejan de forma segura.
            </p>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-40">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            count={count}
            showCheckoutButton={false}
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            className="mt-3"
            loading={createOrder.isPending}
          >
            Confirmar pedido
          </Button>
          <p className="mt-3 text-center text-xs text-ml-muted">
            Hola {user?.name}, revisá que los datos sean correctos antes de confirmar.
          </p>
        </aside>
      </form>
    </div>
  )
}

export default CheckoutPage
