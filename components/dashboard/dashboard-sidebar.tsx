"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Image,
  Video,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Generate",
    href: "/dashboard/generate",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Video Ads",
    href: "/dashboard/video-ads",
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: "Saved Assets",
    href: "/dashboard/saved-assets",
    icon: <Archive className="h-5 w-5" />,
  },
  {
    title: "Mockups",
    href: "/dashboard/mockups",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: <CreditCard className="h-5 w-5" />,
  },
];



interface DashboardSidebarProps {
  onLinkClick?: () => void;
}

export function DashboardSidebar({ onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  const handleCollapseClick = () => {
    // On mobile (when onLinkClick is provided), close the sidebar instead of just collapsing
    if (onLinkClick) {
      onLinkClick();
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <aside
      className={cn(
        "bg-card border-r flex flex-col transition-all duration-300 shrink-0 h-full",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 py-4 flex flex-col gap-1 min-h-0 h-full">
        <div className="flex-1 px-2 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors min-h-[44px]",
                pathname === link.href
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.icon}
              {!collapsed && <span>{link.title}</span>}
            </Link>
          ))}
        </div>



        <div className="px-2 pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapseClick}
            className="w-full flex justify-center hover:bg-muted"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}