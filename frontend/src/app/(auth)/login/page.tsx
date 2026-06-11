import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
export default function LoginPage(){return <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6"><div><p className="text-sm uppercase tracking-[0.24em] text-champagne">Member access</p><h1 className="mt-3 font-serif text-4xl">Welcome back</h1></div><form className="space-y-4"><Input label="Email" type="email" name="email"/><Input label="Password" type="password" name="password"/><Button type="submit">Sign in</Button></form></section>}
