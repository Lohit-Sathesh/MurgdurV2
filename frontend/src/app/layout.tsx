import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/styles/animations.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
export const metadata: Metadata = { title: 'Murgdur', description: 'Luxury commerce experience for modern collections.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Navbar/><main>{children}</main><Footer/><CartDrawer/></body></html>; }
