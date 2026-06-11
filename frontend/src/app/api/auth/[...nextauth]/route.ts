import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
const handler=NextAuth({session:{strategy:'jwt'},providers:[CredentialsProvider({name:'Credentials',credentials:{email:{label:'Email',type:'email'},password:{label:'Password',type:'password'}},async authorize(credentials){if(!credentials?.email||!credentials?.password)return null;return {id:credentials.email,email:credentials.email,name:'Murgdur Client',role:'client'} as any;}})],callbacks:{async jwt({token,user}){if(user)token.role=(user as any).role||'client';return token},async session({session,token}){(session.user as any).role=token.role;return session}}});
export { handler as GET, handler as POST };
