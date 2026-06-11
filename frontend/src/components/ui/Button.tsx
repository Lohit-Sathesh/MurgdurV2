import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export function Button({className,...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn('inline-flex min-h-11 items-center justify-center bg-ink px-6 text-sm uppercase tracking-[0.2em] text-ivory transition hover:bg-graphite',className)} {...props}/>}
