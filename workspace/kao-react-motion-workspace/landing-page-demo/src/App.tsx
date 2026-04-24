import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { LogoMarquee } from "@/components/landing/logo-marquee"
import { Features } from "@/components/landing/features"
import { HorizontalShowcase } from "@/components/landing/horizontal-showcase"
import { Stats } from "@/components/landing/stats"
import { Gallery } from "@/components/landing/gallery"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { ScrollProgress } from "@/components/landing/scroll-progress"

export function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <LogoMarquee />
        <Features />
        <HorizontalShowcase />
        <Stats />
        <Gallery />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
