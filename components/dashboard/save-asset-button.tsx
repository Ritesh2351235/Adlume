"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';

interface SaveAssetButtonProps {
  generatedAssetId: string;
  userId?: string; // Make it optional since we'll get it from Clerk
  disabled?: boolean;
  onSaved?: () => void;
  className?: string;
}

export function SaveAssetButton({
  generatedAssetId,
  disabled = false,
  onSaved,
  className = ""
}: SaveAssetButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save assets',
        variant: 'destructive',
      });
      return;
    }

    // Handle the case where asset is still being generated
    if (generatedAssetId === "generating") {
      toast({
        title: 'Please wait',
        description: 'Asset is still being processed. Please try again in a moment.',
        variant: 'default',
      });
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('/api/save-asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generatedAssetId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaved(true);
        toast({
          title: 'Success',
          description: 'Asset saved successfully!',
        });
        onSaved?.();
      } else if (response.status === 409) {
        // Asset already saved
        setSaved(true);
        toast({
          title: 'Info',
          description: 'Asset is already saved',
        });
      } else {
        throw new Error(data.error || 'Failed to save asset');
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to save asset',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={disabled || saving || saved}
      variant={saved ? "default" : "outline"}
      size="sm"
      className={className}
    >
      {saved ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Saved
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save to Library'}
        </>
      )}
    </Button>
  );
} 