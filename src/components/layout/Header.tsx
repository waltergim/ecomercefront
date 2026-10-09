import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useAuth, useLogout } from '@/features/auth/hooks'
import { useCart } from '@/features/cart/hooks'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="ecomer - Inicio">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-lg font-black text-ml-yellow">
        e
      </span>
      <span className="hidden text-2xl font-black italic tracking-tight text-black sm:block">
        ecomer
      </span>
    </Link>
  )
}

export function SearchBar({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [value, setValue] = useState(() =>
    location.pathname === '/buscar' ? (searchParams.get('q') ?? '') : ''
  )

  useEffect(() => {
    if (location.pathname === '/buscar') setValue(searchParams.get('q') ?? '')
    else setValue('')
  }, [location.pathname, searchParams])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const query = value.trim()
    navigate(query ? `/buscar?q=${encodeURIComponent(query)}` : '/buscar')
  }

  return (
    <form onSubmit={submit} className={cn('relative w-full', className)} role="search">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar productos, marcas y mucho más"
        autoFocus={autoFocus}
        className="h-11 w-full rounded-md border border-slate-200 bg-white pl-4 pr-12 text-base text-ml-text placeholder:text-ml-muted/70 focus:outline-none focus:ring-1 focus:ring-ml-blue/40"
        aria-label="Buscar productos"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 flex h-8 w-9 items-center justify-center rounded-md text-ml-muted transition-colors hover:bg-slate-100"
        aria-label="Buscar"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}

function UserMenu() {
  const { user } = useAuth()
  const logout = useLogout()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) {
    return (
      <div className="hidden items-center gap-5 text-sm lg:flex">
        <Link to="/registro" className="text-ml-text/90 hover:text-ml-blue">
          <span className="font-normal">Creá tu cuenta</span>
        </Link>
        <span className="h-4 w-px bg-black/20" />
        <Link to="/ingresar" className="font-medium text-ml-text hover:text-ml-blue">
          Ingresá
        </Link>
        <span className="h-4 w-px bg-black/20" />
        <Link to="/mis-pedidos" className="text-ml-text/90 hover:text-ml-blue">
          Mis pedidos
        </Link>
      </div>
    )
  }

  return (
    <div className="relative hidden lg:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-ml-text transition-colors hover:bg-black/5"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <User className="h-4 w-4" />
        <span className="max-w-[130px] truncate font-medium">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 animate-pop overflow-hidden rounded-md border border-ml-line bg-white py-1 shadow-hover">
          <div className="border-b border-ml-line px-4 py-2.5">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-ml-muted">{user.email}</p>
          </div>
          <div className="flex flex-col py-1 text-sm">
            <Link to="/mis-pedidos" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-slate-50">
              Mis pedidos
            </Link>
            <Link to="/favoritos" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-slate-50">
              Favoritos
            </Link>
            <Link to="/cuenta" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-slate-50">
              Mi cuenta
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-2 text-ml-blue hover:bg-slate-50">
                Panel de administración
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              logout.mutate()
            }}
            className="w-full border-t border-ml-line px-4 py-2.5 text-left text-sm text-ml-red hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

function CartButton() {
  const { count } = useCart()

  return (
    <Link
      to="/carrito"
      className="relative flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-black/5"
      aria-label={`Carrito, ${count} productos`}
    >
      <ShoppingCart className="h-6 w-6 text-black/85" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ml-blue px-1 text-[11px] font-semibold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ml-yellow shadow-[0_1px_0_0_rgba(0,0,0,.08)]">
        <div className="container-ml flex h-16 items-center gap-3 sm:gap-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-black/85 hover:bg-black/5 lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Logo />

          <SearchBar className="hidden flex-1 md:block" />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <UserMenu />
            <Link
              to="/favoritos"
              className="hidden h-10 w-10 items-center justify-center rounded-md text-black/85 hover:bg-black/5 sm:flex"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>

      <div className="border-b border-ml-line bg-white">
        <div className="container-ml hidden h-11 items-center gap-6 lg:flex">
          <nav className="flex items-center gap-5 overflow-x-auto text-sm text-ml-muted no-scrollbar">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                to={`/buscar?categoria=${encodeURIComponent(category.value)}`}
                className="whitespace-nowrap transition-colors hover:text-ml-blue"
              >
                {category.label}
              </Link>
            ))}
          </nav>
          <Link to="/buscar" className="ml-auto whitespace-nowrap text-sm font-medium text-ml-blue hover:underline">
            Ver todo
          </Link>
        </div>
      </div>

      <div className="border-b border-ml-line bg-white px-3 py-2.5 md:hidden">
        <SearchBar />
      </div>

      {mobileOpen && (
        <div className="border-b border-ml-line bg-white lg:hidden">
          <nav className="container-ml flex flex-col py-2 text-sm">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                to={`/buscar?categoria=${encodeURIComponent(category.value)}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-slate-50"
              >
                <span>{category.icon}</span>
                {category.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-ml-line" />
            <Link to="/mis-pedidos" onClick={() => setMobileOpen(false)} className="px-2 py-2.5 hover:bg-slate-50">
              Mis pedidos
            </Link>
            <Link to="/cuenta" onClick={() => setMobileOpen(false)} className="px-2 py-2.5 hover:bg-slate-50">
              Mi cuenta
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
