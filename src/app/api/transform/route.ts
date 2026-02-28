import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const SCENARIO_PROMPTS: Record<string, { positive: string; negative: string }> = {
  supercar: {
    positive:
      "person driving a Lamborghini Huracan on the Amalfi coast road, luxury supercar, cinematic photography, golden hour lighting, ultra-realistic, 8k, bokeh background, professional automotive photography",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, ugly, multiple people",
  },
  jet: {
    positive:
      "person boarding a Gulfstream G700 private jet on a private airstrip at sunset, luxury aviation, cinematic lighting, ultra realistic photography, 8k, professional",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd, commercial airplane",
  },
  yacht: {
    positive:
      "person standing on the deck of a 200-foot luxury superyacht in Monaco harbour, Mediterranean sea, golden hour, ultra realistic photography, 8k, high fashion",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd, small boat",
  },
  penthouse: {
    positive:
      "person standing in a luxury penthouse with floor-to-ceiling windows overlooking Manhattan skyline at night, modern interior design, ultra realistic photography, 8k, cinematic",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, daytime",
  },
  fashion: {
    positive:
      "person wearing luxury haute couture fashion, Patek Philippe watch, Hermès accessories, high fashion editorial photography, professional studio lighting, ultra realistic, 8k",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, casual clothes",
  },
  island: {
    positive:
      "person relaxing on a pristine private island in Maldives, crystal clear turquoise water, white sand beach, overwater bungalow, ultra realistic photography, 8k, golden hour",
    negative:
      "cartoon, anime, painting, blurry, low quality, bad anatomy, deformed, crowd, urban",
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

    // Generate for each scenario (up to 4 to avoid timeout)
    const selectedScenarios = scenarios.slice(0, 4);

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

