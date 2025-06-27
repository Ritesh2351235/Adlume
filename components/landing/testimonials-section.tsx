"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TestimonialsColumn, testimonials } from "@/components/ui/testimonials-columns-1";

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-black relative overflow-hidden z-10" style={{ backgroundColor: '#000000' }}>
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container z-10 mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 border-indigo-500/30 text-white bg-transparent">
            Customer Stories
          </Badge>

          <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-center mb-4 text-white">
            Loved by creators
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> worldwide</span>
          </h2>
          <p className="text-center text-xl text-gray-300 leading-relaxed font-light tracking-wide">
            Join thousands of businesses and creators who&apos;ve transformed their marketing with Adlume.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </motion.div>
      </div>
    </section>
  );
}