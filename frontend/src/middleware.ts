import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export async function middleware(request: NextRequest){const p=request.nextUrl.pathname;const protectedPath=p.startsWith('/admin')||p.startsWith('/profile')||p.startsWith('/orders');if(!protectedPath)return NextResponse.next();const token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});if(!token){const login=new URL('/login',request.url);login.searchParams.set('callbackUrl',p);return NextResponse.redirect(login)}if(p.startsWith('/admin')&&token.role!=='admin')return NextResponse.redirect(new URL('/',request.url));return NextResponse.next()}
export const config={matcher:['/admin/:path*','/profile/:path*','/orders/:path*']};
