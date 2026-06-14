'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import type { Address } from '@/types/user'

interface Props {
  address?: Address
  onSaved: () => void
  onCancel: () => void
}

export function AddressForm({ address, onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    label: address?.label ?? '',
    firstName: address?.firstName ?? '',
    lastName: address?.lastName ?? '',
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    postalCode: address?.postalCode ?? '',
    phone: address?.phone ?? '',
    isDefault: address?.isDefault ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      if (address) {
        await api.patch(`/users/me/addresses/${address.id}`, form)
      } else {
        await api.post('/users/me/addresses', form)
      }
      onSaved()
    } catch (e: any) {
      setError(e?.message || 'Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-luxury-gray p-6 space-y-4">
      <Input label="Label (e.g. Home, Work)" value={form.label} onChange={update('label')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" value={form.firstName} onChange={update('firstName')} />
        <Input label="Last Name" value={form.lastName} onChange={update('lastName')} />
      </div>
      <Input label="Address Line 1" value={form.line1} onChange={update('line1')} />
      <Input label="Address Line 2" value={form.line2} onChange={update('line2')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" value={form.city} onChange={update('city')} />
        <Input label="State" value={form.state} onChange={update('state')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Postal Code" value={form.postalCode} onChange={update('postalCode')} />
        <Input label="Phone" value={form.phone} onChange={update('phone')} />
      </div>
      <label className="flex items-center gap-2 text-sm text-luxury-muted tracking-wide">
        <input type="checkbox" checked={form.isDefault}
          onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} />
        Set as default address
      </label>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-4">
        <Button onClick={handleSubmit} loading={loading}>Save Address</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
