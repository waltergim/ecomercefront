import { NavLink, Outlet, Link } from 'react-router-dom'
import { ArrowLeft, Package, ReceiptText } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ReceiptText },
]

export function AdminLayout() {
  return (
    <div className="container-ml py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Panel de administración</h1>
          <p className="text-sm text-ml-muted">Gestioná el catálogo y los pedidos de la tienda</p>
        </div>
        <Link to="/" className="link-blue flex items-center gap-1.5 text-sm">
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
        </Link>
      </div>

      <div className="mb-5 flex gap-2 border-b border-ml-line">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                '-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-ml-blue text-ml-blue'
                  : 'border-transparent text-ml-muted hover:text-ml-text'
              )
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
