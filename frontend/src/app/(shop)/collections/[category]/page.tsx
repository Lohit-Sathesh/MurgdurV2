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
  let total = 0
  let categoryName = params.category
  let category: { name: string; description: string | null; imageUrl: string | null } | null = null

  const filterParams: Record<string, string | undefined> = {
    category: params.category,
    sort: searchParams.sort,
    color: searchParams.color,
    size: searchParams.size,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
  }

  try {
    const query = new URLSearchParams(
      Object.entries({ ...filterParams, limit: '24' }).filter(([, v]) => v) as [string, string][]
    )
    const res = await api.get(`/products?${query}`)
    products = res.data.products
    total = res.data.total ?? products.length
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
          <FilterSidebar category={params.category} />
          <div className="flex-1">
            <div className="flex justify-end mb-8">
              <SortDropdown />
            </div>
            <ProductGrid products={products} total={total} query={filterParams} />
          </div>
        </div>
      </div>
    </div>
  )
}
