'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, ChevronDown, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

function CategoryNode({ category, onClose, depth = 0 }: { category: Category; onClose: () => void; depth?: number }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const hasChildren = !!category.children?.length

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (open) {
      gsap.to(el, { height: 'auto', duration: 0.5, ease: 'power2.out' })
    } else {
      gsap.to(el, { height: 0, duration: 0.4, ease: 'power2.in' })
    }
  }, [open])

  return (
    <div className="border-b border-luxury-gray/50">
      <div className="flex items-center justify-between">
        <Link href={`/collections/${category.slug}`} onClick={onClose}
          style={{ paddingLeft: depth * 16 }}
          className={`flex-1 block py-4 text-sm tracking-luxury uppercase transition-colors ${
            depth === 0 ? 'text-luxury-gold' : 'text-luxury-muted'
          } hover:text-luxury-gold`}>
          {category.name}
        </Link>
        {hasChildren && (
          <button onClick={() => setOpen(o => !o)} aria-label={`Toggle ${category.name} subcategories`}
            className="p-4 text-luxury-muted hover:text-luxury-gold transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && (
        <div ref={contentRef} style={{ height: 0, overflow: 'hidden' }}>
          {category.children!.map(child => (
            <CategoryNode key={child.id} category={child} onClose={onClose} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategoryDrawer({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const subPanelRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Category | null>(null)

  useEffect(() => {
    gsap.set(panelRef.current, { xPercent: -100 })
    gsap.set(subPanelRef.current, { xPercent: 100 })
    gsap.set(backdropRef.current, { opacity: 0 })
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    gsap.to(panelRef.current, { xPercent: 0, duration: 0.7, ease: 'power3.out' })
  }, [])

  function handleClose() {
    gsap.to(panelRef.current, { xPercent: -100, duration: 0.5, ease: 'power3.in' })
    gsap.to(subPanelRef.current, { xPercent: 100, duration: 0.5, ease: 'power3.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose })
  }

  function openSubPanel(cat: Category) {
    setActive(cat)
    gsap.fromTo(subPanelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: 'power3.out' })
  }

  function closeSubPanel() {
    gsap.to(subPanelRef.current, {
      xPercent: 100, duration: 0.5, ease: 'power3.inOut',
      onComplete: () => setActive(null),
    })
  }

  return (
    <div className="fixed inset-0 z-50">
      <div ref={backdropRef} onClick={handleClose} className="absolute inset-0 bg-luxury-black/70 backdrop-blur-sm" />
      <div ref={panelRef} className="absolute top-0 left-0 h-full w-full max-w-sm bg-luxury-black border-r border-luxury-gray overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="flex items-center justify-between px-8 h-20 border-b border-luxury-gray">
            <Link href="/" onClick={handleClose} className="font-serif text-xl tracking-luxury text-luxury-white">
              MURGDUR
            </Link>
            <button onClick={handleClose} aria-label="Close menu" className="text-luxury-white hover:text-luxury-gold transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="px-8 py-10 space-y-1">
            {categories.map(cat => (
              cat.children?.length ? (
                <button key={cat.id} onClick={() => openSubPanel(cat)}
                  className="w-full flex items-center justify-between py-4 border-b border-luxury-gray/50 group text-left">
                  <span className="text-luxury-white text-sm tracking-luxury uppercase group-hover:text-luxury-gold transition-colors">
                    {cat.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-luxury-muted group-hover:text-luxury-gold group-hover:translate-x-1 transition-all duration-300" />
                </button>
              ) : (
                <Link key={cat.id} href={`/collections/${cat.slug}`} onClick={handleClose}
                  className="block py-4 border-b border-luxury-gray/50 text-luxury-white text-sm tracking-luxury uppercase hover:text-luxury-gold transition-colors">
                  {cat.name}
                </Link>
              )
            ))}
          </nav>
        </div>

        {/* Sub-category flyout panel */}
        <div ref={subPanelRef} className="absolute inset-0 bg-luxury-black overflow-y-auto">
          <div className="flex items-center gap-4 px-8 h-20 border-b border-luxury-gray">
            <button onClick={closeSubPanel} aria-label="Back to categories"
              className="text-luxury-white hover:text-luxury-gold transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-serif text-xl tracking-luxury text-luxury-white uppercase">{active?.name}</span>
          </div>
          <nav className="px-8 py-10 space-y-1">
            {active?.children?.map(child => (
              <CategoryNode key={child.id} category={child} onClose={handleClose} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
