'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

interface CategoryOption {
  id: string
  label: string
}

export function CreateCategoryForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', slug: '', parentId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      await api.post('/admin/categories', {
        name: form.name,
        slug: form.slug,
        parentId: form.parentId || undefined,
      })
      setForm({ name: '', slug: '', parentId: '' })
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create category.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return <Button variant="outline" onClick={() => setOpen(true)}>Add Category</Button>
  }

  return (
    <div className="border border-luxury-gray rounded-xl bg-luxury-white/[0.02] p-6 space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <input required placeholder="Name (e.g. Ready to Wear)" value={form.name} onChange={e => update('name', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        <input required placeholder="Slug (e.g. mens-ready-to-wear)" value={form.slug} onChange={e => update('slug', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        <select value={form.parentId} onChange={e => update('parentId', e.target.value)}
          className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none col-span-2">
          <option value="">No parent (top-level category)</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button onClick={submit} loading={loading}>Create</Button>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  )
}
