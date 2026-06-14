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
      <HeroSlider slides={heroSlides} />
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
        <h2 className="font-serif text-4xl tracking-luxury text-luxury-white mb-16 text-center">
          New Arrivals
        </h2>
        <ProductGrid products={newArrivals.slice(0, 4)} />
      </section>

      {/* Image / video animation */}
      {scrollSlides[0] && <ScrollGallery slides={[scrollSlides[0]]} />}

      {/* Cinematic scrubbing video */}
      <ScrollVideoPlayer videoUrl={videoSlide?.mediaUrl} />

      {/* Products again */}
      <section className="px-8 py-24 md:py-32">
        <h2 className="font-serif text-4xl tracking-luxury text-luxury-white mb-16 text-center">
          The Selection
        </h2>
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

      {/* Remaining image / video sections from admin */}
      {scrollSlides.length > 2 && <ScrollGallery slides={scrollSlides.slice(2)} />}
    </>
  )
}
