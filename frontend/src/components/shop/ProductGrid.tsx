import { ProductCard } from '@/components/ui/ProductCard'
import type { Product } from '@/types/product'

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products?.length) return (
    <div className="text-center py-24">
      <p className="text-luxury-muted tracking-luxury text-sm uppercase">No products found</p>
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}