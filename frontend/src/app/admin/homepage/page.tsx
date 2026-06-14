'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

interface Slide {
  id: string
  mediaUrl: string
  mediaType: string
  placement: string
  headline: string
  subheading?: string | null
  linkUrl?: string | null
  sortOrder: number
  isActive: boolean
}

const EMPTY: Omit<Slide, 'id'> = {
  mediaUrl: '', mediaType: 'image', placement: 'hero', headline: '', subheading: '', linkUrl: '', sortOrder: 0, isActive: true,
}

export default function AdminHomepagePage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<Omit<Slide, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/admin/homepage-slides')
      setSlides(res.data)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load slides.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

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
      setForm(f => ({ ...f, mediaUrl: res.data.url, mediaType: res.data.mediaType }))
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleCreate() {
    if (!form.mediaUrl || !form.headline) {
      setError('Please upload media and provide a headline.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await api.post('/admin/homepage-slides', form)
      setForm(EMPTY)
      await load()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create slide.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(slide: Slide) {
    await api.patch(`/admin/homepage-slides/${slide.id}`, { isActive: !slide.isActive })
    setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: !s.isActive } : s))
  }

  async function remove(id: string) {
    if (!confirm('Remove this slide? This cannot be undone.')) return
    await api.delete(`/admin/homepage-slides/${id}`)
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  return (
    <section>
      <h1 className="font-serif text-4xl tracking-luxury mb-10">Homepage Slides</h1>

      <div className="border border-dashed border-luxury-gray p-10 max-w-xl space-y-6 mb-16">
        <h2 className="text-luxury-gold text-xs tracking-luxury uppercase">Add New Slide</h2>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Media (Image or Video)</label>
          <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="text-luxury-white text-sm" />
          {uploading && <p className="text-luxury-muted text-xs mt-2">Uploading…</p>}
          {form.mediaUrl && (
            <div className="mt-4 w-full max-w-xs aspect-video border border-luxury-gray overflow-hidden">
              {form.mediaType === 'video' ? (
                <video src={form.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.mediaUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Placement</label>
          <select value={form.placement} onChange={e => setForm(f => ({ ...f, placement: e.target.value }))}
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none">
            <option value="hero">Hero Slider (top of homepage)</option>
            <option value="scroll">Scroll Section (cinematic, below hero)</option>
          </select>
        </div>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Headline</label>
          <input value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        </div>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Subheading</label>
          <input value={form.subheading ?? ''} onChange={e => setForm(f => ({ ...f, subheading: e.target.value }))}
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        </div>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Link URL</label>
          <input value={form.linkUrl ?? ''} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))}
            placeholder="/collections/noir-series"
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        </div>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button onClick={handleCreate} loading={saving}>Add Slide</Button>
      </div>

      <h2 className="font-serif text-2xl tracking-luxury mb-6">Current Slides</h2>
      {loading ? (
        <p className="text-luxury-muted text-sm">Loading…</p>
      ) : slides.length === 0 ? (
        <p className="text-luxury-muted text-sm">No slides configured. The homepage will use default slides.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slides.sort((a, b) => a.sortOrder - b.sortOrder).map(slide => (
            <div key={slide.id} className="space-y-2 border border-luxury-gray p-4">
              <div className="relative w-full aspect-video border border-luxury-gray overflow-hidden">
                {slide.mediaType === 'video' ? (
                  <video src={slide.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.mediaUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <p className="text-luxury-white text-sm">{slide.headline}</p>
              <p className="text-luxury-muted text-xs">{slide.subheading}</p>
              <p className="text-luxury-muted text-xs">Sort: {slide.sortOrder} · {slide.placement === 'scroll' ? 'Scroll Section' : 'Hero Slider'}</p>
              <div className="flex gap-4 pt-2">
                <button onClick={() => toggleActive(slide)}
                  className="text-xs tracking-luxury uppercase text-luxury-gold hover:text-luxury-white transition-colors">
                  {slide.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => remove(slide.id)}
                  className="text-xs tracking-luxury uppercase text-red-400 hover:text-red-300 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
