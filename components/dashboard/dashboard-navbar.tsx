"use client";

import Link from "next/link";
import { BellIcon, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchCredits();
    }
  }, [isLoaded, user]);

  const fetchCredits = async () => {
    try {
      const response = await fetch(`/api/user-credits?userId=${encodeURIComponent(user!.id)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCredits(data.credits);
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="h-14 border-b bg-card px-3 md:px-4 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 hover:bg-muted"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="/image copy copy copy.png"
            alt="Adlume"
            className="w-6 h-6 md:w-8 md:h-8"
          />
          <span className="font-semibold text-sm md:text-base hidden sm:block">Adlume</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/generate"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Generate
          </Link>
          <Link
            href="/dashboard/video-ads"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Video Ads
          </Link>
          <Link
            href="/dashboard/mockups"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Mockups
          </Link>
          <Link
            href="/dashboard/billing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Billing
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Credits Display */}
        {isLoaded && user && credits !== null && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <CreditCard className="h-3 w-3" />
            <span className="hidden sm:inline">{credits} credits</span>
            <span className="sm:hidden">{credits}</span>
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 hover:bg-muted">
              <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 md:w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {isLoaded && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-7 w-7 md:h-8 md:w-8 rounded-full hover:bg-muted">
                <Avatar className="h-7 w-7 md:h-8 md:w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                  <AvatarFallback className="text-xs">
                    {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 md:w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}