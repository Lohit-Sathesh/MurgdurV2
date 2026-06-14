'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

export function AdminNavLink({ href, label, icon: Icon }: { href: string; label: string; icon?: LucideIcon }) {
  const pathname = usePathname()
  const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-r-full transition-all duration-300 ${
        active
          ? 'text-luxury-gold border-l-2 border-luxury-gold bg-luxury-gold/5'
          : 'text-luxury-white border-l-2 border-transparent hover:text-luxury-gold hover:bg-luxury-white/[0.03]'
      }`}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </Link>
  )
}
