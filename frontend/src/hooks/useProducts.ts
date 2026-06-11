'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product, ProductQuery } from '@/types/product';

export function useProducts(query: ProductQuery = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const queryKey = JSON.stringify(query);
  const search = useMemo(() => {
    const parsed = JSON.parse(queryKey) as ProductQuery;
    return new URLSearchParams(
      Object.entries(parsed)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );
  }, [queryKey]);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${search.toString()}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setProducts(Array.isArray(data) ? data : data.data ?? []))
      .finally(() => setLoading(false));
  }, [search]);

  return { products, loading };
}
