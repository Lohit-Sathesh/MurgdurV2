'use client'
import { useCart } from '@/hooks/useCart'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { lenisStore } from '@/lib/lenis'
import { useCurrency } from '@/context/CurrencyContext'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total } = useCart()
  const { format } = useCurrency()

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (isOpen) {
      lenisStore.instance?.stop()
    } else {
      lenisStore.instance?.start()
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenisStore.instance?.start()
    }
  }, [isOpen])

  return (
    <>
      {isOpen && <div onClick={closeCart} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-luxury-black border-l border-luxury-gray z-50 transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-2xl tracking-luxury text-luxury-white">Shopping Bag</h2>
            <button onClick={closeCart} className="text-luxury-muted hover:text-luxury-white text-2xl">×</button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain space-y-6">
            {items.length === 0
              ? <p className="text-luxury-muted tracking-wide text-sm text-center pt-12">Your bag is empty</p>
              : items.map(item => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                  <div className="relative w-16 h-20 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-luxury-white text-sm tracking-wide">{item.name}</p>
                    <p className="text-luxury-muted text-xs mt-1">{item.color} · {item.size}</p>
                    <p className="text-luxury-gold text-sm mt-2">{format(item.price)}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-luxury-muted hover:text-luxury-white text-lg self-start">×</button>
                </div>
              ))
            }
          </div>
          {items.length > 0 && (
            <div className="border-t border-luxury-gray pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-luxury-muted tracking-luxury text-sm uppercase">Total</span>
                <span className="text-luxury-white font-serif text-xl">{format(total)}</span>
              </div>
              <Link href="/cart" onClick={closeCart}
                className="block w-full bg-luxury-gold text-luxury-black text-center py-3 tracking-luxury text-sm uppercase hover:bg-luxury-white transition-all">
                View Bag & Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}