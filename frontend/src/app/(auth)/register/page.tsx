'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { OtpVerifyField } from '@/components/auth/OtpVerifyField'
import { api } from '@/lib/api'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/

export default function RegisterPage() {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace('/')
  }, [isLoading, isLoggedIn, router])

  const emailValid = EMAIL_REGEX.test(form.email)
  const phoneValid = form.phone === '' || PHONE_REGEX.test(form.phone)
  const phoneEntered = form.phone.trim().length > 0

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm(f => ({ ...f, [field]: value }))
      if (field === 'email') setEmailVerified(false)
      if (field === 'phone') setPhoneVerified(false)
    }
  }

  const canSubmit =
    form.firstName && form.lastName && emailValid && emailVerified &&
    form.password.length >= 8 &&
    (!phoneEntered || (phoneValid && phoneVerified))

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        ...(phoneEntered ? { phone: form.phone } : {}),
      })
      router.push('/login')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed')
      setLoading(false)
    }
  }

  if (isLoading || isLoggedIn) return null

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl tracking-luxury text-luxury-white text-center mb-12">
          Create Account
        </h1>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName} onChange={update('firstName')} />
            <Input label="Last Name" value={form.lastName} onChange={update('lastName')} />
          </div>

          <div className="space-y-2">
            <Input label="Email" type="email" value={form.email} onChange={update('email')}
              error={form.email && !emailValid ? 'Enter a valid email address' : undefined} />
            <OtpVerifyField identifier={form.email} purpose="email" valid={emailValid}
              verified={emailVerified} onVerifiedChange={setEmailVerified} />
          </div>

          <div className="space-y-2">
            <Input label="Phone (optional)" type="tel" value={form.phone} onChange={update('phone')}
              error={form.phone && !phoneValid ? 'Enter a valid phone number with country code' : undefined} />
            {phoneEntered && (
              <OtpVerifyField identifier={form.phone} purpose="phone" valid={phoneValid}
                verified={phoneVerified} onVerifiedChange={setPhoneVerified} />
            )}
          </div>

          <Input label="Password" type="password" value={form.password} onChange={update('password')}
            error={form.password && form.password.length < 8 ? 'Password must be at least 8 characters' : undefined} />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button onClick={handleSubmit} loading={loading} fullWidth disabled={!canSubmit}>Create Account</Button>
          <p className="text-luxury-muted text-center text-sm tracking-wide">
            Already have an account?{' '}
            <Link href="/login" className="text-luxury-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
