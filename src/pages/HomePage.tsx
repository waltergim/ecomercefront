import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Tag } from 'lucide-react'
import { useProducts } from '@/features/products/hooks'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CATEGORIES, FREE_SHIPPING_MIN } from '@/lib/constants'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const slides = [
  {
    title: 'Tecnología que te acompaña',
    subtitle: 'Hasta 40% off en electrónica y audio',
    cta: 'Ver ofertas',
    to: '/buscar?categoria=electronica',
    from: 'from-[#1e3a8a]',
    to2: 'to-[#3b82f6]',
  },
  {
    title: 'Renová tu guardarropa',
    subtitle: 'Ropa y zapatillas con envío gratis',
    cta: 'Comprar ahora',
    to: '/buscar?categoria=ropa',
    from: 'from-[#831843]',
    to2: 'to-[#ec4899]',
  },
  {
    title: 'Tu casa, más práctica',
    subtitle: 'Hogar y electrodomésticos con cuotas sin interés',
    cta: 'Descubrir',
    to: '/buscar?categoria=hogar',
    from: 'from-[#78350f]',
    to2: 'to-[#f59e0b]',
  },
]

function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5500)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[index]
  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + slides.length) % slides.length)

  return (
    <section className="relative overflow-hidden rounded-md shadow-card">
      <div className={`bg-gradient-to-r ${slide.from} ${slide.to2} transition-all duration-500`}>
        <div className="flex min-h-[240px] flex-col justify-center gap-3 px-8 py-12 sm:min-h-[300px] sm:px-14">
          <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Ofertas de la semana
          </span>
          <h1 className="max-w-lg text-3xl font-semibold text-white sm:text-4xl">{slide.title}</h1>
          <p className="max-w-md text-sm text-white/85 sm:text-base">{slide.subtitle}</p>
          <Link
            to={slide.to}
            className="mt-2 w-fit rounded-md bg-ml-yellow px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ml-text shadow-card hover:bg-white"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ml-text shadow-card hover:bg-white"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    { icon: Truck, title: 'Envío gratis', text: `En compras desde $ ${FREE_SHIPPING_MIN.toLocaleString('es-AR')}` },
    { icon: Tag, title: 'Hasta 12 cuotas', text: 'Sin interés con bancos seleccionados' },
    { icon: ShieldCheck, title: 'Compra protegida', text: 'Recibí lo que esperabas o te devolvemos tu dinero' },
  ]

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="card flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ml-blueLight text-ml-blue">
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-ml-muted">{item.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export function HomePage() {
  useDocumentTitle('')
  const { data, isLoading } = useProducts({ limit: 8 })
  const { data: latest, isLoading: latestLoading } = useProducts({ limit: 4, page: 1 })

  return (
    <div className="container-ml space-y-6 py-5">
      <Hero />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categorías</h2>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              to={`/buscar?categoria=${encodeURIComponent(category.value)}`}
              className="card group flex flex-col items-center gap-2 p-3 text-center transition-shadow hover:shadow-hover"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${category.color}`}
              >
                {category.icon}
              </span>
              <span className="text-xs text-ml-muted group-hover:text-ml-blue">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <Benefits />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ofertas del día</h2>
          <Link to="/buscar" className="link-blue text-sm">
            Ver todas
          </Link>
        </div>
        <ProductGrid products={data?.items ?? []} loading={isLoading} skeletons={4} />
      </section>

      <section className="overflow-hidden rounded-md bg-ml-yellow">
        <div className="flex flex-col items-start justify-between gap-4 px-6 py-7 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-black">Creá tu cuenta y comprá en 1 minuto</h2>
            <p className="mt-1 text-sm text-black/70">
              Guardá tus direcciones, seguí tus pedidos y favoritos.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/registro"
              className="btn-base h-11 bg-black px-5 text-sm text-white hover:bg-black/80"
            >
              Crear cuenta
            </Link>
            <Link
              to="/ingresar"
              className="btn-base h-11 border border-black/20 bg-white px-5 text-sm text-black hover:bg-slate-50"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recién llegados</h2>
          <Link to="/buscar" className="link-blue text-sm">
            Ver todo
          </Link>
        </div>
        <ProductGrid products={latest?.items ?? []} loading={latestLoading} skeletons={4} />
      </section>
    </div>
  )
}

export default HomePage
