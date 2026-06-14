import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProfileForm } from '@/components/account/ProfileForm'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-luxury mb-2">Profile</h1>
      <p className="text-luxury-muted text-sm tracking-luxury mb-12">
        Customer ID: {(session?.user as any)?.customerId}
      </p>
      <ProfileForm user={session?.user} />
    </div>
  )
}