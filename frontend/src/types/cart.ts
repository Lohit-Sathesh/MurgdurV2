import type { Product } from './product';

export type CartItem = {
  productId: string;
  quantity: number;
  product?: Product;
};

export type CartState = {
  items: CartItem[];
  subtotal: number;
};
