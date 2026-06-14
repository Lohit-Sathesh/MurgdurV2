'use client'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const { format } = useCurrency()

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-luxury-white">
      <h1 className="font-serif text-4xl tracking-luxury mb-8">Your bag is empty</h1>
      <Link href="/collections/men">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <h1 className="font-serif text-4xl tracking-luxury text-luxury-white mb-12">Shopping Bag</h1>
      <div className="space-y-8 mb-12">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantId}`}
            className="flex gap-6 border-b border-luxury-gray pb-8">
            <div className="relative w-24 h-32 shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg tracking-wide text-luxury-white">{item.name}</h3>
              {item.color && <p className="text-luxury-muted text-sm mt-1">{item.color} · {item.size}</p>}
              <div className="flex items-center gap-4 mt-4">
                <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                  className="w-8 h-8 border border-luxury-gray text-luxury-white hover:border-luxury-gold">−</button>
                <span className="text-luxury-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                  className="w-8 h-8 border border-luxury-gray text-luxury-white hover:border-luxury-gold">+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-luxury-gold">{format(item.price * item.quantity)}</p>
              <button onClick={() => removeItem(item.productId, item.variantId)}
                className="text-luxury-muted text-xs tracking-luxury mt-4 hover:text-luxury-white">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-luxury-gray pt-8 flex justify-between items-center">
        <div>
          <p className="text-luxury-muted text-sm tracking-luxury">Total</p>
          <p className="font-serif text-3xl text-luxury-white mt-1">
            {format(total)}
          </p>
        </div>
        <Link href="/checkout">
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  )
}