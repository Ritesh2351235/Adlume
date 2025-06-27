import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// S3 client configuration 
const s3Configured =
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_REGION &&
  process.env.AWS_BUCKET_NAME;

// Initialize S3 client only if credentials are available
const s3Client = s3Configured ? new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
}) : null;

// Bucket name
const bucketName = process.env.AWS_BUCKET_NAME || '';

// Ensure local uploads directory exists
const createLocalUploadDirs = (assetType: 'videos' | 'images') => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', assetType);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

/**
 * Upload a video or image to S3 from a URL (optimized for speed)
 * @param assetUrl URL of the asset to upload
 * @param assetType 'videos' or 'images'
 * @param userId User ID for folder organization
 * @returns Promise with the S3 URL or local URL
 */
export async function uploadAssetToS3(
  assetUrl: string,
  assetType: 'videos' | 'images',
  userId: string
): Promise<string> {
  try {
    console.log(`Processing ${assetType} from URL: ${assetUrl}`);

    // For base64 data URLs, extract the data directly without refetching
    if (assetUrl.startsWith('data:')) {
      const [metaPart, base64Data] = assetUrl.split(',');
      const contentType = metaPart.match(/data:(.+);base64/)?.[1] ||
        (assetType === 'videos' ? 'video/mp4' : 'image/png');

      const fileExtension = contentType.split('/')[1] ||
        (assetType === 'videos' ? 'mp4' : 'png');
      const fileName = `${uuidv4()}.${fileExtension}`;
      const assetBuffer = Buffer.from(base64Data, 'base64');

      // Upload directly to S3 or local storage without additional fetch
      return await uploadBuffer(assetBuffer, contentType, fileName, assetType, userId);
    }

    // For regular URLs, fetch with timeout and streaming for better performance
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(assetUrl, {
        signal: controller.signal,
        // Use streaming to avoid loading entire file into memory at once
        headers: { 'Accept': assetType === 'videos' ? 'video/*' : 'image/*' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') ||
        (assetType === 'videos' ? 'video/mp4' : 'image/png');

      const fileExtension = contentType.split('/')[1] ||
        (assetType === 'videos' ? 'mp4' : 'png');
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Convert stream to buffer efficiently
      const arrayBuffer = await response.arrayBuffer();
      const assetBuffer = Buffer.from(arrayBuffer);

      return await uploadBuffer(assetBuffer, contentType, fileName, assetType, userId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error(`Error uploading ${assetType}:`, error);
    throw new Error(`Failed to upload ${assetType}`);
  }
}

/**
 * Helper function to upload buffer to S3 or local storage
 */
async function uploadBuffer(
  assetBuffer: Buffer,
  contentType: string,
  fileName: string,
  assetType: 'videos' | 'images',
  userId: string
): Promise<string> {
  // If S3 is configured, try S3 upload
  if (s3Client && bucketName) {
    try {
      console.log('Attempting to upload to S3...');
      const s3Key = `${assetType}/${userId}/${fileName}`;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: assetBuffer,
        ContentType: contentType,
      });

      await s3Client.send(command);
      console.log('Successfully uploaded to S3');

      // Return the public URL
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (s3Error) {
      console.error('Error uploading to S3, falling back to local storage:', s3Error);
    }
  } else {
    console.log('S3 not configured, using local storage');
  }

  // Local file storage fallback
  console.log(`Using local file storage fallback for ${assetType}`);
  const uploadDir = createLocalUploadDirs(assetType);
  const localFilePath = path.join(uploadDir, fileName);

  fs.writeFileSync(localFilePath, new Uint8Array(assetBuffer));

  // Return local URL path
  return `/uploads/${assetType}/${fileName}`;
}

/**
 * Generate a signed URL for accessing a private S3 object
 * @param s3Url The S3 URL to generate a signed URL for
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 * @returns Promise with the signed URL or original URL if not S3
 */
export async function getSignedS3Url(s3Url: string, expiresIn: number = 3600): Promise<string> {
  try {
    // Check if it's an S3 URL and we have S3 configured
    if (!s3Url.includes('amazonaws.com') || !s3Client) {
      return s3Url; // Return original URL if not S3 or S3 not configured
    }

    // Extract the key from the URL
    const urlObj = new URL(s3Url);
    const key = urlObj.pathname.substring(1); // Remove leading '/'

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('Generated signed URL for:', key);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return s3Url; // Fallback to original URL
  }
}

/**
 * Delete an asset (from S3 or local filesystem)
 * @param assetUrl The URL of the asset to delete
 */
export async function deleteAssetFromS3(assetUrl: string): Promise<void> {
  try {
    // Check if it's an S3 URL
    if (assetUrl.includes('amazonaws.com') && s3Client) {
      // Extract the file key from the URL
      const urlObj = new URL(assetUrl);
      const key = urlObj.pathname.substring(1); // Remove leading '/'

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await s3Client.send(command);
      console.log('Successfully deleted from S3');
    }
    // Check if it's a local file
    else if (assetUrl.startsWith('/uploads/')) {
      const localFilePath = path.join(process.cwd(), 'public', assetUrl);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log('Successfully deleted local file');
      }
    }
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw new Error('Failed to delete asset');
  }
} 