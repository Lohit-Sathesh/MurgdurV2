'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter()
  const [value, setValue] = useState(status)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: string) {
    setValue(newStatus)
    setLoading(true)
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <select value={value} disabled={loading} onChange={e => handleChange(e.target.value)}
      className="bg-luxury-black border border-luxury-gray text-luxury-white text-sm px-3 py-2 tracking-wide focus:border-luxury-gold outline-none">
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
