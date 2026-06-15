'use client'
import { useEffect, useRef, useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'
import { api } from '@/lib/api'
import type { Product } from '@/types/product'

const PAGE_SIZE = 24

interface ProductGridProps {
  products: Product[]
  total?: number
  query?: Record<string, string | undefined>
}

export function ProductGrid({ products: initialProducts, total, query }: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || total === undefined) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore()
    }, { rootMargin: '600px' })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [products, loading, total])

  async function loadMore() {
    if (loading || total === undefined || products.length >= total) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(products.length))
      const res = await api.get(`/products?${params.toString()}`)
      setProducts(prev => [...prev, ...(res.data.products ?? [])])
    } catch {
      // ignore — user can retry by scrolling again
    } finally {
      setLoading(false)
    }
  }

  if (!products?.length) return (
    <div className="text-center py-24">
      <p className="text-luxury-muted tracking-luxury text-sm uppercase">No products found</p>
    </div>
  )

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {total !== undefined && products.length < total && (
        <div ref={sentinelRef} className="py-12 text-center">
          <p className="text-luxury-muted text-xs uppercase tracking-luxury">
            {loading ? 'Loading more…' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
