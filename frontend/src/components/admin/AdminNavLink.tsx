'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link href={href}
      className={`px-3 py-2 -mx-3 transition-colors ${
        active
          ? 'text-luxury-gold border-l-2 border-luxury-gold bg-luxury-gold/5'
          : 'text-luxury-white border-l-2 border-transparent hover:text-luxury-gold'
      }`}>
      {label}
    </Link>
  )
}
