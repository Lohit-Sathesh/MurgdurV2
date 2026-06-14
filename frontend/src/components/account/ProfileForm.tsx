'use client'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { OtpVerifyField } from '@/components/auth/OtpVerifyField'
import { api } from '@/lib/api'

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/

export function ProfileForm({ user }: { user: any }) {
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
  })
  const [originalPhone, setOriginalPhone] = useState(user?.phone ?? '')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(res => {
      setForm(f => ({ ...f, phone: res.data.phone ?? '' }))
      setOriginalPhone(res.data.phone ?? '')
      setPhoneVerified(!!res.data.phoneVerified)
    }).catch(() => {})
  }, [])

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm(f => ({ ...f, [field]: value }))
      if (field === 'phone' && value !== originalPhone) setPhoneVerified(false)
    }
  }

  const phoneValid = form.phone === '' || PHONE_REGEX.test(form.phone)
  const phoneChanged = form.phone !== originalPhone
  const phoneEntered = form.phone.trim().length > 0
  const canSave = phoneValid && (!phoneChanged || !phoneEntered || phoneVerified)

  async function handleSave() {
    setLoading(true)
    setError('')
    try {
      await api.patch('/users/me', form)
      setOriginalPhone(form.phone)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" value={form.firstName} onChange={update('firstName')} />
        <Input label="Last Name" value={form.lastName} onChange={update('lastName')} />
      </div>
      <div className="space-y-2">
        <Input label="Phone" type="tel" value={form.phone} onChange={update('phone')}
          error={form.phone && !phoneValid ? 'Enter a valid phone number with country code' : undefined} />
        {phoneChanged && phoneEntered && (
          <OtpVerifyField identifier={form.phone} purpose="phone" valid={phoneValid}
            verified={phoneVerified} onVerifiedChange={setPhoneVerified} />
        )}
        {!phoneChanged && phoneVerified && (
          <p className="text-xs tracking-luxury uppercase text-luxury-gold">✓ Phone verified</p>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button onClick={handleSave} loading={loading} disabled={!canSave}>
        {saved ? 'Saved' : 'Save Changes'}
      </Button>
    </div>
  )
}
