import type { Address } from '@/types/user';
import { Badge } from '@/components/ui/Badge';

export function AddressCard({ address, primary = false }: { address: Address; primary?: boolean }) {
  return (
    <article className="border border-mist p-5">
      <div className="flex items-center justify-between gap-4">
        <strong>{address.city}</strong>
        {primary ? <Badge>Primary</Badge> : null}
      </div>
      <p className="mt-4 leading-7 text-graphite">{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.postal}<br />{address.country}</p>
    </article>
  );
}
