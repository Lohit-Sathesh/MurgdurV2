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
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-luxury-gold mb-4">
              Private Access
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-black/40 border border-luxury-gray px-4 py-3 text-sm text-luxury-white rounded-full flex-1 focus:border-luxury-gold focus:outline-none"
              />

              <button className="px-6 py-3 border border-luxury-gold text-luxury-gold rounded-full hover:bg-luxury-gold hover:text-black transition-all duration-500">
                Join
              </button>
            </div>
          </div>
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
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-luxury-gray">
  <h3 className="text-luxury-white text-xs tracking-luxury uppercase mb-4">
    Security & Monitoring
  </h3>

  <div className="flex flex-wrap gap-3">
    <span className="px-3 py-1 border border-luxury-gray rounded-full text-xs">
      NextAuth Security
    </span>

    <span className="px-3 py-1 border border-luxury-gray rounded-full text-xs">
      Rate Limiting
    </span>

    <span className="px-3 py-1 border border-luxury-gray rounded-full text-xs">
      Sentry Monitoring
    </span>
  </div>
</div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-luxury-gray text-center">
        <p className="text-luxury-muted text-xs tracking-luxury">© 2026 Murgdur. All rights reserved.</p>
      </div>
    </footer>
  )
}
