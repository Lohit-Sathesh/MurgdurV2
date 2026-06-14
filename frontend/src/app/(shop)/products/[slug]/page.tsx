import { ProductImageGallery } from '@/components/shop/ProductImageGallery'
import { SizeGuide } from '@/components/shop/SizeGuide'
import { Badge } from '@/components/ui/Badge'
import { AddToCartButton } from '@/components/ui/AddToCartButton'
import { WishlistButton } from '@/components/ui/WishlistButton'
import { BackButton } from '@/components/ui/BackButton'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { DeliveryEstimate } from '@/components/shop/DeliveryEstimate'
import { api } from '@/lib/api'
import type { Product } from '@/types/product'

export const revalidate = 120

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product: Product | null = null
  try {
    const res = await api.get(`/products/${params.slug}`)
    product = res.data
  } catch {}

  if (!product) return <div className="min-h-screen bg-luxury-black flex items-center justify-center text-luxury-white font-serif text-3xl">Product not found</div>

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <BackButton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <ProductImageGallery images={product.images} />
        <div className="space-y-8">
          {totalStock === 0 && <Badge variant="out-of-stock">Out of Stock</Badge>}
          {totalStock > 0 && totalStock < 10 && <Badge variant="low-stock">Low Stock</Badge>}
          <h1 className="font-serif text-4xl tracking-luxury text-luxury-white">{product.name}</h1>
          <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="lg" />
          <p className="text-luxury-muted leading-relaxed">{product.description}</p>
          {product.material && (
            <p className="text-sm tracking-luxury text-luxury-muted uppercase">
              Material: {product.material}
            </p>
          )}
          <SizeGuide variants={product.variants} />
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <AddToCartButton product={product} />
            </div>
            <WishlistButton productId={product.id} />
          </div>
          <DeliveryEstimate />
        </div>
      </div>
    </div>
  )
}