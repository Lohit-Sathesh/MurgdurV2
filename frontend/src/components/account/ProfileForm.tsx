'use client';

import type { User } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ProfileForm({ user }: { user: User }) {
  return (
    <form className="grid max-w-xl gap-4">
      <Input label="Name" name="name" defaultValue={user.name || ''} />
      <Input label="Email" name="email" type="email" defaultValue={user.email} />
      <Button type="submit">Save profile</Button>
    </form>
  );
}
