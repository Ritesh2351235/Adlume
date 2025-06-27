"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Check } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function FullScreenSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = form.watch("password");

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(values);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white font-light relative overflow-hidden">
      {/* Optimized Background - No WebGL */}
      <div className="absolute inset-0 bg-black">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black animate-pulse" />
        
        {/* Floating orbs - CSS only */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Back to home */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-light">Back to home</span>
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/image copy copy copy.png"
                alt="Adlume"
                className="w-10 h-10"
              />
              <span className="text-2xl font-light tracking-tight">Adlume</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-light tracking-tighter text-white">
                Join the future of
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> AI advertising</span>
              </h1>
              <p className="text-gray-300 font-light tracking-wide">
                Create your account and start generating stunning advertisements in seconds.
              </p>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 font-light">
            © 2024 Adlume. All rights reserved.
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile back button */}
            <div className="lg:hidden mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-light">Back to home</span>
              </Link>
            </div>

            {/* Form card */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light tracking-tighter text-white mb-2">Create Account</h2>
                <p className="text-gray-300 font-light">Join thousands of creators using AI to transform their marketing</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white font-light">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                        {...form.register("firstName")}
                      />
                    </div>
                    {form.formState.errors.firstName && (
                      <p className="text-red-400 text-sm font-light">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white font-light">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                        {...form.register("lastName")}
                      />
                    </div>
                    {form.formState.errors.lastName && (
                      <p className="text-red-400 text-sm font-light">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-light">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm font-light">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-light">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {password && (
                    <div className="space-y-2 mt-3">
                      <p className="text-sm text-gray-300 font-light">Password requirements:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {passwordChecks.map((check, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              check.valid ? 'bg-green-500' : 'bg-gray-600'
                            }`}>
                              {check.valid && <Check className="w-2 h-2 text-white" />}
                            </div>
                            <span className={`text-xs font-light ${
                              check.valid ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {form.formState.errors.password && (
                    <p className="text-red-400 text-sm font-light">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-light">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm font-light">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 mt-1"
                    {...form.register("agreeToTerms")}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-300 font-light leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {form.formState.errors.agreeToTerms && (
                  <p className="text-red-400 text-sm font-light">{form.formState.errors.agreeToTerms.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-white/90 font-light py-3 rounded-md transition-all shadow-lg"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-400 font-light">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-light"
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-light"
                  >
                    GitHub
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-300 font-light">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors font-light">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}