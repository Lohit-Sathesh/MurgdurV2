import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LogoutButton } from '@/components/account/LogoutButton'
import { AdminNavLink } from '@/components/admin/AdminNavLink'
import { LayoutDashboard, Package, ShoppingBag, Image as ImageIcon, Users } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/catalog', label: 'Catalog', icon: ShoppingBag },
  { href: '/admin/homepage', label: 'Homepage', icon: ImageIcon },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const nav = user?.role === 'SUPPORT' ? NAV.filter(({ href }) => href === '/admin/orders') : NAV

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr] bg-luxury-black text-luxury-white">
      <aside className="border-r border-luxury-gray p-8 flex flex-col md:fixed md:h-screen md:w-[260px]">
        <Link href="/admin" className="font-serif text-2xl tracking-luxury text-luxury-gold hover:text-luxury-white transition-colors duration-500">
          MURGDUR
        </Link>
        <p className="text-luxury-muted text-xs tracking-luxury uppercase mt-1">Admin Console</p>

        <nav className="mt-12 flex flex-col gap-1 text-sm uppercase tracking-luxury">
          {nav.map(({ href, label, icon: Icon }) => (
            <AdminNavLink key={href} href={href} label={label} icon={<Icon className="w-4 h-4" />} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-luxury-gray space-y-3">
          {user && (
            <div className="mb-2">
              <p className="text-luxury-white text-sm">{user.name ?? user.email}</p>
              <p className="text-luxury-muted text-xs">{user.email}</p>
            </div>
          )}
          <Link href="/" className="block text-sm tracking-wide text-luxury-muted hover:text-luxury-gold transition-colors duration-300">
            Back to Site
          </Link>
          <LogoutButton className="block text-sm tracking-wide text-luxury-white hover:text-luxury-gold transition-colors duration-300" />
        </div>
      </aside>
      <div className="p-8 md:p-12 max-w-6xl md:col-start-2">{children}</div>
    </div>
  )
}
