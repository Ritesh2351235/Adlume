"use client";

import { SavedAssets } from '@/components/dashboard/saved-assets';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SavedAssetsPage() {
  const { user, isLoaded } = useUser();

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
        <p className="text-gray-600">Please sign in to view your saved assets.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved Assets</h1>
        <p className="text-gray-600">
          View and manage your saved generated content
        </p>
      </div>

      <SavedAssets userId={user.id} />
    </div>
  );
} 