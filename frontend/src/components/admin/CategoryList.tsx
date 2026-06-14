'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

interface CategoryOption {
  id: string
  label: string
  slug: string
  description: string | null
  imageUrl: string | null
}

export function CategoryList({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function deleteCategory(id: string, label: string) {
    if (!confirm(`Remove category "${label}"? This cannot be undone.`)) return
    setRemovingId(id)
    setError(null)
    try {
      await api.delete(`/admin/categories/${id}`)
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete category.')
    } finally {
      setRemovingId(null)
    }
  }

  if (categories.length === 0) return null

  return (
    <div className="border border-luxury-gray p-6 max-w-xl space-y-3">
      <h2 className="text-xs uppercase tracking-luxury text-luxury-muted">Categories</h2>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <ul className="divide-y divide-luxury-gray/50">
        {categories.map(c => (
          <li key={c.id} className="py-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-luxury-white">{c.label}</span>
              <div className="flex gap-4">
                <button onClick={() => setEditingId(prev => prev === c.id ? null : c.id)}
                  className="text-luxury-gold text-xs tracking-luxury uppercase hover:text-luxury-white">
                  {editingId === c.id ? 'Close' : 'Edit'}
                </button>
                <button onClick={() => deleteCategory(c.id, c.label)} disabled={removingId === c.id}
                  className="text-red-400 text-xs tracking-luxury uppercase hover:text-red-300 disabled:opacity-50">
                  {removingId === c.id ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </div>
            {editingId === c.id && (
              <CategoryEditForm category={c} onDone={() => { setEditingId(null); router.refresh() }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CategoryEditForm({ category, onDone }: { category: CategoryOption; onDone: () => void }) {
  const [description, setDescription] = useState(category.description ?? '')
  const [imageUrl, setImageUrl] = useState(category.imageUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/media/upload-homepage', formData, {
        headers: { 'Content-Type': undefined },
      })
      setImageUrl(res.data.url)
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await api.patch(`/admin/categories/${category.id}`, { description, imageUrl })
      onDone()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 p-4 bg-luxury-white/[0.02] border border-luxury-gray space-y-4">
      <div>
        <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
          placeholder="A short luxury description for this category page…"
          className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
      </div>
      <div>
        <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Banner Image</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} className="text-luxury-white text-sm" />
        {uploading && <p className="text-luxury-muted text-xs mt-2">Uploading…</p>}
        {imageUrl && (
          <div className="mt-3 w-full max-w-xs aspect-[16/9] border border-luxury-gray overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button onClick={save} loading={saving}>Save</Button>
    </div>
  )
}
