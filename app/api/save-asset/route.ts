import { NextRequest, NextResponse } from 'next/server';
import { uploadAssetToS3 } from '@/lib/s3';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generatedAssetId, userId } = body;

    // Validate required fields  
    if (!generatedAssetId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: generatedAssetId, userId' },
        { status: 400 }
      );
    }

    // Handle placeholder asset ID from optimized API response
    if (generatedAssetId === "generating") {
      return NextResponse.json(
        { error: 'Asset is still being generated, please try again in a moment' },
        { status: 202 }
      );
    }

    // Get the generated asset from database
    const generatedAsset = await prisma.generatedAsset.findUnique({
      where: { id: generatedAssetId },
      include: { user: true }
    });

    if (!generatedAsset) {
      return NextResponse.json(
        { error: 'Generated asset not found' },
        { status: 404 }
      );
    }

    // Verify the asset belongs to the requesting user
    if (generatedAsset.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Asset does not belong to user' },
        { status: 403 }
      );
    }

    // Check if asset is already saved
    const existingSavedAsset = await prisma.savedAsset.findUnique({
      where: { generatedAssetId }
    });

    if (existingSavedAsset) {
      return NextResponse.json(
        { error: 'Asset is already saved', savedAsset: existingSavedAsset },
        { status: 409 }
      );
    }

    // Check if the generated asset has a URL
    if (!generatedAsset.url) {
      return NextResponse.json(
        { error: 'Generated asset does not have a URL' },
        { status: 400 }
      );
    }

    // Determine asset type for S3 upload
    const assetType = generatedAsset.type === 'VIDEO' ? 'videos' : 'images';

    // Upload to S3
    console.log(`Uploading ${assetType} to S3 for user ${userId}`);
    const s3Url = await uploadAssetToS3(generatedAsset.url, assetType, userId);

    // Save to database
    const savedAsset = await prisma.savedAsset.create({
      data: {
        userId,
        generatedAssetId,
        s3Url,
      },
      include: {
        generatedAsset: true,
        user: true
      }
    });

    return NextResponse.json({
      success: true,
      savedAsset,
      message: 'Asset saved successfully'
    });

  } catch (error) {
    console.error('Error saving asset:', error);
    return NextResponse.json(
      { error: 'Failed to save asset', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 