import { useState } from 'react'
import { Package } from 'lucide-react'
import { buildImageUrl, cn } from '@/lib/utils'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  iconClassName?: string
}

export function ProductImage({ src, alt, className, iconClassName }: ProductImageProps) {
  const url = buildImageUrl(src)
  const [failed, setFailed] = useState(false)

  if (!url || failed) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-300',
          className
        )}
        aria-label={alt}
      >
        <Package className={cn('h-12 w-12', iconClassName)} strokeWidth={1.2} />
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
