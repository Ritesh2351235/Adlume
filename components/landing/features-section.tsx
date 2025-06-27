"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden z-10" style={{ backgroundColor: '#000000' }}>
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-indigo-500/30 text-white bg-transparent">
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4 text-white">
              Everything you need to create
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> amazing ads</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Adlume provides a comprehensive suite of tools to transform your product marketing.
              From AI-powered generation to professional editing, we&apos;ve got you covered.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <FeaturesSectionWithHoverEffects />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 border border-indigo-500/30 bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-lg font-light text-white">More features launching soon! We&apos;re constantly improving Adlume.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}