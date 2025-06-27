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

    // Get user data from our database
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        name: true,
        email: true,
      }
    });

    // If user doesn't exist in our database, return error
    // User should be synced automatically by the useUserSync hook
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please refresh the page.' },
        { status: 404 }
      );
    }

    // Get generated assets statistics
    const generatedAssetsStats = await prisma.generatedAsset.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true
      }
    });

    // Get total generated assets
    const totalGenerated = await prisma.generatedAsset.count({
      where: { userId }
    });

    // Get completed assets count
    const completedCount = generatedAssetsStats.find(stat => stat.status === 'COMPLETED')?._count.status || 0;
    const failedCount = generatedAssetsStats.find(stat => stat.status === 'FAILED')?._count.status || 0;
    
    // Calculate success rate
    const successRate = totalGenerated > 0 ? Math.round((completedCount / totalGenerated) * 100) : 0;

    // Get recent ads (last 6 completed ones)
    const recentAds = await prisma.generatedAsset.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        url: { not: null }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6,
      select: {
        id: true,
        type: true,
        prompt: true,
        url: true,
        createdAt: true,
        savedAsset: {
          select: {
            id: true
          }
        }
      }
    });

    // Generate signed URLs for recent ads
    const recentAdsWithSignedUrls = await Promise.all(
      recentAds.map(async (ad) => {
        const signedUrl = ad.url ? await getSignedS3Url(ad.url, 1800) : null; // 30 min expiry
        return {
          ...ad,
          url: signedUrl,
          isSaved: !!ad.savedAsset
        };
      })
    );

    // Get last generated asset
    const lastGenerated = await prisma.generatedAsset.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        status: true
      }
    });

    // Get saved assets count
    const savedAssetsCount = await prisma.savedAsset.count({
      where: { userId }
    });

    const stats = {
      user: {
        credits: user.credits,
        name: user.name,
        email: user.email
      },
      ads: {
        total: totalGenerated,
        completed: completedCount,
        failed: failedCount,
        successRate: successRate
      },
      saved: savedAssetsCount,
      lastGenerated: lastGenerated ? {
        date: lastGenerated.createdAt,
        status: lastGenerated.status
      } : null,
      recentAds: recentAdsWithSignedUrls
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 