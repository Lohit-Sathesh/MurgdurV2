'use client'
import { useCurrency } from '@/context/CurrencyContext'

export function PriceDisplay({
  price, comparePrice, size = 'sm',
}: {
  price: string | number
  comparePrice?: string | number | null
  size?: 'sm' | 'lg'
}) {
  const { format } = useCurrency()
  const original = Number(price)
  const compare = comparePrice ? Number(comparePrice) : null
  const onSale = compare !== null && compare > original

  const priceClass = size === 'lg' ? 'text-2xl tracking-wide' : 'text-sm'
  const compareClass = size === 'lg' ? 'text-lg' : 'text-xs'

  if (!onSale) {
    return <p className={`text-luxury-gold ${priceClass}`}>{format(original)}</p>
  }

  const discountPct = Math.round(((compare! - original) / compare!) * 100)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <p className={`text-luxury-gold ${priceClass}`}>{format(original)}</p>
      <p className={`text-luxury-muted line-through ${compareClass}`}>{format(compare!)}</p>
      <span className="text-amber-400 text-xs tracking-luxury">−{discountPct}%</span>
    </div>
  )
}
