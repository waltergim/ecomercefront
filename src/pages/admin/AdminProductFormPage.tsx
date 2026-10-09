import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateProduct,
  useProductById,
  useUpdateProduct,
} from '@/features/products/hooks'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { PageLoader } from '@/components/ui/Spinner'
import { CATEGORIES } from '@/lib/constants'
import { getErrorMessage } from '@/api/client'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const productSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  category: z.string().min(1, 'Elegí una categoría'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  stock: z.coerce.number().int('Debe ser un número entero').min(0, 'Sin stock = 0'),
  slug: z
    .string()
    .trim()
    .regex(/^([a-z0-9]+(-[a-z0-9]+)*)?$/, 'Solo minúsculas, números y guiones')
    .optional(),
  description: z.string().default(''),
  images: z.string().default(''),
})

type ProductValues = z.infer<typeof productSchema>

export function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { data: product, isLoading } = useProductById(id)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  useDocumentTitle(isEdit ? 'Editar producto' : 'Nuevo producto')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      slug: '',
      description: '',
      images: '',
    },
  })

  useEffect(() => {
    if (!product) return
    reset({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      slug: product.slug,
      description: product.description ?? '',
      images: (product.images ?? []).join('\n'),
    })
  }, [product, reset])

  const onSubmit: SubmitHandler<ProductValues> = (values) => {
    const payload = {
      name: values.name,
      category: values.category,
      price: values.price,
      stock: values.stock,
      description: values.description,
      slug: values.slug || undefined,
      images: values.images
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    }

    if (isEdit && id) {
      updateProduct.mutate(
        { id, payload },
        {
          onSuccess: () => navigate('/admin/productos'),
          onError: (error) => toast.error(getErrorMessage(error)),
        }
      )
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => navigate('/admin/productos'),
        onError: (error) => toast.error(getErrorMessage(error)),
      })
    }
  }

  if (isEdit && isLoading) return <PageLoader label="Cargando producto..." />

  const knownCategories = CATEGORIES.map((category) => category.value)
  const currentCategory = product?.category

  return (
    <div className="card max-w-3xl p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <Link
            to="/admin/productos"
            className="mb-1 inline-flex items-center gap-1.5 text-sm text-ml-muted hover:text-ml-blue"
          >
            <ArrowLeft className="h-4 w-4" /> Productos
          </Link>
          <h1 className="text-lg font-semibold">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Auriculares Inalámbricos Pro"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Categoría"
            error={errors.category?.message}
            {...register('category')}
          >
            <option value="">Seleccioná una categoría</option>
            {knownCategories.map((value) => (
              <option key={value} value={value}>
                {CATEGORIES.find((c) => c.value === value)?.label}
              </option>
            ))}
            {currentCategory && !knownCategories.includes(currentCategory) && (
              <option value={currentCategory}>{currentCategory}</option>
            )}
          </Select>

          <Input
            label="Slug (opcional)"
            placeholder="auriculares-inalambricos-pro"
            hint="Se genera automáticamente si lo dejás vacío"
            error={errors.slug?.message}
            {...register('slug')}
          />

          <Input
            label="Precio"
            inputMode="decimal"
            type="number"
            step="1"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label="Stock"
            inputMode="numeric"
            type="number"
            step="1"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </div>

        <Textarea
          label="Descripción"
          placeholder="Contá características, detalles de envío, etc."
          error={errors.description?.message}
          {...register('description')}
        />

        <Textarea
          label="Imágenes (una por línea)"
          placeholder={'https://cdn.tu-tienda.com/auriculares.jpg\nhttps://cdn.tu-tienda.com/auriculares-2.jpg'}
          hint="Podés pegar URLs directas. Si dejás vacío se muestra un placeholder."
          error={errors.images?.message}
          className="min-h-[90px] font-mono text-xs"
          {...register('images')}
        />

        <div className="flex justify-end gap-2 border-t border-ml-line pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/productos')}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createProduct.isPending || updateProduct.isPending}
          >
            {isEdit ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductFormPage
