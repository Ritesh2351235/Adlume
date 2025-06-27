"use client";

import { useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <DashboardSidebar onLinkClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-3 md:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}