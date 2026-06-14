'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

interface CategoryOption {
  id: string
  label: string
}

interface VariantInput {
  sku: string
  color: string
  colorHex: string
  size: string
  stock: string
}

function emptyVariant(): VariantInput {
  return { sku: '', color: '', colorHex: '', size: '', stock: '' }
}

export function CreateProductForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', slug: '', sku: '', description: '', price: '', categoryId: categories[0]?.id ?? '',
  })
  const [variants, setVariants] = useState<VariantInput[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function updateVariant(index: number, field: keyof VariantInput, value: string) {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  function addVariant() {
    setVariants(prev => [...prev, emptyVariant()])
  }

  function removeVariant(index: number) {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const payload: any = { ...form, price: Number(form.price) }
      if (variants.length > 0) {
        payload.variants = variants.map(v => ({
          sku: v.sku,
          color: v.color || undefined,
          colorHex: v.colorHex || undefined,
          size: v.size || undefined,
          stock: Number(v.stock) || 0,
        }))
      }
      await api.post('/products', payload)
      setForm({ name: '', slug: '', sku: '', description: '', price: '', categoryId: categories[0]?.id ?? '' })
      setVariants([])
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create product.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return <Button variant="outline" onClick={() => setOpen(true)}>Add Product</Button>
  }

  return (
    <div className="border border-luxury-gray rounded-xl bg-luxury-white/[0.02] p-6 space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <input required placeholder="Name" value={form.name} onChange={e => update('name', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        <input required placeholder="Slug" value={form.slug} onChange={e => update('slug', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        <input required placeholder="SKU" value={form.sku} onChange={e => update('sku', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        <input required type="number" placeholder="Price" value={form.price} onChange={e => update('price', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        <select required value={form.categoryId} onChange={e => update('categoryId', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none col-span-2">
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <textarea required placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none col-span-2" rows={3} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-luxury-muted text-xs uppercase tracking-luxury">Variants (sizes, colors, stock)</h3>
          <button type="button" onClick={addVariant}
            className="text-luxury-gold text-xs tracking-luxury uppercase hover:text-luxury-white">
            + Add Variant
          </button>
        </div>
        {variants.length === 0 && (
          <p className="text-luxury-muted text-xs">No variants added. The product will be created without size/color options.</p>
        )}
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 items-center border border-luxury-gray/50 p-3">
            <input placeholder="Variant SKU" value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)}
              className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none" />
            <input placeholder="Size (e.g. M)" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)}
              className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none" />
            <input placeholder="Color (e.g. Black)" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)}
              className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 focus:border-luxury-gold outline-none" />
            <input type="color" value={v.colorHex || '#000000'} onChange={e => updateVariant(i, 'colorHex', e.target.value)}
              className="bg-luxury-black border border-luxury-gray h-9 w-full cursor-pointer" />
            <div className="flex gap-2">
              <input type="number" min={0} placeholder="Stock" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)}
                className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-2 py-1 w-full focus:border-luxury-gold outline-none" />
              <button type="button" onClick={() => removeVariant(i)}
                className="text-red-400 text-xs hover:text-red-300 px-2">✕</button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button onClick={submit} loading={loading}>Create</Button>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  )
}
