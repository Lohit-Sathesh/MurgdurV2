'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import type { HeroSlide } from './HeroSlider'

gsap.registerPlugin(ScrollTrigger)

export function ScrollGallery({ slides }: { slides: HeroSlide[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = containerRef.current?.querySelectorAll<HTMLElement>('.scroll-section')
    if (!sections?.length) return

    sections.forEach((section) => {
      const media = section.querySelector<HTMLElement>('.scroll-media')
      const text = section.querySelector<HTMLElement>('.scroll-text')

      if (media) {
        gsap.fromTo(media, { scale: 1.15 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (text) {
        gsap.fromTo(text, { opacity: 0, y: 60 }, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [slides.length])

  if (!slides.length) return null

  return (
    <div ref={containerRef}>
      {slides.map((slide, i) => (
        <div key={i} className="scroll-section relative h-[90vh] md:h-screen w-full overflow-hidden">
          {slide.mediaType === 'video' ? (
            <video
              src={slide.mediaUrl}
              autoPlay muted loop playsInline
              className="scroll-media absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="scroll-media absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.mediaUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-luxury-black/30" />
          <div className="scroll-text absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            {slide.subheading && (
              <p className="text-luxury-gold text-xs tracking-luxury uppercase mb-6">{slide.subheading}</p>
            )}
            <h2 className="font-serif text-5xl md:text-7xl tracking-luxury text-luxury-white mb-10">
              {slide.headline}
            </h2>
            {slide.linkUrl && (
              <Link href={slide.linkUrl}
                className="border border-luxury-white text-luxury-white text-xs tracking-luxury uppercase px-10 py-4 hover:bg-luxury-white hover:text-luxury-black transition-all duration-500">
                Discover
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
