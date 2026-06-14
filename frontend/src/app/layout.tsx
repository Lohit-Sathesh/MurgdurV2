import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { LocalizationPrompt } from '@/components/ui/LocalizationPrompt'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: { default: 'Murgdur', template: '%s | Murgdur' },
  description: 'Luxury fashion. Crafted for the extraordinary.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <CartDrawer />
          <LocalizationPrompt />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}