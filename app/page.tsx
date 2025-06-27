import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CtaSection } from '@/components/landing/cta-section';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { FooterSection } from '@/components/landing/footer-section';

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}