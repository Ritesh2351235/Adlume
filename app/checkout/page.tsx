"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Sparkles, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const creditPackages = [
  {
    id: "starter",
    name: "Starter",
    credits: 1000,
    price: 9,
    description: "Perfect for getting started",
  },
  {
    id: "professional",
    name: "Professional",
    credits: 2200,
    price: 18,
    description: "22% bonus credits included",
    bonus: 200,
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    credits: 4000,
    price: 34,
    description: "33% bonus credits included",
    bonus: 1000,
  },
];

function CheckoutContent() {
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [creditsAdded, setCreditsAdded] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const packageId = searchParams.get("package") || "starter";
  const selectedPackage = creditPackages.find(pkg => pkg.id === packageId) || creditPackages[0];

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);

    try {
      // Check if promo code is valid
      if (promoCode.toUpperCase() === "BOLTJUDGES100") {
        // Add 100 credits to user's account
        const response = await fetch("/api/user-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credits: 100,
            action: "add",
            source: "promo_code",
            promoCode: promoCode.toUpperCase(),
          }),
        });

        if (response.ok) {
          setPromoApplied(true);
          setCreditsAdded(100);
          toast.success("🎉 Promo code applied! 100 credits added to your account!");
        } else {
          toast.error("Failed to apply promo code. Please try again.");
        }
      } else {
        toast.error("Invalid promo code. Please check and try again.");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply promo code. Please try again.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePurchase = () => {
    toast.info("Payment integration coming soon! We'll notify you when it's ready.");
  };

  return (
    <div className="min-h-screen bg-black text-white font-light relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black animate-pulse" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-light">Back to Dashboard</span>
              </Link>

              <div className="flex items-center gap-3">
                <img
                  src="/image copy copy copy.png"
                  alt="Adlume"
                  className="w-8 h-8"
                />
                <span className="text-xl font-light tracking-tight">Adlume</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-white mb-4">
              Complete Your
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> Purchase</span>
            </h1>
            <p className="text-gray-300 font-light text-lg max-w-2xl mx-auto">
              You&apos;re one step away from unlocking powerful AI-generated advertisements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Package Details */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-light text-2xl">
                    {selectedPackage.name} Package
                  </CardTitle>
                  {selectedPackage.popular && (
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-gray-300 font-light">
                  {selectedPackage.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between text-3xl font-light">
                  <span className="text-white">${selectedPackage.price}</span>
                  <span className="text-indigo-400">{selectedPackage.credits.toLocaleString()} credits</span>
                </div>

                {selectedPackage.bonus && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Gift className="h-4 w-4" />
                    <span className="font-light">+{selectedPackage.bonus} bonus credits included!</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-light mb-3">What you&apos;ll get:</h4>
                  <ul className="space-y-2 text-gray-300 font-light">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>{selectedPackage.credits.toLocaleString()} AI generation credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>High-quality image generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Video advertisement creation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Asset saving and management</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Promo Section */}
            <div className="space-y-6">
              {/* Payment Integration Notice */}
              <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/20 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white font-light flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 font-light mb-4">
                    We&apos;re currently working on integrating secure payment processing.
                    You&apos;ll be notified as soon as payments are available!
                  </p>
                  <Button
                    onClick={handlePurchase}
                    disabled
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-light opacity-50 cursor-not-allowed"
                  >
                    Payment Coming Soon
                  </Button>
                </CardContent>
              </Card>

              {/* Promo Code Section */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white font-light flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Have a Promo Code?
                  </CardTitle>
                  <CardDescription className="text-gray-300 font-light">
                    Enter your promo code to get free credits
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {promoApplied ? (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-white font-light text-xl mb-2">Promo Code Applied!</h3>
                      <p className="text-gray-300 font-light">
                        {creditsAdded} credits have been added to your account
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="promoCode" className="text-white font-light">
                          Promo Code
                        </Label>
                        <Input
                          id="promoCode"
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                        />
                      </div>

                      <Button
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo || !promoCode.trim()}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-light"
                      >
                        {isApplyingPromo ? "Applying..." : "Apply Promo Code"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Alternative Options */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="pt-6">
                  <p className="text-gray-300 font-light text-center mb-4">
                    Want to explore other packages?
                  </p>
                  <div className="flex gap-2">
                    <Link href="/pricing" className="flex-1">
                      <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 font-light">
                        View All Packages
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 font-light">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300 font-light">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}