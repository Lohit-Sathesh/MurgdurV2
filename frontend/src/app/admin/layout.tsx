import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LogoutButton } from '@/components/account/LogoutButton'
import { AdminNavLink } from '@/components/admin/AdminNavLink'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/catalog', label: 'Catalog' },
  { href: '/admin/homepage', label: 'Homepage' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/media-upload', label: 'Media' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const nav = user?.role === 'SUPPORT' ? NAV.filter(({ href }) => href === '/admin/orders') : NAV

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr] bg-luxury-black text-luxury-white">
      <aside className="border-r border-luxury-gray p-8 flex flex-col">
        <Link href="/admin" className="font-serif text-2xl tracking-luxury text-luxury-gold">
          MURGDUR
        </Link>
        <p className="text-luxury-muted text-xs tracking-luxury uppercase mt-1">Admin Console</p>

        <nav className="mt-12 flex flex-col gap-1 text-sm uppercase tracking-luxury">
          {nav.map(({ href, label }) => (
            <AdminNavLink key={href} href={href} label={label} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-luxury-gray space-y-3">
          {user && (
            <div className="mb-2">
              <p className="text-luxury-white text-sm">{user.name ?? user.email}</p>
              <p className="text-luxury-muted text-xs">{user.email}</p>
            </div>
          )}
          <Link href="/" className="block text-sm tracking-wide text-luxury-muted hover:text-luxury-gold transition-colors">
            Back to Site
          </Link>
          <LogoutButton className="block text-sm tracking-wide text-luxury-white hover:text-luxury-gold transition-colors" />
        </div>
      </aside>
      <div className="p-8 md:p-12 max-w-6xl">{children}</div>
    </div>
  )
}
