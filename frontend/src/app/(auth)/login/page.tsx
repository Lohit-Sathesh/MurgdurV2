'use client'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace('/')
  }, [isLoading, isLoggedIn, router])

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email, password, redirect: false
    })
    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  if (isLoading || isLoggedIn) return null

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl tracking-luxury text-luxury-white text-center mb-12">
          Sign In
        </h1>
        <div className="space-y-6">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-400 text-sm tracking-wide">{error}</p>}
          <Button onClick={handleSubmit} loading={loading} fullWidth>
            Sign In
          </Button>
          <p className="text-luxury-muted text-center text-sm tracking-wide">
            No account?{' '}
            <Link href="/register" className="text-luxury-gold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}