import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada')

  return (
    <div className="container-ml flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl font-black text-ml-yellow">404</span>
      <h1 className="mt-4 text-xl font-semibold">Ups, no encontramos esta página</h1>
      <p className="mt-2 max-w-md text-sm text-ml-muted">
        El enlace puede estar roto o el producto ya no existe. Volvé al inicio y seguí explorando.
      </p>
      <Link
        to="/"
        className="btn-base mt-6 h-11 bg-ml-blue px-6 text-sm text-white hover:bg-ml-blueDark"
      >
        <Compass className="h-4 w-4" /> Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
