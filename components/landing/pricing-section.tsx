"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PricingSection as PricingSectionComponent } from "@/components/ui/pricing-section";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export const ADLUME_TIERS = [
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
  },
];

export function PricingSection() {
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
    <section id="pricing" className="py-24 bg-black relative overflow-hidden z-10" style={{ backgroundColor: '#000000' }}>
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-indigo-500/30 text-white bg-transparent">
              Pricing Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4 text-white">
              Simple, transparent
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Purchase credits to power your AI generations. Credits never expire and can be used for any AI generation.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center items-center w-full"
        >
          <div className="grid w-full max-w-5xl gap-6 grid-cols-1 md:grid-cols-3">
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
                      Best Value
                    </Badge>
                  </div>
                )}

                <div className={`relative h-full p-8 bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden ${tier.popular ? 'scale-105 shadow-2xl ring-2 ring-indigo-500/50' : 'hover:scale-105'} transition-all duration-300`}>
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
                          <div className="h-5 w-5 rounded-full bg-green-400/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                          </div>
                          <span className="text-gray-300 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handlePurchase(tier.name)}
                      className={`w-full font-light py-3 px-6 rounded-md transition-all duration-300 ${tier.popular
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        }`}>
                      {tier.cta}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}