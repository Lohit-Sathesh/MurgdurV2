'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const STORAGE_KEY = 'murgdur_newsletter_subscribed'

interface NewsletterFormProps {
  inputClassName: string
  buttonClassName: string
  buttonLabel?: string
  layoutClassName: string
}

export function NewsletterForm({ inputClassName, buttonClassName, buttonLabel = 'Subscribe', layoutClassName }: NewsletterFormProps) {
  const { isLoggedIn, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (isLoggedIn) {
      api.get('/users/me')
        .then(res => setSubscribed(!!res.data?.newsletterSubscribed))
        .catch(() => {})
        .finally(() => setChecked(true))
    } else {
      setSubscribed(localStorage.getItem(STORAGE_KEY) === 'true')
      setChecked(true)
    }
  }, [isLoggedIn, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      await api.post('/newsletter/subscribe', { email })
      setStatus('success')
      setMessage('Thank you for subscribing! Check your inbox.')
      setEmail('')
      setSubscribed(true)
      if (!isLoggedIn) localStorage.setItem(STORAGE_KEY, 'true')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (!checked) return null

  if (subscribed || status === 'success') {
    return <p className="text-luxury-gold text-sm">{status === 'success' ? message : 'You are subscribed to the Murgdur Private List.'}</p>
  }

  return (
    <form onSubmit={handleSubmit} className={layoutClassName}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={inputClassName}
      />
      <button type="submit" disabled={status === 'loading'} className={buttonClassName}>
        {status === 'loading' ? 'Subscribing...' : buttonLabel}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2 w-full text-center">{message}</p>
      )}
    </form>
  )
}
