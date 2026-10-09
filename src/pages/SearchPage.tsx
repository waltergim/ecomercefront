import { type FormEvent, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchX, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/features/products/hooks'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORIES, categoryLabel } from '@/lib/constants'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn, formatCurrency } from '@/lib/utils'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const q = searchParams.get('q')?.trim() ?? ''
  const category = searchParams.get('categoria')?.trim() ?? ''
  const page = Number(searchParams.get('page') ?? 1) || 1

  const { data, isLoading } = useProducts({
    q: q || undefined,
    category: category || undefined,
    page,
    limit: 12,
  })

  useDocumentTitle(q ? `Buscar: ${q}` : category ? categoryLabel(category) : 'Resultados')

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next, { replace: true })
  }

  const applyPrice = (event: FormEvent) => {
    event.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (min) next.set('min', min)
    else next.delete('min')
    if (max) next.set('max', max)
    else next.delete('max')
    setSearchParams(next, { replace: true })
  }

  const minPrice = Number(searchParams.get('min') ?? 0)
  const maxPrice = Number(searchParams.get('max') ?? 0)

  const filtered = (data?.items ?? []).filter((product) => {
    if (minPrice && product.price < minPrice) return false
    if (maxPrice && product.price > maxPrice) return false
    return true
  })

  const title = q
    ? `Resultados para “${q}”`
    : category
      ? categoryLabel(category)
      : 'Todos los productos'

  return (
    <div className="container-ml py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {typeof data?.total === 'number' && (
            <p className="text-sm text-ml-muted">{data.total} resultados</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="btn-base h-10 border border-ml-line bg-white px-4 text-sm text-ml-text lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filtros
        </button>
      </div>

      <div className="flex gap-5">
        <aside
          className={cn(
            'w-full shrink-0 lg:w-64',
            showFilters ? 'block' : 'hidden lg:block'
          )}
        >
          <div className="card space-y-5 p-4">
            <div>
              <h2 className="mb-2 text-sm font-semibold">Categorías</h2>
              <ul className="space-y-1 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setParam('categoria', null)}
                    className={cn(
                      'rounded-md px-2 py-1.5 text-left transition-colors',
                      !category ? 'bg-ml-blueLight font-medium text-ml-blue' : 'text-ml-muted hover:bg-slate-50'
                    )}
                  >
                    Todas
                  </button>
                </li>
                {CATEGORIES.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => setParam('categoria', item.value)}
                      className={cn(
                        'w-full rounded-md px-2 py-1.5 text-left transition-colors',
                        category === item.value
                          ? 'bg-ml-blueLight font-medium text-ml-blue'
                          : 'text-ml-muted hover:bg-slate-50'
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={applyPrice} className="border-t border-ml-line pt-4">
              <h2 className="mb-2 text-sm font-semibold">Precio</h2>
              <div className="flex items-center gap-2">
                <Input
                  inputMode="numeric"
                  placeholder="Mín"
                  value={min}
                  onChange={(event) => setMin(event.target.value.replace(/\D/g, ''))}
                  wrapperClassName="flex-1"
                  aria-label="Precio mínimo"
                />
                <span className="text-ml-muted">–</span>
                <Input
                  inputMode="numeric"
                  placeholder="Máx"
                  value={max}
                  onChange={(event) => setMax(event.target.value.replace(/\D/g, ''))}
                  wrapperClassName="flex-1"
                  aria-label="Precio máximo"
                />
              </div>
              <Button type="submit" variant="outline" size="sm" fullWidth className="mt-3">
                Aplicar
              </Button>
              {(minPrice > 0 || maxPrice > 0) && (
                <p className="mt-2 text-xs text-ml-muted">
                  {minPrice > 0 && `Desde ${formatCurrency(minPrice)}`}
                  {minPrice > 0 && maxPrice > 0 && ' '}
                  {maxPrice > 0 && `hasta ${formatCurrency(maxPrice)}`}
                </p>
              )}
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <ProductGrid products={[]} loading skeletons={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-7 w-7" />}
              title="No encontramos lo que buscás"
              description={
                q
                  ? `No hay resultados para “${q}”. Probá con otras palabras o revisá la ortografía.`
                  : 'Probá con otra categoría o ampliá el rango de precios.'
              }
              action={
                <Link to="/buscar" className="btn-base h-11 bg-ml-blue px-5 text-sm text-white">
                  Ver todos los productos
                </Link>
              }
            />
          ) : (
            <>
              <ProductGrid products={filtered} />
              <Pagination
                page={data?.page ?? 1}
                pages={data?.pages ?? 1}
                onChange={(next) => setParam('page', String(next))}
                className="mt-6"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
