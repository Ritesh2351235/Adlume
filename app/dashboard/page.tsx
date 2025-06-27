"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Image, Sparkles, Clock, CreditCard, BookmarkIcon, Download, Play, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface DashboardStats {
  user: {
    credits: number;
    name: string;
    email: string;
  };
  ads: {
    total: number;
    completed: number;
    failed: number;
    successRate: number;
  };
  saved: number;
  lastGenerated: {
    date: string;
    status: string;
  } | null;
  recentAds: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
    prompt: string;
    url: string;
    createdAt: string;
    isSaved: boolean;
  }>;
}

function EmptyState({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
      <div className="rounded-full bg-muted p-2 md:p-3 mb-3 md:mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-base md:text-lg mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground max-w-sm px-4">{description}</p>
    </div>
  );
}

function RecentAdCard({ ad }: { ad: DashboardStats['recentAds'][0] }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 relative">
        {ad.type === 'VIDEO' ? (
          <video
            src={ad.url}
            className="w-full h-full object-cover"
            controls={false}
            preload="metadata"
            muted
          />
        ) : (
          <img
            src={ad.url}
            alt="Generated ad"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <CardContent className="p-3 md:p-4">
        <p className="text-xs md:text-sm font-medium line-clamp-2 mb-2">
          {ad.prompt}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(ad.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardStats();
    }
  }, [isLoaded, user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/dashboard-stats?userId=${encodeURIComponent(user!.id)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Error loading dashboard</p>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardStats} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatLastGenerated = () => {
    if (!stats.lastGenerated) return "Never";

    const date = new Date(stats.lastGenerated.date);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Welcome back, {stats.user.name || user.firstName || 'User'}! Here&apos;s your ad generation overview.
        </p>
        <Badge variant="secondary" className="mt-2 text-xs">
          {stats.user.credits > 0 ? `${stats.user.credits} Credits Available` : 'No Credits'}
        </Badge>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Available Credits</CardTitle>
            <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{stats.user.credits}</div>
            <p className="text-xs text-muted-foreground hidden md:block">
              Credits remaining for ad generation
            </p>
            <p className="text-xs text-muted-foreground md:hidden">
              Credits left
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Ads Generated</CardTitle>
            <Image className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{stats.ads.total}</div>
            <p className="text-xs text-muted-foreground mt-1 hidden md:block">
              {stats.ads.completed} completed, {stats.ads.failed} failed
            </p>
            <p className="text-xs text-muted-foreground mt-1 md:hidden">
              {stats.ads.completed} done
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Success Rate</CardTitle>
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {stats.ads.total > 0 ? `${stats.ads.successRate}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground mt-1 hidden md:block">
              {stats.ads.total > 0 ? 'Based on completed generations' : 'Generate ads to see metrics'}
            </p>
            <p className="text-xs text-muted-foreground mt-1 md:hidden">
              {stats.ads.total > 0 ? 'Success rate' : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Last Generated</CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{formatLastGenerated()}</div>
            <p className="text-xs text-muted-foreground mt-1 hidden md:block">
              {stats.lastGenerated?.status === 'COMPLETED' ? 'Successfully completed' :
                stats.lastGenerated?.status === 'FAILED' ? 'Generation failed' :
                  stats.lastGenerated?.status === 'PROCESSING' ? 'Currently processing' :
                    'No ads generated yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1 md:hidden">
              {stats.lastGenerated?.status === 'COMPLETED' ? 'Completed' :
                stats.lastGenerated?.status === 'FAILED' ? 'Failed' :
                  stats.lastGenerated?.status === 'PROCESSING' ? 'Processing' :
                    'Never'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="recent" className="text-xs md:text-sm">
              Recent ({stats.recentAds.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs md:text-sm">
              Saved ({stats.saved})
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white w-full sm:w-auto" asChild>
            <Link href="/dashboard/generate">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Generate New Ad</span>
              <span className="sm:hidden">Generate</span>
            </Link>
          </Button>
        </div>

        <TabsContent value="recent" className="mt-4 md:mt-6">
          {stats.recentAds.length === 0 ? (
            <EmptyState
              title="No ads generated yet"
              description="Create your first ad to see it here. Start by clicking the 'Generate New Ad' button."
              icon={<Image className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {stats.recentAds.map((ad) => (
                <RecentAdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-4 md:mt-6">
          {stats.saved === 0 ? (
            <EmptyState
              title="No saved ads yet"
              description="Save ads you like to see them here. Visit your generated ads and click the save button."
              icon={<BookmarkIcon className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />}
            />
          ) : (
            <div className="text-center py-6 md:py-8">
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                You have {stats.saved} saved ads.
              </p>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/dashboard/saved-assets">
                  View All Saved Assets
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}