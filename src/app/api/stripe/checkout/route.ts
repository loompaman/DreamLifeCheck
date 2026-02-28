import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE_BY_COUNT: Record<number, number> = {
  1: 500,
  4: 1500,
  8: 3000,
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

    // Receipt log only — actual upload happens after payment confirmation
    console.log("📸 Checkout initiated:", {
      scenarios,
      photoLength: photo.length,
      timestamp: new Date().toISOString(),
    });

    const count = scenarios.length;
    const total = PRICE_BY_COUNT[count];
    if (!total) {
      return NextResponse.json(
        { error: "Select exactly 1, 4, or 8 photos" },
        { status: 400 }
      );
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `DreamLifeCheck — ${count} photo${count > 1 ? "s" : ""}`,
            description: "AI luxury photo bundle · Delivered within 24 hours",
          },
          unit_amount: total,
        },
        quantity: 1,
      },
    ];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        scenarios: scenarios.join(","),
        count: String(count),
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
