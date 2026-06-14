'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { AddressCard } from '@/components/account/AddressCard'
import { useCurrency } from '@/context/CurrencyContext'
import { api } from '@/lib/api'
import type { Address } from '@/types/user'

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { format } = useCurrency()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('COD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart')
      return
    }
    api.get('/users/me').then(res => {
      const addrs: Address[] = res.data?.addresses ?? []
      setAddresses(addrs)
      const def = addrs.find(a => a.isDefault) ?? addrs[0]
      if (def) setSelectedAddressId(def.id)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [items.length, router])

  const tax = total * 0.18
  const grandTotal = total + tax

  async function placeOrder() {
    if (!selectedAddressId) {
      setError('Please select a shipping address.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const orderRes = await api.post('/orders', {
        addressId: selectedAddressId,
        items: items.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        paymentMethod,
      })
      const order = orderRes.data

      if (paymentMethod === 'COD') {
        clearCart()
        router.push(`/orders/${order.id}`)
        return
      }

      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) {
        setError('Unable to load payment gateway. Please try Cash on Delivery instead.')
        setLoading(false)
        return
      }

      const payRes = await api.post('/payments/razorpay/order', { orderId: order.id })
      const { orderId: razorpayOrderId, amount, currency, keyId } = payRes.data

      if (!keyId) {
        setError('Online payment is not configured. Please use Cash on Delivery.')
        setLoading(false)
        return
      }

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Murgdur',
        description: `Order ${order.orderNumber}`,
        handler: async (response: any) => {
          try {
            await api.post('/payments/razorpay/verify', {
              orderId: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          } catch {}
          clearCart()
          router.push(`/orders/${order.id}`)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: '#D4AF37' },
      })
      rzp.open()
    } catch (err: any) {
      setError(err?.message ?? 'Failed to place order.')
      setLoading(false)
    }
  }

  if (!loaded) return null

  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <h1 className="font-serif text-4xl tracking-luxury text-luxury-white mb-12">Checkout</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-luxury-white tracking-luxury text-sm uppercase mb-4">Shipping Address</h2>
          {addresses.length === 0 ? (
            <div className="border border-luxury-gray p-6 text-luxury-muted">
              <p className="mb-4">You don&apos;t have any saved addresses yet.</p>
              <Link href="/addresses">
                <Button variant="outline">Add Address</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map(a => (
                <button key={a.id} onClick={() => setSelectedAddressId(a.id)} className="text-left">
                  <div className={`border p-1 transition-colors ${
                    selectedAddressId === a.id ? 'border-luxury-gold' : 'border-transparent'
                  }`}>
                    <AddressCard address={a} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-luxury-white tracking-luxury text-sm uppercase mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 border border-luxury-gray p-4 cursor-pointer hover:border-luxury-gold transition-colors">
              <input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')} />
              <span className="text-luxury-white text-sm tracking-wide">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 border border-luxury-gray p-4 cursor-pointer hover:border-luxury-gold transition-colors">
              <input type="radio" name="paymentMethod" checked={paymentMethod === 'RAZORPAY'}
                onChange={() => setPaymentMethod('RAZORPAY')} />
              <span className="text-luxury-white text-sm tracking-wide">Pay Online (Razorpay)</span>
            </label>
          </div>
        </section>

        <section className="space-y-2 border-t border-luxury-gray pt-6 max-w-xs ml-auto">
          <div className="flex justify-between text-sm">
            <span className="text-luxury-muted">Subtotal</span>
            <span className="text-luxury-white">{format(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-luxury-muted">Tax (18%)</span>
            <span className="text-luxury-white">{format(tax)}</span>
          </div>
          <div className="flex justify-between font-serif text-lg border-t border-luxury-gray pt-3 mt-3">
            <span className="text-luxury-white">Total</span>
            <span className="text-luxury-gold">{format(grandTotal)}</span>
          </div>
        </section>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button fullWidth onClick={placeOrder} loading={loading} disabled={addresses.length === 0}>
          Place Order
        </Button>
      </div>
    </div>
  )
}
