import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const BUCKET = process.env.SUPABASE_UPLOAD_BUCKET || "uploads";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function parseDataUrl(dataUrl: string) {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid photo data");
  }
  const mime = match[1] || "image/jpeg";
  const buffer = Buffer.from(match[2], "base64");
  return { mime, buffer };
}

function extFromMime(mime: string) {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
    case "image/jpg":
    default:
      return "jpg";
  }
}

function safeFilename(name: string | null | undefined) {
  if (!name) return "photo";
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

function safeEmailPath(email: string | null | undefined) {
  if (!email) return "unknown";
  return email.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "_").slice(0, 80);
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const { sessionId, photo, photoName } = await req.json();

    if (!sessionId || !photo) {
      return NextResponse.json({ error: "Missing sessionId or photo" }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const { mime, buffer } = parseDataUrl(photo);
    const ext = extFromMime(mime);
    const name = safeFilename(photoName);
    const emailPath = safeEmailPath(
      session.customer_details?.email || session.customer_email || null
    );
    const path = `orders/${emailPath}/${sessionId}/${Date.now()}-${name}.${ext}`;

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          apikey: supabaseServiceRoleKey,
          "Content-Type": mime,
          "x-upsert": "false",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      return NextResponse.json(
        { error: text || `Supabase upload failed (${uploadRes.status})` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, bucket: BUCKET, path });
  } catch (err) {
    console.error("Stripe confirm error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
