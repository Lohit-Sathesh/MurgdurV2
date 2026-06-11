'use client';
import { useEffect,useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function ScrollVideoPlayer(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{if(!ref.current)return;const ctx=gsap.context(()=>{gsap.to('[data-cinematic-panel]',{scale:.94,opacity:.86,scrollTrigger:{trigger:ref.current,start:'top bottom',end:'bottom top',scrub:true}})},ref);return()=>ctx.revert()},[]);return <section ref={ref} className="px-6 pb-section md:px-12"><div data-cinematic-panel className="mx-auto aspect-video max-w-6xl bg-ink p-8 text-ivory"><p className="text-sm uppercase tracking-[0.24em] text-champagne">Scroll film</p><h2 className="mt-5 max-w-xl font-serif text-5xl">Motion-led product storytelling.</h2></div></section>}
