import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

export function ProductGrid({ products }: { products: Product[] }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
