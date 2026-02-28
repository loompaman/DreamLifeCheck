"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SCENARIOS: Record<string, { label: string; emoji: string; desc: string; price: number }> = {
  jet:        { label: "Private Jet",  emoji: "✈️",  desc: "Gulfstream · Dubai Tarmac",  price: 5 },
  ferrari:    { label: "Supercar",     emoji: "🏎️", desc: "Ferrari · Lamborghini",       price: 5 },
  yacht:      { label: "Superyacht",   emoji: "🛥️", desc: "Monaco Harbour · Open Sea",   price: 5 },
  monaco:     { label: "Monaco",       emoji: "🏁",  desc: "Casino Square · Grand Prix",  price: 5 },
  club:       { label: "Night Club",   emoji: "🍾",  desc: "VIP Table · Bottle Service",  price: 5 },
  racetrack:  { label: "Race Track",   emoji: "🏆",  desc: "F1 Paddock · Track Day",      price: 5 },
  restaurant: { label: "Fine Dining",  emoji: "🍽️", desc: "Michelin Star · Rooftop",     price: 5 },
  jet2:       { label: "Jet Boarding",  emoji: "🛫",  desc: "Stairs · Golden Hour",       price: 5 },
};

const PRICE_BY_COUNT: Record<number, number> = {
  1: 5,
  4: 15,
  8: 30,
};

const STRIPE_PAYMENT_LINKS: Record<number, string> = {
  1: "https://buy.stripe.com/eVqcN558T3T06tj5OH8IU0u",
  4: "https://buy.stripe.com/7sYdR90SD6184lbfph8IU0v",
  8: "https://buy.stripe.com/28EdR99p94X44lb5OH8IU0w",
};

const priceForCount = (count: number) => PRICE_BY_COUNT[count] ?? 0;

export default function CheckoutPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const photo = sessionStorage.getItem("uploadedPhoto");
      const scenarios = sessionStorage.getItem("selectedScenarios");
      if (!photo || !scenarios) { router.replace("/upload"); return; }
      setPreview(photo);
      setSelected(JSON.parse(scenarios));
    } catch {
      router.replace("/upload");
    }
  }, [router]);

  const count = selected.length;
  const total = priceForCount(count);

  const handlePay = async () => {
    if (!preview || !selected.length || total === 0) return;
    setLoading(true); setError(null);
    try {
      const url = STRIPE_PAYMENT_LINKS[count];
      if (!url) throw new Error("Missing Stripe link for this quantity");
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (!preview) return null;

  return (
    <main className="bg-[#03030a] min-h-screen">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,76,0.05) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-28 pb-24">

        {/* Back */}
        <Link href="/upload"
          className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-10">
          {["Upload & Choose", "Checkout", "We deliver"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={i === 1 ? {
                    background: "linear-gradient(135deg, #c9a84c, #e8c96a)", color: "#000",
                  } : i === 0 ? {
                    background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c",
                  } : {
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)",
                  }}>
                  {i === 0
                    ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === 1 ? "text-white/70" : i === 0 ? "text-white/40" : "text-white/25"}`}>{step}</span>
              </div>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-white mb-2 leading-tight">
            Your{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Order</span>
          </h1>
          <p className="text-white/40 text-sm">Review and pay — we&apos;ll email your photos within 24 hours.</p>
        </div>

        {/* ── Order card ── */}
        <div className="rounded-2xl overflow-hidden mb-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Photo header */}
          <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
              style={{ boxShadow: "0 0 0 2px rgba(201,168,76,0.35)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Your photo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Your photo</p>
              <p className="text-white/35 text-xs mt-0.5">{count} scenario{count !== 1 ? "s" : ""} selected</p>
            </div>
            <Link href="/upload" className="ml-auto text-xs text-white/25 hover:text-white/50 transition-colors">Edit</Link>
          </div>

          {/* Line items */}
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {selected.map((id) => {
              const s = SCENARIOS[id];
              return s ? (
                <div key={id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{s.emoji}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{s.label}</p>
                      <p className="text-white/30 text-xs">{s.desc}</p>
                    </div>
                  </div>
                  <span className="text-white/35 text-xs font-medium">Included</span>
                </div>
              ) : null;
            })}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-5 py-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(201,168,76,0.04)" }}>
            <span className="text-white font-semibold">Total</span>
            <span className="text-2xl font-bold" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>{total ? `$${total}` : "--"}</span>
          </div>
        </div>

        {/* Error */}
        {(error || (selected.length > 0 && total === 0)) && (
          <div className="flex items-center gap-3 p-4 rounded-xl text-sm text-red-400 mb-4"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error ?? "Select exactly 1, 4, or 8 scenarios to continue."}
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading || total === 0}
          className="w-full py-4 rounded-full text-base font-semibold text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
            boxShadow: "0 0 50px rgba(201,168,76,0.4), 0 5px 30px rgba(0,0,0,0.5)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="gold-spinner" />
              Redirecting to Stripe...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay ${total} with Stripe
            </span>
          )}
        </button>

        <p className="text-center text-white/20 text-xs mt-4">
          Secure payment via Stripe · Photos emailed within 24 hours
        </p>
      </div>
    </main>
  );
}
