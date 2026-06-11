'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function useSmoothScroll(){useEffect(()=>{const lenis=new Lenis();const raf=(time:number)=>{lenis.raf(time);ScrollTrigger.update();requestAnimationFrame(raf)};requestAnimationFrame(raf);return()=>lenis.destroy()},[])}
