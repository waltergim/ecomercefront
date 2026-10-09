import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ecomer` : 'ecomer — Todo lo que necesitás, en un solo lugar'
  }, [title])
}
