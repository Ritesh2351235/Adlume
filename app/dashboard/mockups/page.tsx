"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  User,
  UserCheck,
  Heart,
  Star,
  Briefcase,
  Clock,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";

const mockupModels = [
  {
    name: "Professional Business",
    type: "Corporate",
    icon: <Briefcase className="h-8 w-8" />,
    description: "Professional models in business attire for corporate products",
    popular: true,
  },
  {
    name: "Lifestyle Models",
    type: "Casual",
    icon: <Heart className="h-8 w-8" />,
    description: "Everyday people showcasing lifestyle and consumer products",
    popular: false,
  },
  {
    name: "Fashion Models",
    type: "Fashion",
    icon: <Star className="h-8 w-8" />,
    description: "High-fashion models for luxury and beauty products",
    popular: false,
  },
  {
    name: "Fitness Models",
    type: "Sports",
    icon: <UserCheck className="h-8 w-8" />,
    description: "Athletic models for sports and fitness products",
    popular: false,
  },
  {
    name: "Diverse Families",
    type: "Family",
    icon: <Users className="h-8 w-8" />,
    description: "Family groups for household and family products",
    popular: false,
  },
  {
    name: "Individual Portraits",
    type: "Portrait",
    icon: <User className="h-8 w-8" />,
    description: "Single model portraits for personal products",
    popular: false,
  },
];

export default function MockupsPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight">
              Product Mockups
            </h1>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
              Coming Soon
            </Badge>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Choose from various professional models to showcase your products in realistic scenarios.
          </p>
        </motion.div>
      </div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 md:p-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-light tracking-tight">
                Feature in Development
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                We&apos;re working hard to bring you an amazing mockup feature where you can showcase your products
                with professional models. Get ready to display your products being held, used, and presented by real people!
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-indigo-400">
              <Clock className="h-4 w-4" />
              <span>Expected release: Q2 2024</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preview Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight mb-2">
            Available Model Categories
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Preview of the professional models that will be available for showcasing your products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mockupModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative"
            >
              {model.popular && (
                <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-2 md:px-3 py-1 text-xs">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`relative h-full p-4 md:p-6 transition-all duration-300 hover:scale-105 opacity-60 ${model.popular
                ? 'ring-2 ring-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-purple-500/5'
                : 'hover:ring-1 hover:ring-border/50'
                }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                      {model.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg font-medium">{model.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {model.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-xs md:text-sm mb-4">
                    {model.description}
                  </CardDescription>

                  <Button
                    disabled
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white opacity-50 cursor-not-allowed"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-4 md:p-6 bg-muted/30">
          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">What to Expect</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-1 md:mb-2">Professional Models</h4>
              <p>Showcase your products with high-quality professional models in realistic scenarios.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1 md:mb-2">Diverse Categories</h4>
              <p>Choose from various model types including business, lifestyle, fashion, and fitness professionals.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1 md:mb-2">Easy Integration</h4>
              <p>Seamlessly integrate your products with professional models holding and using them naturally.</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Want to be notified when this feature launches?</p>
                <p className="text-xs text-muted-foreground">We&apos;ll send you an email as soon as product mockups with models are available.</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Notify Me</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 