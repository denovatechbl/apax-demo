import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero-section'
import { TrustSection } from '@/components/landing/trust-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { MetalsSection } from '@/components/landing/metals-section'
import { LandingFooter } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <MetalsSection />
      <TrustSection />
      <LandingFooter />
    </main>
  )
}
