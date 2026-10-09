import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useDeleteProduct, useAdminProducts } from '@/features/products/hooks'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { ProductImage } from '@/components/ui/ProductImage'
import { PageLoader } from '@/components/ui/Spinner'
import { categoryLabel } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { getErrorMessage } from '@/api/client'
import { toast } from 'sonner'

export function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useAdminProducts({
    page,
    limit: 10,
    q: debouncedSearch || undefined,
  })
  const deleteProduct = useDeleteProduct()

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    deleteProduct.mutate(id, { onError: (error) => toast.error(getErrorMessage(error)) })
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-xs sm:w-auto sm:flex-1">
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            aria-label="Buscar productos"
          />
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="btn-base h-11 bg-ml-blue px-4 text-sm text-white hover:bg-ml-blueDark"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      {isLoading ? (
        <PageLoader label="Cargando productos..." />
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center text-ml-muted">
          <Search className="h-7 w-7" />
          <p className="text-sm">No hay productos para mostrar.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-ml-line text-xs uppercase tracking-wide text-ml-muted">
                  <th className="py-2.5 pr-3 font-medium">Producto</th>
                  <th className="py-2.5 pr-3 font-medium">Categoría</th>
                  <th className="py-2.5 pr-3 font-medium">Precio</th>
                  <th className="py-2.5 pr-3 font-medium">Stock</th>
                  <th className="py-2.5 pr-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ml-line">
                {data.items.map((product) => (
                  <tr key={product._id} className="align-middle">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-slate-50">
                          <ProductImage src={product.images?.[0]} alt={product.name} />
                        </span>
                        <Link
                          to={`/producto/${product.slug}`}
                          className="line-clamp-2 max-w-[260px] font-medium hover:text-ml-blue"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-ml-muted">{categoryLabel(product.category)}</td>
                    <td className="py-3 pr-3 font-medium">{formatCurrency(product.price)}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={
                          product.stock === 0
                            ? 'font-medium text-ml-red'
                            : product.stock <= 5
                              ? 'font-medium text-amber-600'
                              : 'text-ml-muted'
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/admin/productos/${product._id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-ml-blue hover:bg-ml-blueLight"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id, product.name)}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-ml-red hover:bg-red-50"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={data.page} pages={data.pages} onChange={setPage} className="mt-4" />
        </>
      )}

      <div className="mt-5 flex justify-end border-t border-ml-line pt-4">
        <Link to="/admin/pedidos" className="link-blue text-sm">
          Ir a pedidos →
        </Link>
      </div>
    </div>
  )
}

export default AdminProductsPage
