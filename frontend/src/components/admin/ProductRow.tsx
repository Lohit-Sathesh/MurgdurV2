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
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [material, setMaterial] = useState(product.material ?? '')
  const [categoryId, setCategoryId] = useState(product.categoryId)
  const [editError, setEditError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <>
      <tr className="border-b border-luxury-gray/50 last:border-0 hover:bg-luxury-white/[0.02] transition-colors">
        <td className="py-3 px-4 text-luxury-white">{product.name}</td>
        <td className="py-3 px-4 text-luxury-muted">{product.sku}</td>
        <td className="py-3 px-4">
          <input value={price} onChange={e => setPrice(e.target.value)} onBlur={savePrice}
            disabled={saving}
            className="w-24 bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none" />
        </td>
        <td className="py-3 px-4">
          <input value={comparePrice} onChange={e => setComparePrice(e.target.value)} onBlur={saveComparePrice}
            disabled={saving} placeholder="None"
            className="w-24 bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none" />
        </td>
        <td className="py-3 px-4">
          <input type="checkbox" checked={isActive} onChange={toggleActive} className="accent-luxury-gold w-4 h-4" />
        </td>
        <td className="py-3 px-4">
          {product.variants.length > 0 && (
            <button onClick={() => setExpanded(e => !e)} className="text-luxury-gold text-xs tracking-luxury uppercase hover:text-luxury-white">
              {expanded ? 'Hide' : 'Variants'} ({product.variants.length})
            </button>
          )}
        </td>
        <td className="py-3 px-4 space-x-3 whitespace-nowrap">
          <button onClick={() => setEditing(e => !e)}
            className="text-luxury-gold text-xs tracking-luxury uppercase hover:text-luxury-white">
            {editing ? 'Close' : 'Edit'}
          </button>
          <button onClick={deleteProduct} disabled={deleting}
            className="text-red-400 text-xs tracking-luxury uppercase hover:text-red-300 disabled:opacity-50">
            {deleting ? 'Removing…' : 'Remove'}
          </button>
        </td>
      </tr>
      {error && (
        <tr>
          <td colSpan={7} className="py-2 px-4 text-red-400 text-xs bg-luxury-gray/5">{error}</td>
        </tr>
      )}
      {editing && (
        <tr className="border-b border-luxury-gray/30 bg-luxury-gray/5">
          <td colSpan={7} className="py-4 px-4">
            <div className="grid grid-cols-2 gap-3 max-w-2xl">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
                className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none col-span-2" />
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none col-span-2">
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input value={material} onChange={e => setMaterial(e.target.value)} placeholder="Material"
                className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none col-span-2" />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3}
                className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none col-span-2" />
            </div>
            {editError && <p className="text-red-400 text-xs mt-2">{editError}</p>}
            <div className="mt-3">
              <button onClick={saveDetails} disabled={saving}
                className="text-luxury-gold text-xs tracking-luxury uppercase hover:text-luxury-white disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </td>
        </tr>
      )}
      {expanded && variants.map(v => (
        <tr key={v.id} className="border-b border-luxury-gray/30 bg-luxury-gray/5">
          <td className="py-2 px-4 pl-8 text-luxury-muted text-xs" colSpan={2}>
            {v.sku} {v.color && `· ${v.color}`} {v.size && `· ${v.size}`}
          </td>
          <td className="py-2 px-4 text-luxury-muted text-xs">Stock:</td>
          <td className="py-2 px-4" colSpan={4}>
            <input type="number" value={v.stock} min={0}
              onChange={e => updateStock(v.id, Number(e.target.value))}
              className="w-20 bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none" />
          </td>
        </tr>
      ))}
    </>
  )
}
