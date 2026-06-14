import { ProductGrid } from '@/components/shop/ProductGrid'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { SortDropdown } from '@/components/shop/SortDropdown'
import { api } from '@/lib/api'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const res = await api.get('/products/categories')
    return res.data.flatMap((cat: any) => [
      { category: cat.slug },
      ...(cat.children?.map((c: any) => ({ category: c.slug })) ?? [])
    ])
  } catch { return [] }
}

export default async function CollectionPage({
  params, searchParams
}: {
  params: { category: string }
  searchParams: { sort?: string; color?: string; size?: string; minPrice?: string; maxPrice?: string }
}) {
  let products = []
  let categoryName = params.category
  let category: { name: string; description: string | null; imageUrl: string | null } | null = null

  try {
    const query = new URLSearchParams({
      category: params.category,
      ...(searchParams.sort     && { sort:     searchParams.sort }),
      ...(searchParams.color    && { color:    searchParams.color }),
      ...(searchParams.size     && { size:     searchParams.size }),
      ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
      ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
    })
    const res = await api.get(`/products?${query}`)
    products = res.data.products
    category = res.data.category ?? null
    categoryName = category?.name ?? params.category
  } catch {}

  return (
    <div>
      {category?.imageUrl && (
        <div className="relative w-full h-[50vh] md:h-[75vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.imageUrl} alt={categoryName} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-8 pt-16 md:pt-24 text-center">
        <h1 className="font-serif text-4xl md:text-6xl tracking-luxury text-luxury-white mb-6 capitalize">
          {categoryName}
        </h1>
        {category?.description && (
          <p className="text-luxury-muted text-sm md:text-base tracking-wide leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex gap-12">
          <FilterSidebar />
          <div className="flex-1">
            <div className="flex justify-end mb-8">
              <SortDropdown />
            </div>
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  )
}
