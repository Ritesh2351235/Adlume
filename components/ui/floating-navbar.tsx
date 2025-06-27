"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "floating-nav flex w-[95%] max-w-sm md:max-w-fit fixed top-3 md:top-6 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black/80 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-3 md:px-8 py-3 md:py-4 items-center justify-between md:justify-center md:space-x-4",
          className
        )}
      >
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <img
            src="/image copy copy copy.png"
            alt="Adlume"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <span className="text-white font-light text-sm md:text-lg tracking-tight">Adlume</span>
        </Link>

        {/* Navigation Items - Desktop Only */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link-${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-neutral-300 items-center flex space-x-1 hover:text-white transition-colors font-light px-2 py-1 rounded-lg hover:bg-white/10"
              )}
            >
              <span className="text-sm">{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/auth/signup"
          className="border text-xs md:text-sm font-light relative border-white/[0.2] text-white px-4 md:px-4 py-2 md:py-2 rounded-full bg-transparent hover:bg-white/10 transition-colors whitespace-nowrap flex-shrink-0 flex items-center justify-center"
        >
          <span className="hidden md:inline">Get Started</span>
          <span className="md:hidden">Get Started</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};