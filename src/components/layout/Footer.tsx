import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const columns = [
  {
    title: 'Acerca de',
    links: ['Trabajá con nosotros', 'Términos y condiciones', 'Cómo cuidamos tu privacidad', 'Defensa del consumidor'],
  },
  {
    title: 'Ayuda',
    links: ['Cómo comprar', 'Envíos', 'Devoluciones', 'Medios de pago', 'Preguntas frecuentes'],
  },
  {
    title: 'Redes sociales',
    social: true,
    links: [] as string[],
  },
  {
    title: 'Mi cuenta',
    links: ['Ingresá', 'Creá tu cuenta', 'Mis pedidos', 'Favoritos'],
  },
]

const routesByLink: Record<string, string> = {
  Ingresá: '/ingresar',
  'Creá tu cuenta': '/registro',
  'Mis pedidos': '/mis-pedidos',
  Favoritos: '/favoritos',
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-ml-line bg-white">
      <div className="container-ml grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-sm font-semibold text-ml-text">{column.title}</h3>
            {column.social ? (
              <div className="flex gap-3 text-ml-muted">
                <a href="#" aria-label="Instagram" className="hover:text-ml-blue">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Facebook" className="hover:text-ml-blue">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-ml-blue">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Youtube" className="hover:text-ml-blue">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-ml-muted">
                {column.links.map((link) => (
                  <li key={link}>
                    {routesByLink[link] ? (
                      <Link to={routesByLink[link]} className="hover:text-ml-blue">
                        {link}
                      </Link>
                    ) : (
                      <span className="cursor-default hover:text-ml-blue">{link}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-ml-line">
        <div className="container-ml flex flex-col items-center justify-between gap-3 py-5 text-xs text-ml-muted md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="font-semibold text-ml-text">Categorías</span>
            {CATEGORIES.slice(0, 5).map((category) => (
              <Link
                key={category.value}
                to={`/buscar?categoria=${encodeURIComponent(category.value)}`}
                className="hover:text-ml-blue"
              >
                {category.label}
              </Link>
            ))}
          </div>
          <p>Copyright © 2026 ecomer — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  )
}
