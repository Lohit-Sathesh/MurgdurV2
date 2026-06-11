import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex items-center border border-champagne px-2.5 py-1 text-xs uppercase tracking-[0.16em] text-champagne', className)} {...props} />;
}
