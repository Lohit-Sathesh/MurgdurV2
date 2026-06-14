import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.INTERNAL_API_URL ?? 'http://localhost:3001'}/auth/login`,
            { email: credentials?.email, password: credentials?.password }
          )
          // Backend wraps response in { success: true, data: {...} }
          const payload = res.data?.data ?? res.data
          if (payload?.accessToken) return payload
          return null
        } catch {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any
        token.accessToken  = u.accessToken
        token.refreshToken = u.refreshToken
        token.customerId   = u.customerId
        token.role         = u.user?.role ?? u.role
        token.firstName    = u.user?.firstName
        token.lastName     = u.user?.lastName
        token.email        = u.user?.email
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000
        return token
      }

      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      try {
        const res = await axios.post(
          `${process.env.INTERNAL_API_URL ?? 'http://localhost:3001'}/auth/refresh`,
          { refreshToken: token.refreshToken }
        )
        const payload = res.data?.data ?? res.data
        token.accessToken  = payload.accessToken
        token.refreshToken = payload.refreshToken
        token.role         = payload.user?.role ?? token.role
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000
      } catch {
        token.error = 'RefreshAccessTokenError'
      }
      return token
    },
    async session({ session, token }) {
      (session as any).accessToken      = token.accessToken
      ;(session as any).error           = token.error
      ;(session.user as any).customerId = token.customerId
      ;(session.user as any).role       = token.role
      ;(session.user as any).firstName  = token.firstName
      ;(session.user as any).lastName   = token.lastName
      if (token.email) session.user!.email = token.email as string
      return session
    },
  },
  pages:   { signIn: '/login' },
  session: { strategy: 'jwt' },
  secret:  process.env.NEXTAUTH_SECRET,
}