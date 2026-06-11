import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

export function WishlistGrid({ products }: { products: Product[] }) {
  return <div className="grid gap-5 md:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
