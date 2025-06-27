"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const BILLING_PLANS = [
  {
    name: "Starter",
    price: 9,
    credits: 1000,
    description: "Perfect for trying out AI advertising",
    features: [
      "1,000 credits included",
      "AI image generation",
      "AI video generation",
      "Basic templates",
      "Email support",
      "No monthly commitment"
    ],
    popular: false,
    gradient: "from-gray-600 to-gray-800",
  },
  {
    name: "Professional",
    price: 18,
    credits: 2200,
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
    popular: true,
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    name: "Business",
    price: 34,
    credits: 4000,
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
    popular: false,
    gradient: "from-purple-600 to-pink-600",
  },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  // Fetch user credits
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return;

      try {
        setLoadingCredits(true);
        const response = await fetch(`/api/user-credits?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data.credits || 0);
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchUserCredits();
  }, [user]);

  const handleSelectPlan = async (planIndex: number) => {
    const plan = BILLING_PLANS[planIndex];
    const packageId = plan.name.toLowerCase();

    // Redirect to checkout page with selected package
    router.push(`/checkout?package=${packageId}`);
  };

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight mb-2">
            Billing & Credits
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Choose the perfect credit package for your advertising needs.
          </p>
        </motion.div>
      </div>

      {/* Current Credits Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 md:mb-8"
      >
        <Card className="p-4 md:p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-medium mb-1">Current Balance</h3>
              {loadingCredits ? (
                <p className="text-2xl md:text-3xl font-light text-indigo-400">Loading...</p>
              ) : (
                <p className="text-2xl md:text-3xl font-light text-indigo-400">{userCredits.toLocaleString()} credits</p>
              )}
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Approximately ${(userCredits * 0.01).toFixed(2)} worth of generations
              </p>
            </div>
            <div className="text-center sm:text-right">
              <CreditCard className="h-10 w-10 md:h-12 md:w-12 text-indigo-400 mb-2 mx-auto sm:mx-0" />
              <p className="text-xs md:text-sm text-muted-foreground">Active Plan</p>
              <p className="text-sm md:text-base font-medium">Pay as you go</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Credit Packages */}
      <div className="mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 md:mb-6"
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight mb-2">
            Credit Packages
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Purchase credits to power your AI generations. Credits never expire.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {BILLING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-2 md:px-3 py-1 text-xs">
                    Best Value
                  </Badge>
                </div>
              )}

              <Card
                className={`relative h-full p-4 md:p-6 transition-all duration-300 hover:scale-105 ${plan.popular
                  ? 'ring-2 ring-indigo-500/50 bg-gradient-to-br from-indigo-500/5 to-purple-500/5'
                  : 'hover:ring-1 hover:ring-border'
                  }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-lg`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-4 md:mb-6">
                    <div className="mb-2">
                      <h3 className="text-base md:text-lg lg:text-xl font-medium">{plan.name}</h3>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl md:text-3xl font-light">${plan.price}</span>
                      <span className="text-xs md:text-sm text-muted-foreground">one-time</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                      <span className="text-base md:text-lg font-medium text-indigo-400">{plan.credits.toLocaleString()} credits</span>
                      {plan.credits > 1000 && (
                        <Badge variant="secondary" className="text-xs">
                          +{Math.round(((plan.credits - (plan.price * 100)) / (plan.price * 100)) * 100)}% bonus
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 md:gap-3">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => handleSelectPlan(index)}
                    disabled={isLoading}
                    className={`w-full h-9 md:h-10 text-sm md:text-base transition-all duration-300 ${plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-gray-600'
                      }`}
                  >
                    {selectedPlan === index && isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Purchase {plan.name}</span>
                        <span className="sm:hidden">Buy ${plan.price}</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-4 md:p-6 bg-muted/30">
          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">How Credits Work</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-1 md:mb-2">Image Generation</h4>
              <p>Each AI-generated image costs 1-3 credits depending on quality and size settings.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1 md:mb-2">Video Generation</h4>
              <p>Video advertisements cost 5-15 credits based on length and quality preferences.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1 md:mb-2">No Expiration</h4>
              <p>Credits never expire and can be used anytime. Buy more as needed.</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 