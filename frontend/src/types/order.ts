import type { Product } from './product';

export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: string;
};
