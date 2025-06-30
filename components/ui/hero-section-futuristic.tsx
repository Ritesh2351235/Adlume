"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

interface HeroSectionFuturisticProps {
  title: string;
  subtitle: {
    regular: string;
    gradient: string;
  };
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function HeroSectionFuturistic({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: HeroSectionFuturisticProps) {
  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Spline 3D Background - Strictly contained within hero section */}
      <div className="absolute inset-0 w-full h-full z-0" style={{ height: '100vh' }}>
        <iframe
          src='https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW/'
          frameBorder='0'
          width='100%'
          height='100%'
          loading="lazy"
          className="w-full h-full"
          style={{
            border: 'none',
            background: 'transparent',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
            height: '100vh',
            maxHeight: '100vh',
            display: 'block'
          }}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 md:bg-black/20 z-10" />

      {/* Mobile-specific overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 md:hidden z-10" />

      {/* Bolt logo in top right corner */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-300"
        >
          <img
            src="/bolt.png"
            alt="Bolt Logo"
            className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain cursor-pointer"
          />
        </a>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto hero-content">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 md:px-6 py-1.5 md:py-2 text-white/90 text-xs md:text-sm font-light mb-6 md:mb-8 border border-white/20"
          >
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{title}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter mb-6 md:mb-8 leading-tight text-white px-2"
          >
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text animate-gradient bg-[length:200%_200%]">
              {subtitle.gradient}
            </span>
            <br />
            <span className="text-white">{subtitle.regular}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto font-light tracking-wide leading-relaxed px-4"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-16 px-4"
          >
            <Button
              size="lg"
              className="group bg-white text-black font-light rounded-md px-6 md:px-8 py-3 md:py-4 hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl text-sm md:text-base"
              asChild
            >
              <Link href={ctaHref}>
                <span className="flex items-center gap-2">
                  {ctaText}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </Button>

            {secondaryCtaText && secondaryCtaHref && (
              <Button
                variant="outline"
                size="lg"
                className="group bg-transparent border border-indigo-500/30 text-white rounded-md px-6 md:px-8 py-3 md:py-4 hover:bg-indigo-500/10 transition-all duration-300 text-sm md:text-base"
                asChild
              >
                <Link href={secondaryCtaHref}>
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {secondaryCtaText}
                  </span>
                </Link>
              </Button>
            )}
          </motion.div>


        </div>
      </div>

      {/* Bottom border to clearly separate hero from other sections */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black z-21" />
    </section>
  );
}