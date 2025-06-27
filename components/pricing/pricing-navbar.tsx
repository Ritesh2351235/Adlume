"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PricingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/image copy copy copy.png"
              alt="Adlume"
              className="w-6 h-6"
            />
            <span className="text-xl font-light tracking-tight text-white">Adlume</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-light">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-white border-b border-indigo-400">
              Pricing
            </Link>
            <Link href="/#testimonials" className="text-white/70 hover:text-white transition-colors">
              Testimonials
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 font-light"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/95 font-light transition-all duration-300"
              asChild
            >
              <Link href="/auth/sign-in">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}