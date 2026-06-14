import { HeroSlider } from '@/components/cinematic/HeroSlider'
import { ScrollVideoPlayer } from '@/components/cinematic/ScrollVideoPlayer'
import { ScrollGallery } from '@/components/cinematic/ScrollGallery'
import { EditorialSection } from '@/components/cinematic/EditorialSection'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { api } from '@/lib/api'
import type { HeroSlide } from '@/components/cinematic/HeroSlider'

export const revalidate = 30

async function getProducts(query: string) {
  try {
    const res = await api.get(`/products?${query}`)
    return res.data?.products ?? res.data ?? []
  } catch { return [] }
}

async function getHomepageSlides(): Promise<HeroSlide[]> {
  try {
    const res = await api.get('/homepage/slides')
    return res.data ?? []
  } catch { return [] }
}

export default async function HomePage() {
  const [newArrivals, featured, slides] = await Promise.all([
    getProducts('newArrivals=true&limit=8'),
    getProducts('featured=true&limit=8'),
    getHomepageSlides(),
  ])

  const heroSlides = slides.filter(s => (s.placement ?? 'hero') === 'hero')
  const scrollSlides = slides.filter(s => s.placement === 'scroll')
  const videoSlide = slides.find(s => s.mediaType === 'video')

  return (
    <>
      <div className="relative">
  <HeroSlider slides={heroSlides} />
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
</div>
      <section className="border-y border-luxury-gray bg-luxury-black py-4">
  <div className="max-w-7xl mx-auto px-8">
    <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm tracking-widest uppercase text-luxury-muted">
      <span>✓ Secure Payments</span>
      <span>✓ Enterprise Security</span>
      <span>✓ Worldwide Shipping</span>
      <span>✓ Premium Support</span>
      <span>✓ Luxury Craftsmanship</span>
    </div>
  </div>
</section>

      <section className="py-20 border-y border-luxury-gray">
  <div className="max-w-7xl mx-auto px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

      <div>
        <p className="text-4xl font-serif text-luxury-white">10K+</p>
        <p className="text-luxury-muted text-sm mt-2">
          Customers
        </p>
      </div>

      <div>
        <p className="text-4xl font-serif text-luxury-white">50+</p>
        <p className="text-luxury-muted text-sm mt-2">
          Countries
        </p>
      </div>

      <div>
        <p className="text-4xl font-serif text-luxury-white">99.9%</p>
        <p className="text-luxury-muted text-sm mt-2">
          Uptime
        </p>
      </div>

      <div>
        <p className="text-4xl font-serif text-luxury-white">24/7</p>
        <p className="text-luxury-muted text-sm mt-2">
          Support
        </p>
      </div>

    </div>
  </div>
</section>
      {/* Products */}
      <section className="px-8 py-24 md:py-32">
        <div className="text-center mb-16">
  <p className="text-luxury-gold uppercase tracking-[0.3em] text-xs mb-4">
    Latest Collection
  </p>

  <h2 className="font-serif text-5xl text-luxury-white mb-4">
    New Arrivals
  </h2>

  <div className="w-24 h-px bg-luxury-gold mx-auto"></div>
</div>
        <ProductGrid products={newArrivals.slice(0, 4)} />
      </section>

      {/* Image / video animation */}
      {scrollSlides[0] && <ScrollGallery slides={[scrollSlides[0]]} />}

      {/* Cinematic scrubbing video */}
      <ScrollVideoPlayer videoUrl={videoSlide?.mediaUrl} />

      {/* Products again */}
      <section className="px-8 py-24 md:py-32">
       <div className="text-center mb-16">
  <p className="text-luxury-gold uppercase tracking-[0.3em] text-xs mb-4">
    Curated Pieces
  </p>

  <h2 className="font-serif text-5xl text-luxury-white mb-4">
    The Selection
  </h2>

  <div className="w-24 h-px bg-luxury-gold mx-auto"></div>
</div>
        <ProductGrid products={(featured.length ? featured : newArrivals.slice(4, 8)).slice(0, 4)} />
      </section>

      {/* Image */}
      {scrollSlides[1] && <ScrollGallery slides={[scrollSlides[1]]} />}

      {/* Text / editorial */}
      <EditorialSection
        eyebrow="Maison Murgdur"
        heading="Crafted in silence, worn in confidence."
        body="Every piece begins as an idea refined over months — patterns cut by hand, fabrics chosen for how they age, not just how they arrive. This is design built to outlast the season it was made for."
        linkUrl="/collections/new-arrivals"
        linkLabel="Explore the Collection"
      />

      <section className="py-32 border-t border-b border-luxury-gray bg-gradient-to-b from-luxury-black to-[#111111]">
  <div className="max-w-5xl mx-auto px-8 text-center">

    <p className="text-luxury-gold uppercase tracking-[0.4em] text-xs mb-6">
      Philosophy
    </p>

    <h2 className="font-serif text-5xl text-luxury-white leading-tight mb-8">
      Crafted with patience.
      <br />
      Designed to endure.
    </h2>

    <p className="text-luxury-muted max-w-2xl mx-auto text-lg">
      True luxury is not rushed. Every detail, material,
      and finish is selected to create timeless pieces
      that remain relevant for years.
    </p>

  </div>
</section>
      {/* Remaining image / video sections from admin */}
      {scrollSlides.length > 2 && <ScrollGallery slides={scrollSlides.slice(2)} />}
      <section className="py-32 border-t border-luxury-gray bg-gradient-to-b from-[#111111] to-luxury-black">
  <div className="max-w-4xl mx-auto px-8 text-center">

    <p className="text-luxury-gold uppercase tracking-[0.3em] text-xs mb-4">
      Exclusive Access
    </p>

    <h2 className="font-serif text-5xl text-luxury-white mb-6">
      Join The Private List
    </h2>

    <p className="text-luxury-muted max-w-xl mx-auto mb-10">
      Receive early access to new collections, limited releases,
      private events, and curated editorial stories.
    </p>

    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <input
        type="email"
        placeholder="Your email address"
        className="bg-black/40 border border-luxury-gray px-6 py-4 min-w-[320px] text-luxury-white rounded-full focus:border-luxury-gold focus:outline-none transition-all duration-500"
      />

      <button
        className="px-8 py-4 border border-luxury-gold text-luxury-gold rounded-full hover:bg-luxury-gold hover:text-black transition-all duration-500"
      >
        Subscribe
      </button>
    </div>

  </div>
</section>
    </>
  )
}
