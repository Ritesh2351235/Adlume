"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-center w-full py-6 px-4 fixed top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800/50 w-full max-w-4xl relative z-10">
        <div className="flex items-center">
          <motion.div
            className="flex items-center gap-2 mr-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text">
                Adlume
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: "Home", href: "/" },
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Dashboard", href: "/dashboard" }
          ].map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={item.href}
                className="text-sm text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-teal-500 rounded-full hover:from-purple-700 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="flex items-center p-2"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-gray-950 z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {[
                { name: "Home", href: "/" },
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
                { name: "Dashboard", href: "/dashboard" }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    href={item.href}
                    className="text-base text-gray-900 dark:text-gray-100 font-medium"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-white bg-gradient-to-r from-purple-600 to-teal-500 rounded-full hover:from-purple-700 hover:to-teal-600 transition-all duration-200 shadow-md"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }