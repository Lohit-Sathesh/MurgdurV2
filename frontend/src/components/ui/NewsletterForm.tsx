'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface NewsletterFormProps {
  inputClassName: string
  buttonClassName: string
  buttonLabel?: string
  layoutClassName: string
}

export function NewsletterForm({ inputClassName, buttonClassName, buttonLabel = 'Subscribe', layoutClassName }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      await api.post('/newsletter/subscribe', { email })
      setStatus('success')
      setMessage('Thank you for subscribing! Check your inbox.')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return <p className="text-luxury-gold text-sm">{message}</p>
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
