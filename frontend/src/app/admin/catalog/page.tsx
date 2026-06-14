import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { api } from '@/lib/api'
import { ProductRow } from '@/components/admin/ProductRow'
import { CreateProductForm } from '@/components/admin/CreateProductForm'
import { CreateCategoryForm } from '@/components/admin/CreateCategoryForm'
import { CategoryList } from '@/components/admin/CategoryList'

interface AdminProduct {
  id: string
  name: string
  sku: string
  description: string
  material: string | null
  categoryId: string
  price: string
  comparePrice: string | null
  isActive: boolean
  variants: Array<{ id: string; sku: string; color: string | null; size: string | null; stock: number }>
  images: Array<{ id: string; url: string; sortOrder: number }>
}

interface CategoryNode {
  id: string
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  children?: CategoryNode[]
}

interface FlatCategory {
  id: string
  label: string
  hasChildren: boolean
  slug: string
  description: string | null
  imageUrl: string | null
}

function flattenCategories(tree: CategoryNode[]): FlatCategory[] {
  const result: FlatCategory[] = []
  for (const node of tree) {
    const hasChildren = !!node.children?.length
    result.push({ id: node.id, label: node.name, hasChildren, slug: node.slug, description: node.description ?? null, imageUrl: node.imageUrl ?? null })
    for (const child of node.children ?? []) {
      const grandChildren = (child as CategoryNode).children ?? []
      result.push({ id: child.id, label: `${node.name} > ${child.name}`, hasChildren: grandChildren.length > 0, slug: child.slug, description: child.description ?? null, imageUrl: child.imageUrl ?? null })
      for (const grandChild of grandChildren) {
        result.push({ id: grandChild.id, label: `${node.name} > ${child.name} > ${grandChild.name}`, hasChildren: false, slug: grandChild.slug, description: grandChild.description ?? null, imageUrl: grandChild.imageUrl ?? null })
      }
    }
  }
  return result
}

export default async function CatalogAdminPage() {
  const session = await getServerSession(authOptions)
  const headers = { Authorization: `Bearer ${(session as any)?.accessToken}` }

  let products: AdminProduct[] = []
  let categoryTree: CategoryNode[] = []
  try {
    const res = await api.get('/admin/products', { headers })
    products = res.data ?? []
  } catch {}
  try {
    const res = await api.get('/products/categories')
    categoryTree = res.data ?? []
  } catch {}

  const flatCategories = flattenCategories(categoryTree)
  // Only leaf categories (no children) make sense as a product's category
  const productCategoryOptions = flatCategories.filter(c => !c.hasChildren)

  return (
    <section>
      <h1 className="font-serif text-4xl tracking-luxury mb-10">Catalog Management</h1>

      <div className="mb-8 flex flex-wrap gap-4">
        <CreateProductForm categories={productCategoryOptions} />
        <CreateCategoryForm categories={flatCategories} />
      </div>

      <div className="mb-8">
        <CategoryList categories={flatCategories} />
      </div>

      {products.length === 0 ? (
        <p className="text-luxury-muted border border-luxury-gray p-8 text-center">No products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map(p => <ProductRow key={p.id} product={p} categories={productCategoryOptions} />)}
        </div>
      )}
    </section>
  )
}
