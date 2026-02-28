"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ConfirmationPage() {
  useEffect(() => {
    try {
      // Clear session data after successful payment
      sessionStorage.removeItem("uploadedPhoto");
      sessionStorage.removeItem("selectedScenarios");
      sessionStorage.removeItem("uploadedPhotoName");
    } catch {}
  }, []);

  return (
    <main className="bg-[#03030a] min-h-screen flex flex-col">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">

          {/* Animated checkmark */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(201,168,76,0.15)" }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                border: "2px solid rgba(201,168,76,0.35)",
                boxShadow: "0 0 50px rgba(201,168,76,0.2)",
              }}>
              <svg className="w-10 h-10 text-[#c9a84c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-6">
            <span className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest">Order Received</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Your dream life is{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              on its way.
            </span>
          </h1>

          <p className="text-white/45 text-lg leading-relaxed mb-3">
            We&apos;ve received your request and will get to work.
          </p>
          <p className="text-white/30 text-sm mb-10">
            We&apos;ll email your luxury photos to the address you used at checkout — within 24 hours.
          </p>

          {/* What happens next */}
          <div className="rounded-2xl p-6 mb-8 text-left space-y-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-4">What happens next</p>
            {[
              { icon: "🎨", title: "We create your photos", desc: "We place you into each luxury scene you picked." },
              { icon: "📩", title: "We email you the results", desc: "Your photos land in your inbox within 24 hours." },
              { icon: "💳", title: "Payment confirmed", desc: "Your Stripe payment was received — you're all set." },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="text-xl shrink-0 mt-0.5">{step.icon}</div>
                <div>
                  <p className="text-white font-medium text-sm">{step.title}</p>
                  <p className="text-white/35 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm text-white/50 border border-white/10 hover:border-white/20 hover:text-white transition-all">
              Back to Home
            </Link>
            <Link href="/upload"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-black transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", boxShadow: "0 0 30px rgba(201,168,76,0.3)" }}>
              Order More Scenarios →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

