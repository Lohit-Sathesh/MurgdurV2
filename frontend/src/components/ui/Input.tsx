import type { InputHTMLAttributes } from 'react';
export function Input({label,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string}){return <label className="grid gap-2 text-sm uppercase tracking-[0.18em] text-graphite">{label}<input className="min-h-12 border border-mist bg-transparent px-4 text-base normal-case tracking-normal outline-none focus:border-champagne" {...props}/></label>}
