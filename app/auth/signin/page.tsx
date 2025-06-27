"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useSignIn, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, isLoaded } = useSignIn();
  const { setActive } = useClerk();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (userLoaded && user) {
      router.push("/dashboard");
    }
  }, [userLoaded, user, router]);

  // Show loading while checking authentication status
  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-light">Loading...</div>
      </div>
    );
  }

  // Don't render form if user is authenticated
  if (user) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError("");
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError("");

      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Sign in incomplete. Please try again.");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.errors?.[0]?.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

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
                Welcome back to the future of
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> advertising</span>
              </h1>
              <p className="text-gray-300 font-light tracking-wide">
                Sign in to continue creating stunning AI-powered advertisements.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-400 font-light">
            © 2024 Adlume. All rights reserved.
          </div>
        </div>

        {/* Right side - Sign in form */}
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
                <h2 className="text-3xl font-light tracking-tighter text-white mb-2">Sign In</h2>
                <p className="text-gray-300 font-light">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-red-400 text-sm font-light">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-light">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-light">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 font-light"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-white/90 font-light py-3 rounded-md transition-all shadow-lg"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
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
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-light"
                  >
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-light"
                    disabled
                  >
                    GitHub
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-300 font-light">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-light">
                      Sign up
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