export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  media: string[];
};

export type ProductQuery = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc';
};
