export interface ProductImage {
  id: string
  url: string
  altText: string | null
  sortOrder: number
  isVideo: boolean
}

export interface ProductVariant {
  id: string
  sku: string
  color: string | null
  colorHex: string | null
  size: string | null
  stock: number
  price: string | null
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  price: string
  comparePrice: string | null
  currency: string
  material: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  category: { id: string; name: string; slug: string }
}