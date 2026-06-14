'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const COLORS = ['Black', 'White', 'Camel', 'Navy', 'Burgundy', 'Charcoal', 'Gold']
const SIZES  = ['XS', 'S', 'M', 'L', 'XL', '46', '48', '50', '52', '54']

export function FilterSidebar() {
  const router = useRouter()
  const params = useSearchParams()
  const [minPrice, setMinPrice] = useState(params.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') ?? '')

  function setFilter(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    p.get(key) === value ? p.delete(key) : p.set(key, value)
    router.push(`?${p.toString()}`)
  }

  function applyPriceRange() {
    const p = new URLSearchParams(params.toString())
    minPrice ? p.set('minPrice', minPrice) : p.delete('minPrice')
    maxPrice ? p.set('maxPrice', maxPrice) : p.delete('maxPrice')
    router.push(`?${p.toString()}`)
  }

  return (
    <aside className="w-48 shrink-0 space-y-10">
      <div>
        <p className="text-luxury-white text-xs tracking-luxury uppercase mb-4">Color</p>
        <div className="space-y-2">
          {COLORS.map(c => (
            <button key={c} onClick={() => setFilter('color', c.toLowerCase())}
              className={`block text-xs tracking-wide transition-colors ${
                params.get('color') === c.toLowerCase()
                  ? 'text-luxury-gold' : 'text-luxury-muted hover:text-luxury-white'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-luxury-white text-xs tracking-luxury uppercase mb-4">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button key={s} onClick={() => setFilter('size', s)}
              className={`w-10 h-10 text-xs tracking-wide border transition-all ${
                params.get('size') === s
                  ? 'border-luxury-gold text-luxury-gold'
                  : 'border-luxury-gray text-luxury-muted hover:border-luxury-white hover:text-luxury-white'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-luxury-white text-xs tracking-luxury uppercase mb-4">Price (₹)</p>
        <div className="flex flex-col gap-2">
          <input type="number" min={0} value={minPrice} placeholder="Min"
            onChange={e => setMinPrice(e.target.value)} onBlur={applyPriceRange}
            onKeyDown={e => e.key === 'Enter' && applyPriceRange()}
            className="w-full bg-transparent border border-luxury-gray text-luxury-white text-xs px-2 py-2 focus:border-luxury-gold outline-none" />
          <input type="number" min={0} value={maxPrice} placeholder="Max"
            onChange={e => setMaxPrice(e.target.value)} onBlur={applyPriceRange}
            onKeyDown={e => e.key === 'Enter' && applyPriceRange()}
            className="w-full bg-transparent border border-luxury-gray text-luxury-white text-xs px-2 py-2 focus:border-luxury-gold outline-none" />
        </div>
      </div>
    </aside>
  )
}