import type { Order } from '@/types/order';
import { Badge } from '@/components/ui/Badge';

export function OrderCard({ order }: { order: Order }) {
  return (
    <a href={`/orders/${order.id}`} className="grid gap-3 border border-mist p-5 transition hover:border-champagne md:grid-cols-[1fr_auto]">
      <div>
        <h3 className="font-serif text-2xl">{order.id}</h3>
        <p className="mt-1 text-sm text-graphite">{new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge>{order.paymentStatus}</Badge>
        <Badge>{order.status}</Badge>
      </div>
    </a>
  );
}
