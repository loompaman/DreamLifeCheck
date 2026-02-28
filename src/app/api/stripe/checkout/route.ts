import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SCENARIO_PRICES: Record<string, { label: string; price: number }> = {
  jet:        { label: "Private Jet photo",  price: 500 },  // in cents
  ferrari:    { label: "Supercar photo",     price: 500 },
  yacht:      { label: "Superyacht photo",   price: 500 },
  monaco:     { label: "Monaco photo",       price: 500 },
  club:       { label: "Night Club photo",   price: 500 },
  racetrack:  { label: "Race Track photo",   price: 500 },
  restaurant: { label: "Fine Dining photo",  price: 500 },
  jet2:       { label: "Jet Boarding photo",  price: 500 },
};

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const { scenarios, photo } = await req.json();

    if (!scenarios?.length || !photo) {
      return NextResponse.json({ error: "Missing scenarios or photo" }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey);

    // Store the photo in session metadata (base64 is too large for Stripe metadata,
    // so we save it server-side in a simple KV or just log it for manual processing)
    console.log("📸 Order photo received for manual processing:", {
      scenarios,
      photoLength: photo.length,
      timestamp: new Date().toISOString(),
    });

    const lineItems = scenarios
      .filter((id: string) => SCENARIO_PRICES[id])
      .map((id: string) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `DreamLifeCheck — ${SCENARIO_PRICES[id].label}`,
            description: "AI luxury photo featuring you · Delivered within 24 hours",
          },
          unit_amount: SCENARIO_PRICES[id].price,
        },
        quantity: 1,
      }));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        scenarios: scenarios.join(","),
      },
      custom_text: {
        submit: {
          message: "Your luxury photos will be emailed to you within 24 hours of payment.",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

