'use client';
import { useEffect,useRef } from 'react';
import gsap from 'gsap';
const slides=['Material','Silhouette','Ritual'];
export function HeroSlider(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{if(!ref.current)return;const ctx=gsap.context(()=>{gsap.fromTo('[data-slide]',{y:24,opacity:0},{y:0,opacity:1,stagger:.16,duration:.9,ease:'power3.out'})},ref);return()=>ctx.revert()},[]);return <section ref={ref} className="grid min-h-screen bg-ink text-ivory md:grid-cols-2"><div className="flex flex-col justify-end p-6 pb-20 md:p-12"><p className="text-sm uppercase tracking-[0.26em] text-champagne">Season edit</p><h1 className="mt-5 max-w-xl font-serif text-6xl leading-none md:text-8xl">Quiet objects with presence.</h1></div><div className="grid content-end gap-3 bg-graphite p-6 pb-20 md:p-12">{slides.map((s)=><div data-slide key={s} className="border-b border-ivory/20 py-5 font-serif text-4xl">{s}</div>)}</div></section>}
