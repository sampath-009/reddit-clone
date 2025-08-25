import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import Header from '@/components/Header'
import AppShell from '@/components/layout/AppShell'
import Hero from '@/components/Hero'
import StickyNav from '@/components/StickyNav'
import Showcase from '@/components/Showcase'
import CommunitiesSection from '@/components/CommunitiesSection'
import ParallaxGrid from '@/components/ParallaxGrid'
import FeaturesSection from '@/components/FeaturesSection'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Header />
      <Hero />
      <StickyNav />
      
      <AppShell right={<Sidebar />}>

      <section id="showcase" className="container py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Popular Posts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover trending content from our most active communities
          </p>
        </div>
        <Showcase />
      </section>

      <CommunitiesSection />

      <section id="features" className="container py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Interactive Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Experience the power of modern web interactions
          </p>
        </div>
        <ParallaxGrid />
      </section>

      </AppShell>
      <FeaturesSection />
    </SmoothScrollProvider>
  )
}
