import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error = new Error('Unknown error occurred');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if it's a retryable error (connection issues)
      if (error instanceof Error &&
        (error.message.includes('socket hang up') ||
          error.message.includes('Connection error') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT'))) {

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If it's not a retryable error, throw immediately
      throw error;
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const image = formData.get("image") as File;
    const mask = formData.get("mask") as File | null;
    const size = formData.get("size") as string;
    const background = formData.get("background") as string;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("[IMAGE_EDIT_ERROR] OpenAI API key is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Prepare the edit request parameters
    const editParams: any = {
      model: "gpt-image-1",
      image: image,
      prompt,
      size,
      background,
      n: 1,
      quality: "high"
    };

    // Add mask if provided
    if (mask) {
      editParams.mask = mask;
    }

    // Use retry logic for the OpenAI API call
    const response = await retryWithBackoff(async () => {
      return await openai.images.edit(editParams);
    });

    // gpt-image-1 always returns base64 encoded images
    if (response.data && response.data.length > 0 && response.data[0].b64_json) {
      return NextResponse.json({
        url: `data:image/png;base64,${response.data[0].b64_json}`
      });
    } else {
      throw new Error('No image data received from OpenAI');
    }

  } catch (error) {
    console.error("[IMAGE_EDIT_ERROR]", error);

    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('socket hang up') ||
        error.message.includes('Connection error')) {
        return NextResponse.json(
          { error: "Unable to connect to OpenAI API. Please check your internet connection and try again." },
          { status: 503 }
        );
      }

      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Please check your configuration." },
          { status: 401 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded. Please check your billing settings." },
          { status: 429 }
        );
      }

      if (error.message.includes('mask') || error.message.includes('dimensions')) {
        return NextResponse.json(
          { error: "Invalid mask or image dimensions. Please ensure the mask matches the image size." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to edit image. Please try again later." },
      { status: 500 }
    );
  }
}