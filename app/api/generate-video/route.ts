import { NextResponse } from "next/server";
import Replicate from "replicate";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { calculateVideoCredits } from "@/lib/pricing";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
    const duration = parseInt(formData.get("duration") as string);
    const quality = formData.get("quality") as string;
    const aspectRatio = formData.get("aspectRatio") as string;
    const motionMode = formData.get("motionMode") as string;
    const style = formData.get("style") as string;
    const effect = formData.get("effect") as string;
    const productImage = formData.get("productImage") as File | null;
    const imageData = formData.get("imageData") as string | null;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Validate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("[VIDEO_GENERATION_ERROR] Replicate API token is not configured");
      return NextResponse.json(
        { error: "Replicate API token is not configured" },
        { status: 500 }
      );
    }

    // Prepare the input for Replicate
    const input: any = {
      prompt,
      quality,
      duration,
      aspect_ratio: aspectRatio,
      motion_mode: motionMode,
    };

    // Add style if not "None"
    if (style && style !== "None") {
      input.style = style;
    }

    // Add effect if not "None"
    if (effect && effect !== "None") {
      input.effect = effect;
    }

    // Handle image input
    if (productImage) {
      // Convert File to base64 data URL for Replicate
      const bytes = await productImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = productImage.type;
      input.image = `data:${mimeType};base64,${base64}`;
    } else if (imageData) {
      // Use the provided image data URL
      input.image = imageData;
    }

    console.log("Generating video with input:", { ...input, image: input.image ? "[IMAGE_DATA]" : undefined });

    // Run the Replicate model
    const output = await replicate.run("pixverse/pixverse-v4.5", { input });

    console.log("Video generation completed:", output);

    // The output should be a URL to the generated video
    const videoUrl = Array.isArray(output) ? output[0] : output;

    // Calculate credit cost for video generation based on options
    const creditsUsed = calculateVideoCredits(
      `${duration}s` as "5s" | "8s",
      quality as "360p" | "540p" | "720p" | "1080p",
      motionMode as "normal" | "smooth"
    ) || 30; // Fallback to 30 credits if calculation fails

    // Ensure user exists and save to database (optimized with parallel operations)
    const [user, generatedAsset] = await Promise.all([
      // User upsert and credit deduction
      prisma.user.upsert({
        where: { id: userId },
        update: {
          credits: {
            decrement: creditsUsed
          }
        },
        create: {
          id: userId,
          credits: Math.max(0, 10 - creditsUsed), // Default credits minus used credits
        },
      }),
      // Asset creation
      prisma.generatedAsset.create({
        data: {
          userId,
          type: "VIDEO",
          prompt,
          status: "COMPLETED",
          url: videoUrl,
          creditsUsed,
        },
      })
    ]);

    return NextResponse.json({
      videoUrl,
      generatedAssetId: generatedAsset.id,
      duration,
      quality,
      aspectRatio,
      motionMode,
      style,
      effect
    });

  } catch (error) {
    console.error("[VIDEO_GENERATION_ERROR]", error);

    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('API token')) {
        return NextResponse.json(
          { error: "Invalid Replicate API token. Please check your configuration." },
          { status: 401 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: "Replicate API quota exceeded. Please check your billing settings." },
          { status: 429 }
        );
      }

      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: "Video generation timed out. Please try again with a shorter duration." },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate video. Please try again later." },
      { status: 500 }
    );
  }
}