"use client";

import { useState, useEffect } from "react";
import { HeroSectionFuturistic } from "@/components/ui/hero-section-futuristic";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HeroSectionFuturistic
      title="✨ AI-Powered Content Creation"
      subtitle={{
        gradient: "Create Stunning",
        regular: "Video Ads in Seconds"
      }}
      description="Transform your ideas into professional video advertisements with the power of AI. No design experience needed."
      ctaText="Get Started Free"
      ctaHref="/auth/signup"
      secondaryCtaText="Watch Demo"
      secondaryCtaHref="/demo"
    />
  );
}