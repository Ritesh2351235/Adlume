import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedS3Url } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    // Get all saved assets for the user
    const savedAssets = await prisma.savedAsset.findMany({
      where: {
        userId: userId
      },
      include: {
        generatedAsset: {
          select: {
            id: true,
            type: true,
            prompt: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Generate signed URLs for all assets so they can be displayed
    const savedAssetsWithSignedUrls = await Promise.all(
      savedAssets.map(async (asset) => {
        const signedUrl = await getSignedS3Url(asset.s3Url, 3600); // 1 hour expiry
        return {
          ...asset,
          s3Url: signedUrl, // Replace with signed URL
          originalS3Url: asset.s3Url // Keep original for reference
        };
      })
    );

    return NextResponse.json({
      success: true,
      savedAssets: savedAssetsWithSignedUrls,
      count: savedAssetsWithSignedUrls.length
    });

  } catch (error) {
    console.error('Error fetching saved assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved assets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { savedAssetId, userId } = body;

    if (!savedAssetId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: savedAssetId, userId' },
        { status: 400 }
      );
    }

    // Get the saved asset to verify ownership
    const savedAsset = await prisma.savedAsset.findUnique({
      where: { id: savedAssetId }
    });

    if (!savedAsset) {
      return NextResponse.json(
        { error: 'Saved asset not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (savedAsset.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Asset does not belong to user' },
        { status: 403 }
      );
    }

    // Delete from database
    await prisma.savedAsset.delete({
      where: { id: savedAssetId }
    });

    // TODO: Optionally delete from S3 as well
    // await deleteAssetFromS3(savedAsset.s3Url);

    return NextResponse.json({
      success: true,
      message: 'Saved asset deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting saved asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved asset', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 