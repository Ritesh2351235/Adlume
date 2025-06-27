"use client";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, Sparkles, CreditCard, HelpCircle } from "lucide-react";

export function LandingNavbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Features",
      link: "#features",
      icon: <Sparkles className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Pricing",
      link: "/pricing",
      icon: <CreditCard className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "FAQ",
      link: "#faq",
      icon: <HelpCircle className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return <FloatingNav navItems={navItems} />;
}