'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { currencyForCountry, formatPrice, type CurrencyCode } from '@/lib/currency'

const COOKIE_NAME = 'murgdur-currency'

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  format: (amountInINR: number | string) => string
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}`
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR')

  useEffect(() => {
    const saved = readCookie(COOKIE_NAME)
    if (saved === 'INR' || saved === 'USD' || saved === 'EUR') {
      setCurrencyState(saved)
      return
    }

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const detected = currencyForCountry(data?.country_code ?? 'IN')
        setCurrencyState(detected)
        writeCookie(COOKIE_NAME, detected)
      })
      .catch(() => {})
  }, [])

  function setCurrency(next: CurrencyCode) {
    setCurrencyState(next)
    writeCookie(COOKIE_NAME, next)
  }

  return (
    <CurrencyContext.Provider value={{
      currency, setCurrency,
      format: (amountInINR) => formatPrice(amountInINR, currency),
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
