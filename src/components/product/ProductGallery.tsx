import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const list = images.length > 0 ? images : [null]
  const [index, setIndex] = useState(0)
  const current = list[Math.min(index, list.length - 1)]

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + list.length) % list.length)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-slate-50">
        <ProductImage src={current} alt={name} className="animate-fadeUp" />

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card hover:bg-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5 text-ml-muted" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5 text-ml-muted" />
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {list.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 bg-slate-50 transition-colors',
                i === index ? 'border-ml-blue' : 'border-transparent hover:border-slate-300'
              )}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <ProductImage src={image} alt={`${name} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
