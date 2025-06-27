"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Play, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedAsset {
  id: string;
  s3Url: string;
  createdAt: string;
  generatedAsset: {
    id: string;
    type: 'VIDEO' | 'IMAGE';
    prompt: string;
    createdAt: string;
  };
}

interface SavedAssetsProps {
  userId: string;
}

export function SavedAssets({ userId }: SavedAssetsProps) {
  const [savedAssets, setSavedAssets] = useState<SavedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedAssets();
  }, [userId]);

  const fetchSavedAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching saved assets for user:', userId);
      
      const response = await fetch(`/api/saved-assets?userId=${encodeURIComponent(userId)}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);

      if (data.success) {
        setSavedAssets(data.savedAssets);
        console.log('Set saved assets:', data.savedAssets.length);
        
        // Debug: Log all S3 URLs
        data.savedAssets.forEach((asset: SavedAsset, index: number) => {
          console.log(`Asset ${index + 1}:`, {
            id: asset.id,
            type: asset.generatedAsset.type,
            s3Url: asset.s3Url,
            prompt: asset.generatedAsset.prompt.substring(0, 30) + '...'
          });
        });
      } else {
        throw new Error(data.error || 'Failed to fetch saved assets');
      }
    } catch (error) {
      console.error('Error fetching saved assets:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: 'Error',
        description: 'Failed to load saved assets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (savedAssetId: string) => {
    if (!confirm('Are you sure you want to delete this saved asset?')) {
      return;
    }

    try {
      setDeleting(savedAssetId);
      const response = await fetch('/api/saved-assets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          savedAssetId,
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSavedAssets(prev => prev.filter(asset => asset.id !== savedAssetId));
        toast({
          title: 'Success',
          description: 'Asset deleted successfully',
        });
      } else {
        throw new Error(data.error || 'Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

    const handleDownload = async (asset: SavedAsset) => {
    try {
      console.log('Downloading asset:', asset.id);
      
      // Use the download API endpoint instead of direct S3 fetch
      const downloadUrl = `/api/download-asset?assetId=${encodeURIComponent(asset.id)}&userId=${encodeURIComponent(userId)}`;
      
      // Create a temporary link to trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Success',
        description: 'Asset download started',
      });
    } catch (error) {
      console.error('Error downloading asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to download asset',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Assets</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchSavedAssets} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Saved Assets
          <Badge variant="secondary">{savedAssets.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedAssets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No saved assets yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Generate some content and save your favorites!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedAssets.map((asset) => (
              <div
                key={asset.id}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                {/* Asset Preview */}
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                  {asset.generatedAsset.type === 'VIDEO' ? (
                    <video
                      src={asset.s3Url}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      onError={(e) => {
                        console.error('Video load error:', e);
                        console.error('Video URL:', asset.s3Url);
                      }}
                    />
                  ) : (
                    <img
                      src={asset.s3Url}
                      alt="Generated content"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        console.error('Image URL:', asset.s3Url);
                      }}
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant={asset.generatedAsset.type === 'VIDEO' ? 'default' : 'secondary'}>
                      {asset.generatedAsset.type === 'VIDEO' ? (
                        <Play className="w-3 h-3 mr-1" />
                      ) : (
                        <ImageIcon className="w-3 h-3 mr-1" />
                      )}
                      {asset.generatedAsset.type}
                    </Badge>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="space-y-2">
                  <p className="text-sm font-medium line-clamp-2">
                    {asset.generatedAsset.prompt}
                  </p>
                  <p className="text-xs text-gray-500">
                    Saved: {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(asset)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(asset.id)}
                    disabled={deleting === asset.id}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {deleting === asset.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 