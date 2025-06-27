import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { calculateCredits } from "@/lib/pricing";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error = new Error("Unknown error");

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
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const size = formData.get("size") as "1024x1024" | "1536x1024" | "1024x1536";
    const format = formData.get("format") as "png" | "jpeg" | "webp";
    const background = formData.get("background") as "auto" | "transparent" | "opaque";
    const quality = formData.get("quality") as "low" | "medium" | "high";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("[IMAGE_GENERATION_ERROR] OpenAI API key is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Use retry logic for the OpenAI API call
    const response = await retryWithBackoff(async () => {
      return await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size,
        output_format: format,
        background,
        n: 1,
        output_compression: 100,
        quality: quality || "high"
      });
    });

    // gpt-image-1 always returns base64 encoded images
    if (!response.data || !response.data[0]?.b64_json) {
      throw new Error("No image data received from OpenAI");
    }

    const imageUrl = `data:image/${format};base64,${response.data[0].b64_json}`;

    // Calculate credits required for this generation
    const creditsRequired = calculateCredits(quality, size);
    if (!creditsRequired) {
      return NextResponse.json(
        { error: "Invalid quality or size configuration" },
        { status: 400 }
      );
    }

    // Ensure user exists and save to database (optimized with parallel operations)
    const [user, generatedAsset] = await Promise.all([
      // User upsert
      prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          credits: 10, // Default credits for new users
        },
      }),
      // Asset creation
      prisma.generatedAsset.create({
        data: {
          userId,
          type: "IMAGE",
          prompt,
          status: "COMPLETED",
          url: imageUrl,
          creditsUsed: creditsRequired,
        },
      })
    ]);

    // Deduct credits from user
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: creditsRequired,
        },
      },
    });

    return NextResponse.json({
      url: imageUrl,
      generatedAssetId: generatedAsset.id
    });

  } catch (error) {
    console.error("[IMAGE_GENERATION_ERROR]", error);

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
    }

    return NextResponse.json(
      { error: "Failed to generate image. Please try again later." },
      { status: 500 }
    );
  }
}