import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedS3Url } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const userId = searchParams.get('userId');

    if (!assetId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: assetId, userId' },
        { status: 400 }
      );
    }

    // Get the saved asset and verify ownership
    const savedAsset = await prisma.savedAsset.findUnique({
      where: { id: assetId },
      include: {
        generatedAsset: {
          select: {
            type: true,
            prompt: true,
          }
        }
      }
    });

    if (!savedAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
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

    console.log('Downloading asset from S3:', savedAsset.s3Url);

    // Generate signed URL for private S3 access
    const signedUrl = await getSignedS3Url(savedAsset.s3Url);
    console.log('Using signed URL for download');

    // Fetch the asset from S3 using signed URL
    const response = await fetch(signedUrl);
    
    if (!response.ok) {
      console.error('S3 fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch asset from storage' },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine content type and filename
    const contentType = savedAsset.generatedAsset.type === 'VIDEO' 
      ? 'video/mp4' 
      : 'image/png';
    
    const extension = savedAsset.generatedAsset.type === 'VIDEO' ? 'mp4' : 'png';
    const date = new Date(savedAsset.createdAt).toISOString().split('T')[0];
    const filename = `adlume-${savedAsset.generatedAsset.type.toLowerCase()}-${date}.${extension}`;

    // Return the file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error downloading asset:', error);
    return NextResponse.json(
      { error: 'Failed to download asset', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 