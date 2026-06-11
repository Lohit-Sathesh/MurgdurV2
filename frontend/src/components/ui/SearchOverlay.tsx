'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
export function SearchOverlay(){const[query,setQuery]=useState('');return <div className="fixed inset-0 z-50 hidden bg-ivory p-6"><label className="flex items-center gap-3 border-b border-mist py-4"><Search size={20}/><input value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full bg-transparent text-2xl outline-none" placeholder="Search collections"/></label></div>}
