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
  price: string
  comparePrice: string | null
  isActive: boolean
  variants: Variant[]
}

export function ProductRow({ product }: { product: Product }) {
  const router = useRouter()
  const [price, setPrice] = useState(product.price)
  const [comparePrice, setComparePrice] = useState(product.comparePrice ?? '')
  const [isActive, setIsActive] = useState(product.isActive)
  const [variants, setVariants] = useState(product.variants)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)
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
        <td className="py-3 px-4">
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
