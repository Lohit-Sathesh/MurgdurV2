'use client'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/murgdur', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/murgdur', icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com/murgdur', icon: Twitter },
  { label: 'YouTube', href: 'https://youtube.com/@murgdur', icon: Youtube },
]

export function Footer() {
  const { isLoggedIn } = useAuth()

  return (
    <footer className="bg-luxury-black border-t border-luxury-gray mt-32 py-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
        <div>
          <p className="font-serif text-2xl tracking-luxury text-luxury-white mb-6">MURGDUR</p>
          <p className="text-luxury-muted text-xs leading-relaxed tracking-wide mb-6">
            Luxury fashion crafted for the extraordinary.
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="text-luxury-muted hover:text-luxury-gold transition-colors">
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        {[
          { title: 'Collections', links: [{ label: 'Men', href: '/collections/men' }, { label: 'Women', href: '/collections/women' }, { label: 'Bags', href: '/collections/bags' }] },
          {
            title: 'Account',
            links: [
              ...(isLoggedIn ? [] : [{ label: 'Sign In', href: '/login' }]),
              { label: 'Orders', href: '/orders' },
              { label: 'Wishlist', href: '/wishlist' },
            ],
          },
          { title: 'Support', links: [{ label: 'Contact', href: '/contact' }, { label: 'Shipping', href: '/shipping' }, { label: 'Returns', href: '/returns' }] },
          { title: 'Company', links: [{ label: 'About Us', href: '/about' }] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-luxury-white text-xs tracking-luxury uppercase mb-6">{col.title}</p>
            <div className="space-y-3">
              {col.links.map(l => (
                <Link key={l.href} href={l.href}
                  className="block text-luxury-muted text-xs tracking-wide hover:text-luxury-gold transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-luxury-gray text-center">
        <p className="text-luxury-muted text-xs tracking-luxury">© 2026 Murgdur. All rights reserved.</p>
      </div>
    </footer>
  )
}