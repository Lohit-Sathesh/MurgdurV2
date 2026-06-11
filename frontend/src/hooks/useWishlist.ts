'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/types/product';

export function useWishlist() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`).then((res) => res.ok ? res.json() : []).then((data) => {
      setProducts(Array.isArray(data) ? data.map((item) => item.product ?? item) : []);
    });
  }, []);

  const add = useCallback(async (productId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
  }, []);

  return { products, add };
}
