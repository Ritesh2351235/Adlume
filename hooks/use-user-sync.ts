import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !isSynced && !isLoading) {
      syncUser();
    }
  }, [isLoaded, user, isSynced, isLoading]);

  const syncUser = async () => {
    try {
      setIsLoading(true);
      
      // Call the sync API to ensure user exists in our database
      const response = await fetch('/api/sync-user', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User sync result:', data.action);
        setIsSynced(true);
      } else {
        console.error('Failed to sync user:', response.statusText);
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSynced,
    isLoading,
    syncUser,
  };
} 