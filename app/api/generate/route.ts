import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import Replicate from "replicate";
import { MODELS } from "@/lib/models";
import type { ModelKey } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 300;

function getVideoUrl(output: any) {
  return output?.video?.url || output?.url || output?.output?.url || output?.output?.[0] || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminPassword, model, prompt, imageUrl, motionUrl, duration = 5, aspectRatio = "9:16" } = body as {
      adminPassword: string;
      model: ModelKey;
      prompt: string;
      imageUrl?: string;
      motionUrl?: string;
      duration?: number;
      aspectRatio?: string;
    };

    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Password admin salah." }, { status: 401 });
    }

    const selected = MODELS[model];
    if (!selected) {
      return NextResponse.json({ error: "Model tidak ditemukan." }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt wajib diisi." }, { status: 400 });
    }

    if (selected.provider === "fal") {
      if (!process.env.FAL_KEY) return NextResponse.json({ error: "FAL_KEY belum diisi di Vercel Environment Variables." }, { status: 500 });
      fal.config({ credentials: process.env.FAL_KEY });

      const input: Record<string, any> = {
        prompt,
        duration,
        aspect_ratio: aspectRatio
      };
      if (imageUrl) input.image_url = imageUrl;
      if (motionUrl) input.video_url = motionUrl;

      const result = await fal.subscribe(selected.model, {
        input,
        logs: true
      });

      return NextResponse.json({ provider: "fal", model: selected.label, videoUrl: getVideoUrl(result.data), raw: result.data });
    }

    if (!process.env.REPLICATE_API_TOKEN) return NextResponse.json({ error: "REPLICATE_API_TOKEN belum diisi di Vercel Environment Variables." }, { status: 500 });
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const output = await replicate.run(selected.model as any, {
      input: {
        prompt,
        image: imageUrl || undefined,
        video: motionUrl || undefined,
        duration,
        aspect_ratio: aspectRatio
      }
    });

    return NextResponse.json({ provider: "replicate", model: selected.label, videoUrl: getVideoUrl(output), raw: output });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
