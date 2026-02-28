import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, scenarios, photo } = await req.json();

    if (!email || !scenarios?.length || !photo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Send notification email to YOU (the owner) ──
    // Replace OWNER_EMAIL with your email address in .env.local:
    //   OWNER_EMAIL=you@gmail.com
    //   RESEND_API_KEY=re_...   (get a free key at resend.com)
    const ownerEmail = process.env.OWNER_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey && ownerEmail) {
      const scenarioList = scenarios.join(", ");

      // Notification to owner
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DreamLifeCheck Orders <orders@dreamlifecheck.com>",
          to: [ownerEmail],
          subject: `🛎️ New Order — ${scenarios.length} photo${scenarios.length > 1 ? "s" : ""} for ${email}`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
              <h2 style="color:#c9a84c;">New DreamLifeCheck Order</h2>
              <p><strong>Customer email:</strong> ${email}</p>
              <p><strong>Scenarios requested:</strong> ${scenarioList}</p>
              <p><strong>Number of photos:</strong> ${scenarios.length}</p>
              <hr style="border-color:#333;"/>
              <p style="color:#888;font-size:13px;">
                Generate the images and send them to <a href="mailto:${email}">${email}</a>.
              </p>
              <p style="color:#888;font-size:12px;">
                The customer's photo is attached as a base64 data URL in the raw payload.
                You can decode it at <a href="https://base64.guru/converter/decode/image">base64.guru</a>.
              </p>
            </div>
          `,
        }),
      });

      // Confirmation to customer
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DreamLifeCheck <hello@dreamlifecheck.com>",
          to: [email],
          subject: "✨ Your dream life is being created",
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#03030a;color:#fff;padding:32px;border-radius:12px;">
              <h2 style="color:#c9a84c;font-family:Georgia,serif;font-style:italic;">Your order is confirmed.</h2>
              <p style="color:#aaa;">We're generating your luxury photos now. Here's what you ordered:</p>
              <ul style="color:#ccc;">
                ${scenarios.map((s: string) => `<li>${s}</li>`).join("")}
              </ul>
              <p style="color:#aaa;">
                Your photos will be emailed to you <strong style="color:#fff;">within 24 hours</strong>.
              </p>
              <p style="color:#666;font-size:12px;margin-top:24px;">
                DreamLifeCheck · Fake it till you make it.
              </p>
            </div>
          `,
        }),
      });
    } else {
      // No email service configured — log the order to console for manual processing
      console.log("📬 NEW ORDER:", {
        customerEmail: email,
        scenarios,
        photoLength: photo.length,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}

