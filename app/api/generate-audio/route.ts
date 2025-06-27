import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, voice, model } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error("[AUDIO_GENERATION_ERROR] ElevenLabs API key is not configured");
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured" },
        { status: 500 }
      );
    }

    console.log("Generating audio with ElevenLabs:", { text, voice, model });

    // Map voice names to ElevenLabs voice IDs
    const voiceMap: { [key: string]: string } = {
      "Rachel": "21m00Tcm4TlvDq8ikWAM",
      "Drew": "29vD33N1CtxCmqQRPOHJ",
      "Clyde": "2EiwWnXFnvU5JabPnv8n",
      "Paul": "5Q0t7uMcjvnagumLfvZi",
      "Domi": "AZnzlk1XvdvUeBnXmlld",
      "Dave": "CYw3kZ02Hs0563khs1Fj",
      "Fin": "D38z5RcWu1voky8WS1ja",
      "Sarah": "EXAVITQu4vr4xnSDxMaL",
      "Antoni": "ErXwobaYiN019PkySvjV",
    };

    const voiceId = voiceMap[voice] || voiceMap["Rachel"];

    // Call ElevenLabs API directly
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: model || "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid ElevenLabs API key. Please check your configuration." },
          { status: 401 }
        );
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: "ElevenLabs API quota exceeded. Please check your billing settings." },
          { status: 429 }
        );
      }
      
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    console.log("Audio generation completed");

    return NextResponse.json({ 
      audioData: `data:audio/mpeg;base64,${audioBase64}`,
      duration: Math.ceil(text.length / 15), // Rough estimate: ~15 characters per second
    });
    
  } catch (error) {
    console.error("[AUDIO_GENERATION_ERROR]", error);
    
    return NextResponse.json(
      { error: "Failed to generate audio. Please try again later." },
      { status: 500 }
    );
  }
}