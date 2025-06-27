"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

export function DashboardWelcome() {
  const [isVisible, setIsVisible] = useState(true);
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (!isVisible) return null;

  return (
    <Card className="border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{greeting}!</h2>
            </div>
            <p className="text-muted-foreground mt-1">
              Welcome to Adlume. Get started by generating your first ad or exploring the dashboard.
            </p>
            <div className="mt-4 flex gap-3">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                Generate Your First Ad
              </Button>
              <Button size="sm" variant="outline">
                Tour Dashboard
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}