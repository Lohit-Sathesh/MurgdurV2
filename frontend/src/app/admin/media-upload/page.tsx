'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

interface ProductImage {
  id: string
  url: string
  sortOrder: number
}

export default function MediaUploadPage() {
  const [sku, setSku] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ product: { name: string; sku: string }; images: any[] } | null>(null)

  const [removeSku, setRemoveSku] = useState('')
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [removeProduct, setRemoveProduct] = useState<{ name: string; sku: string } | null>(null)
  const [loadingImages, setLoadingImages] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  async function loadImages() {
    if (!removeSku) {
      setRemoveError('Please provide a product SKU.')
      return
    }
    setLoadingImages(true)
    setRemoveError(null)
    setExistingImages([])
    setRemoveProduct(null)
    try {
      const res = await api.get('/media/images', { params: { sku: removeSku } })
      setRemoveProduct(res.data.product)
      setExistingImages(res.data.images)
    } catch (err: any) {
      setRemoveError(err?.message ?? 'Failed to load images.')
    } finally {
      setLoadingImages(false)
    }
  }

  async function removeImage(imageId: string) {
    if (!confirm('Remove this image? This cannot be undone.')) return
    setRemovingId(imageId)
    setRemoveError(null)
    try {
      await api.delete(`/media/images/${imageId}`, { params: { sku: removeSku } })
      setExistingImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err: any) {
      setRemoveError(err?.message ?? 'Failed to remove image.')
    } finally {
      setRemovingId(null)
    }
  }

  async function handleSubmit() {
    if (!files.length || !sku) {
      setError('Please provide a product SKU and select at least one image.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('sku', sku)
      files.forEach(f => formData.append('files', f))
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': undefined },
      })
      setResult(res.data)
      setFiles([])
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1 className="font-serif text-4xl tracking-luxury mb-10">Media Upload</h1>

      <div className="border border-dashed border-luxury-gray p-10 max-w-xl space-y-6">
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Product SKU</label>
          <input value={sku} onChange={e => setSku(e.target.value)}
            placeholder="e.g. MRG-MEN-002"
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
          <p className="text-luxury-muted text-xs mt-2">Must match an existing product's SKU exactly. Images will be added to that product's gallery.</p>
        </div>
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Image Files</label>
          <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files ?? []))}
            className="text-luxury-white text-sm" />
          {files.length > 0 && <p className="text-luxury-muted text-xs mt-2">{files.length} file(s) selected</p>}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button onClick={handleSubmit} loading={loading}>Upload</Button>
      </div>

      {result && (
        <div className="mt-10 max-w-3xl">
          <p className="text-luxury-gold text-sm tracking-luxury uppercase mb-4">
            Added {result.images.length} image(s) to {result.product.name} ({result.product.sku})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.images.map((img) => (
              <div key={img.id} className="space-y-2">
                <div className="relative w-full aspect-[3/4] border border-luxury-gray overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.medium ?? img.url} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-luxury-muted text-xs break-all">{img.url}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-serif text-2xl tracking-luxury mt-16 mb-6">Remove Images</h2>
      <div className="border border-dashed border-luxury-gray p-10 max-w-xl space-y-6">
        <div>
          <label className="block text-luxury-muted text-xs uppercase tracking-luxury mb-2">Product SKU</label>
          <input value={removeSku} onChange={e => setRemoveSku(e.target.value)}
            placeholder="e.g. MRG-MEN-002"
            className="w-full bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 focus:border-luxury-gold outline-none" />
        </div>
        {removeError && <p className="text-red-400 text-sm">{removeError}</p>}
        <Button onClick={loadImages} loading={loadingImages}>Load Images</Button>
      </div>

      {removeProduct && (
        <div className="mt-8 max-w-3xl">
          <p className="text-luxury-gold text-sm tracking-luxury uppercase mb-4">
            {existingImages.length} image(s) for {removeProduct.name} ({removeProduct.sku})
          </p>
          {existingImages.length === 0 ? (
            <p className="text-luxury-muted text-sm">No images for this product.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {existingImages.map((img) => (
                <div key={img.id} className="space-y-2">
                  <div className="relative w-full aspect-[3/4] border border-luxury-gray overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-luxury-muted text-xs break-all">{img.url}</p>
                  <button onClick={() => removeImage(img.id)} disabled={removingId === img.id}
                    className="text-red-400 text-xs tracking-luxury uppercase hover:text-red-300 disabled:opacity-50">
                    {removingId === img.id ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
