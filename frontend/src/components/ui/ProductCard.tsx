'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Badge } from './Badge'
import { PriceDisplay } from './PriceDisplay'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import type { Product } from '@/types/product'

export function ProductCard({ product, onClick, onWishlistChange }: { product: Product; onClick?: () => void; onWishlistChange?: (productId: string, inWishlist: boolean) => void }) {
  const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 1
  const { isInWishlist, toggle } = useWishlist()
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const inWishlist = isInWishlist(product.id)

  async function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    const nowInWishlist = await toggle(product.id)
    onWishlistChange?.(product.id, !!nowInWishlist)
  }

  return (
    <Link
  href={`/products/${product.slug}`}
  onClick={onClick}
  className="group block transition-all duration-1000 ease-out hover:-translate-y-2"
>
      <div className="relative aspect-[3/4] overflow-hidden bg-luxury-gray border border-transparent group-hover:border-luxury-gold group-hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-700">
        {product.images?.[0] && (
          <Image src={product.images[0].url} alt={product.name} fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
        )}
        <div className="absolute top-3 left-3 space-y-1">
          {totalStock === 0 && <Badge variant="out-of-stock">Out of Stock</Badge>}
          {totalStock > 0 && totalStock < 10 && <Badge variant="low-stock">Low Stock</Badge>}
        </div>
        <button onClick={handleWishlistClick} aria-label="Toggle wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-luxury-black/40 backdrop-blur-sm hover:bg-luxury-black/70 transition-all duration-700 ease-out">
          <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-white'}`} />
        </button>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-luxury-white text-sm tracking-wide group-hover:text-luxury-gold transition-all duration-700 group-hover:tracking-[0.15em]">
          {product.name}
        </h3>
        <PriceDisplay price={product.price} comparePrice={product.comparePrice} />
      </div>
    </Link>
  )
}
