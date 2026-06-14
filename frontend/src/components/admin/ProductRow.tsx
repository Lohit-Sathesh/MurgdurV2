'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface Variant {
  id: string
  sku: string
  color: string | null
  size: string | null
  stock: number
}

interface ProductImage {
  id: string
  url: string
  sortOrder: number
}

interface Product {
  id: string
  name: string
  sku: string
  description: string
  material: string | null
  categoryId: string
  price: string
  comparePrice: string | null
  isActive: boolean
  variants: Variant[]
  images: ProductImage[]
}

interface CategoryOption {
  id: string
  label: string
}

export function ProductRow({ product, categories }: { product: Product; categories: CategoryOption[] }) {
  const router = useRouter()
  const [price, setPrice] = useState(product.price)
  const [comparePrice, setComparePrice] = useState(product.comparePrice ?? '')
  const [isActive, setIsActive] = useState(product.isActive)
  const [variants, setVariants] = useState(product.variants)
  const [images, setImages] = useState(product.images)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [material, setMaterial] = useState(product.material ?? '')
  const [categoryId, setCategoryId] = useState(product.categoryId)
  const [editError, setEditError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [removingImageId, setRemovingImageId] = useState<string | null>(null)

  async function savePrice() {
    setSaving(true)
    try {
      await api.patch(`/admin/products/${product.id}`, { price: Number(price) })
    } finally {
      setSaving(false)
    }
  }

  async function saveComparePrice() {
    setSaving(true)
    try {
      await api.patch(`/admin/products/${product.id}`, {
        comparePrice: comparePrice === '' ? null : Number(comparePrice),
      })
    } finally {
      setSaving(false)
    }
  }

  async function saveDetails() {
    setSaving(true)
    setEditError(null)
    try {
      await api.patch(`/admin/products/${product.id}`, { name, description, material: material || null, categoryId })
      router.refresh()
    } catch (err: any) {
      setEditError(err?.response?.data?.message ?? err?.message ?? 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive() {
    const next = !isActive
    setIsActive(next)
    await api.patch(`/admin/products/${product.id}`, { isActive: next })
  }

  async function updateStock(variantId: string, stock: number) {
    setVariants(prev => prev.map(v => v.id === variantId ? { ...v, stock } : v))
    await api.patch(`/admin/products/variants/${variantId}`, { stock })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setEditError(null)
    try {
      const formData = new FormData()
      formData.append('sku', product.sku)
      files.forEach(f => formData.append('files', f))
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': undefined },
      })
      const uploaded: ProductImage[] = res.data.images.map((img: any) => ({ id: img.id, url: img.url, sortOrder: img.sortOrder }))
      setImages(prev => [...prev, ...uploaded])
    } catch (err: any) {
      setEditError(err?.message ?? 'Image upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function removeImage(imageId: string) {
    if (!confirm('Remove this image? This cannot be undone.')) return
    setRemovingImageId(imageId)
    setEditError(null)
    try {
      await api.delete(`/media/images/${imageId}`, { params: { sku: product.sku } })
      setImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err: any) {
      setEditError(err?.message ?? 'Failed to remove image.')
    } finally {
      setRemovingImageId(null)
    }
  }

  async function deleteProduct() {
    if (!confirm(`Remove "${product.name}" from the catalog? This cannot be undone.`)) return
    setDeleting(true)
    setError(null)
    try {
      await api.delete(`/admin/products/${product.id}`)
      setDeleted(true)
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete product.')
    } finally {
      setDeleting(false)
    }
  }

  if (deleted) return null

  return (
    <div className="border border-luxury-gray rounded-xl bg-luxury-white/[0.02] hover:border-luxury-gold/40 transition-colors duration-300 overflow-hidden">
      <div className="flex flex-wrap items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-luxury-gray bg-luxury-black flex-shrink-0">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-luxury-muted text-[10px] uppercase tracking-luxury">No Image</div>
          )}
        </div>

        <div className="min-w-[160px] flex-1">
          <p className="text-luxury-white text-sm">{product.name}</p>
          <p className="text-luxury-muted text-xs mt-1">{product.sku}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-luxury-muted text-[10px] uppercase tracking-luxury">Price</label>
          <input value={price} onChange={e => setPrice(e.target.value)} onBlur={savePrice}
            disabled={saving}
            className="w-24 bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none transition-colors" />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-luxury-muted text-[10px] uppercase tracking-luxury">Compare</label>
          <input value={comparePrice} onChange={e => setComparePrice(e.target.value)} onBlur={saveComparePrice}
            disabled={saving} placeholder="None"
            className="w-24 bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none transition-colors" />
        </div>

        <label className="flex items-center gap-2 text-luxury-muted text-[10px] uppercase tracking-luxury cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={toggleActive} className="accent-luxury-gold w-4 h-4" />
          Active
        </label>

        {product.variants.length > 0 && (
          <span className="text-luxury-muted text-xs">{product.variants.length} variant{product.variants.length > 1 ? 's' : ''}</span>
        )}

        <div className="flex gap-3 ml-auto">
          <button onClick={() => setEditing(e => !e)}
            className="text-luxury-gold text-xs tracking-luxury uppercase hover:text-luxury-white transition-colors">
            {editing ? 'Close' : 'Edit'}
          </button>
          <button onClick={deleteProduct} disabled={deleting}
            className="text-red-400 text-xs tracking-luxury uppercase hover:text-red-300 disabled:opacity-50 transition-colors">
            {deleting ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>

      {error && <p className="px-4 pb-3 text-red-400 text-xs">{error}</p>}

      {editing && (
        <div className="border-t border-luxury-gray bg-luxury-black/30 p-4 md:p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
                  className="w-full bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none transition-colors">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Material</label>
                <input value={material} onChange={e => setMaterial(e.target.value)} placeholder="Material"
                  className="w-full bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4}
                  className="w-full bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none transition-colors" />
              </div>
              {editError && <p className="text-red-400 text-xs">{editError}</p>}
              <button onClick={saveDetails} disabled={saving}
                className="px-5 py-2 border border-luxury-gold text-luxury-gold text-xs tracking-luxury uppercase rounded-full hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Images</label>
                <div className="grid grid-cols-3 gap-3">
                  {images.map(img => (
                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-luxury-gray group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(img.id)} disabled={removingImageId === img.id}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 text-xs uppercase tracking-luxury transition-opacity">
                        {removingImageId === img.id ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border border-dashed border-luxury-gray flex items-center justify-center text-luxury-muted text-xs uppercase tracking-luxury cursor-pointer hover:border-luxury-gold hover:text-luxury-gold transition-colors text-center px-2">
                    {uploading ? 'Uploading…' : '+ Add Image'}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                </div>
              </div>

              {variants.length > 0 && (
                <div>
                  <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Variants & Stock</label>
                  <div className="space-y-2">
                    {variants.map(v => (
                      <div key={v.id} className="flex items-center justify-between gap-3 border border-luxury-gray rounded px-3 py-2">
                        <span className="text-luxury-muted text-xs">
                          {v.sku} {v.color && `· ${v.color}`} {v.size && `· ${v.size}`}
                        </span>
                        <input type="number" value={v.stock} min={0}
                          onChange={e => updateStock(v.id, Number(e.target.value))}
                          className="w-20 bg-luxury-black border border-luxury-gray rounded text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
