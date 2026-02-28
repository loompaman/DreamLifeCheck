import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const SCENARIO_PROMPTS: Record<string, { positive: string; negative: string }> = {
  jet: {
    positive:
      "person boarding a Gulfstream G700 private jet on a private airstrip at sunset in Dubai, luxury aviation, cinematic lighting, ultra realistic photography, 8k, professional",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd, commercial airplane",
  },
  ferrari: {
    positive:
      "person driving a Ferrari or Lamborghini supercar on a scenic coastal road, luxury supercar, cinematic photography, golden hour lighting, ultra-realistic, 8k, bokeh background",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, ugly, multiple people",
  },
  yacht: {
    positive:
      "person standing on the deck of a 200-foot luxury superyacht in Monaco harbour, Mediterranean sea, golden hour, ultra realistic photography, 8k, high fashion",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd, small boat",
  },
  monaco: {
    positive:
      "person at Monaco Casino Square during the Formula 1 Grand Prix, F1 cars in background, luxury lifestyle, ultra realistic photography, 8k, cinematic",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd",
  },
  club: {
    positive:
      "person at a VIP table in an exclusive luxury nightclub with bottle service and neon lights, ultra realistic photography, 8k, high fashion editorial",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed",
  },
  racetrack: {
    positive:
      "person in the F1 paddock at a race track wearing racing gear, Formula 1 pit lane, ultra realistic photography, 8k, professional sports photography",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd",
  },
  restaurant: {
    positive:
      "person dining at a Michelin star rooftop restaurant overlooking city lights at night, luxury fine dining table setting, ultra realistic photography, 8k",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, fast food, casual",
  },
  jet2: {
    positive:
      "person walking up the airstairs boarding a private jet at golden hour on a private tarmac, luxury aviation lifestyle, cinematic lighting, ultra realistic photography, 8k",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, commercial airline terminal",
  },
};

async function imageUrlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mime = res.headers.get("content-type") || "image/jpeg";
  return `data:${mime};base64,${base64}`;
}

async function runReplicate(
  imageBase64: string,
  scenarioId: string
): Promise<string> {
  const scenario = SCENARIO_PROMPTS[scenarioId];
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  const input = {
    prompt: scenario.positive,
    image_input: [imageBase64],
    aspect_ratio: "4:3",
    resolution: "1K",
    output_format: "jpg",
  };

  const output = await replicate.run("google/nano-banana-2", { input });

  // nano-banana-2 returns a FileOutput with a .url() method
  const fileOutput = output as { url: () => string };
  return fileOutput.url();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const scenariosRaw = formData.get("scenarios") as string | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!scenariosRaw) {
      return NextResponse.json({ error: "No scenarios selected" }, { status: 400 });
    }

    const scenarios: string[] = JSON.parse(scenariosRaw);
    if (!scenarios.length) {
      return NextResponse.json({ error: "Select at least one scenario" }, { status: 400 });
    }

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = `data:${imageFile.type};base64,${Buffer.from(imageBuffer).toString("base64")}`;

    // Generate for each scenario (up to 8)
    const selectedScenarios = scenarios.slice(0, 8);

    const results = await Promise.allSettled(
      selectedScenarios.map(async (scenarioId) => {
        const outputUrl = await runReplicate(imageBase64, scenarioId);
        // Convert Replicate URL to base64 for display (avoids CORS)
        const base64 = await imageUrlToBase64(outputUrl);
        return { scenario: scenarioId, imageUrl: base64 };
      })
    );

    const successful = results
      .filter((r): r is PromiseFulfilledResult<{ scenario: string; imageUrl: string }> => r.status === "fulfilled")
      .map((r) => r.value);

    const failed = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => r.reason?.message || "unknown error");

    if (successful.length === 0) {
      return NextResponse.json(
        { error: `All generations failed: ${failed.join(", ")}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: successful, warnings: failed });
  } catch (err) {
    console.error("Transform API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
