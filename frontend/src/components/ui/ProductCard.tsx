import type { Product } from '@/types/product';
import { Badge } from './Badge';

export function ProductCard({ product }: { product: Product }) {
  const image = product.media[0];
  return (
    <a href={`/products/${product.slug}`} className="group block border border-mist p-4 transition hover:border-champagne">
      <div className="aspect-[4/5] overflow-hidden bg-mist">
        {image ? <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl">{product.name}</h3>
          <p className="mt-1 text-sm text-graphite">{product.category}</p>
        </div>
        <Badge>${(product.price / 100).toFixed(0)}</Badge>
      </div>
    </a>
  );
}
