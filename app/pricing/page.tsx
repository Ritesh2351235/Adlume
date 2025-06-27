"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Sparkles, Star, Rocket } from "lucide-react";
import { PricingNavbar } from "@/components/pricing/pricing-navbar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const ADLUME_TIERS = [
  {
    name: "Starter",
    price: {
      monthly: 9,
      yearly: 9,
    },
    description: "Perfect for trying out AI advertising",
    features: [
      "1,000 credits included",
      "AI image generation",
      "AI video generation",
      "Basic templates",
      "Email support",
      "No monthly commitment"
    ],
    cta: "Purchase Credits",
    popular: false,
    highlighted: false,
    gradient: "from-gray-600 to-gray-800",
  },
  {
    name: "Professional",
    price: {
      monthly: 18,
      yearly: 18,
    },
    description: "Great value for regular creators",
    features: [
      "2,200 credits included",
      "22% bonus credits",
      "AI image generation",
      "AI video generation",
      "Premium templates",
      "Priority support",
      "Advanced editing tools",
      "Custom branding"
    ],
    cta: "Purchase Credits",
    popular: true,
    highlighted: false,
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    name: "Business",
    price: {
      monthly: 34,
      yearly: 34,
    },
    description: "Maximum value for power users",
    features: [
      "4,000 credits included",
      "33% bonus credits",
      "All Professional features",
      "Bulk generation tools",
      "Team collaboration",
      "API access",
      "White-label exports",
      "Dedicated account manager"
    ],
    cta: "Purchase Credits",
    popular: false,
    highlighted: true,
    gradient: "from-purple-600 to-pink-600",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handlePurchase = (tierName: string) => {
    // Check if user is loaded and authenticated
    if (!isLoaded) {
      // Still loading, don't do anything yet
      return;
    }

    if (!user) {
      // User is not signed in, redirect to sign-in page
      router.push("/auth/signin");
      return;
    }

    // User is signed in, proceed to checkout
    const packageId = tierName.toLowerCase();
    router.push(`/checkout?package=${packageId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PricingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight tracking-tighter"
            >
              Simple, transparent
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                pricing
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
            >
              Purchase credits to power your AI generations. Credits never expire and can be used for any AI generation.
            </motion.p>


          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {ADLUME_TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card className={`relative h-full p-8 bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden ${tier.highlighted ? 'ring-2 ring-purple-500/50' : ''
                  } ${tier.popular ? 'scale-105 shadow-2xl' : 'hover:scale-105'} transition-all duration-300`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5`} />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-light text-white mb-2">{tier.name}</h3>
                      <p className="text-sm text-gray-400 font-light">{tier.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-light text-white">${tier.price.monthly}</span>
                        <span className="text-gray-400 font-light">one-time</span>
                      </div>
                      <p className="text-indigo-400 font-medium mt-1">
                        {tier.name === "Starter" && "1,000 credits"}
                        {tier.name === "Professional" && "2,200 credits (+22% bonus)"}
                        {tier.name === "Business" && "4,000 credits (+33% bonus)"}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handlePurchase(tier.name)}
                      className={`w-full font-light transition-all duration-300 ${tier.popular
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {tier.cta}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4 text-white">
              Frequently asked
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> questions</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Everything you need to know about our pricing and plans.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {[
              {
                question: "Can I change my plan at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "What happens if I exceed my monthly limit?",
                answer: "You'll receive a notification when you're close to your limit. You can either upgrade your plan or wait for the next billing cycle."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes, we offer a 7-day free trial for all paid plans. No credit card required to start your trial."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl">
                <h3 className="text-lg font-light text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300 font-light leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        {/* Background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight tracking-tighter">
              Ready to start creating
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                amazing ads?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              Join thousands of creators who&apos;ve already transformed their marketing with Adlume&apos;s AI technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="font-light text-base px-8 py-3 bg-white text-black hover:bg-white/95 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-md"
                asChild
              >
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Start Creating Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="font-light text-base px-8 py-3 bg-transparent border border-indigo-500/30 text-white hover:bg-indigo-500/10 transition-all duration-300 rounded-md"
                asChild
              >
                <Link href="#features">
                  View Examples
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}