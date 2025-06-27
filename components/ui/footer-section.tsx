"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-black border-t border-indigo-500/30 py-16 relative z-10" style={{ backgroundColor: '#000000' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/image copy copy copy.png"
                alt="Adlume"
                className="w-8 h-8"
              />
              <span className="text-xl font-medium text-white">Adlume</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Transform your product images into professional advertisements with AI-powered technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/generate" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  AI Image Generation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/video-ads" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Video Ads
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mockups" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Mockups
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-500/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-light">
            © 2024 Adlume. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="h-4 w-4" />
              <span className="font-light">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}