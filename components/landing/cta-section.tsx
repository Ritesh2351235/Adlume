"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 bg-black relative z-10 border-t border-purple-500/20" style={{ backgroundColor: '#000000' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Content Creation?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using Adlume to generate
              stunning video ads and content in minutes, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                asChild
              >
                <Link href="/auth/signup">
                  <span className="flex items-center gap-2">
                    Start Creating Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/10 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
                asChild
              >
                <Link href="/auth/signin">
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </Button>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}