'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, User, LogOut, ShoppingBag, Menu } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { SearchOverlay } from '@/components/ui/SearchOverlay'
import { CategoryDrawer } from '@/components/layout/CategoryDrawer'
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher'
import { api } from '@/lib/api'

export function Navbar() {
  const { data: session } = useSession()
  const { items, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  // Fetch categories — ONE useEffect, using api client only
  useEffect(() => {
    api.get('/products/categories')
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]))
  }, [])

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="bg-luxury-black border-b border-luxury-gray py-2 text-center">
  <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-luxury-gold">
    Complimentary Worldwide Shipping • Private Client Services • New Collection Available
  </p>
</div>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {menuOpen && <CategoryDrawer categories={categories} onClose={() => setMenuOpen(false)} />}
      <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
        scrolled ? 'bg-luxury-black/95 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-20 grid grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu"
              className="text-luxury-white hover:text-luxury-gold transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <Link href="/" className="text-center group">
  <div className="font-serif text-3xl tracking-[0.4em] text-luxury-white group-hover:text-luxury-gold transition-all duration-500">
    MURGDUR
  </div>

  <div className="text-[10px] uppercase tracking-[0.3em] text-luxury-muted mt-1">
    Maison Murgdur
  </div>
</Link>

          <div className="flex items-center justify-end gap-6">
            <button onClick={() => setSearchOpen(true)} aria-label="Search"
              className="text-luxury-white hover:text-luxury-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <CurrencySwitcher />
            {session
              ? <>
                  <Link href="/profile" aria-label="Account" className="text-luxury-white hover:text-luxury-gold transition-colors">
                    <User className="w-5 h-5" />
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} aria-label="Logout"
                    className="text-luxury-white hover:text-luxury-gold transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              : <Link href="/login" aria-label="Sign In" className="text-luxury-white hover:text-luxury-gold transition-colors">
                  <User className="w-5 h-5" />
                </Link>
            }
            <button onClick={openCart} aria-label="Bag"
              className="relative text-luxury-white hover:text-luxury-gold transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
