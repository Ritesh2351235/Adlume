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

          {/* Resources */}
          <div>
            <h3 className="font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-light">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm font-light">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm font-light">
                  Terms of Service
                </span>
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