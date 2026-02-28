import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const MONTHLY_DROPS = [
  { month: "March 2026", theme: "F1 Monaco Grand Prix", emoji: "🏁", status: "upcoming", desc: "Paddock access, podium celebrations, pit lane portraits" },
  { month: "April 2026", theme: "Coachella VIP Tent", emoji: "🎪", status: "upcoming", desc: "Exclusive artist lounge, desert sunsets, luxury camping" },
  { month: "May 2026", theme: "Cannes Film Festival", emoji: "🎬", status: "upcoming", desc: "Red carpet arrivals, yacht parties, Palais des Festivals" },
  { month: "February 2026", theme: "Dubai Desert Safari", emoji: "🌅", status: "live", desc: "Golden dunes at sunset, falcon handler, gold-plated everything" },
];

const PACKS = [
  {
    name: "Starter Pack",
    price: 9,
    images: 10,
    perImage: "0.90",
    scenarios: "Any 5 scenarios",
    resolution: "HD (1024px)",
    watermark: false,
    highlight: false,
    cta: "Buy Pack",
  },
  {
    name: "Elite Pack",
    price: 19,
    images: 25,
    perImage: "0.76",
    scenarios: "All 12 scenarios",
    resolution: "4K",
    watermark: false,
    highlight: true,
    badge: "Best Value",
    cta: "Buy Pack",
  },
  {
    name: "Dynasty Pack",
    price: 39,
    images: 60,
    perImage: "0.65",
    scenarios: "All 12 scenarios",
    resolution: "4K",
    watermark: false,
    highlight: false,
    cta: "Buy Pack",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-[#03030a] min-h-screen">
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest">Pricing</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight">
            Own Your{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Dream Life
            </span>
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Start free. Buy credits when you want more. Join the Dream Club for exclusive monthly drops.
          </p>
        </div>

        {/* ── Free tier banner ── */}
        <div className="relative rounded-2xl p-6 mb-8 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
              🎁
            </div>
            <div>
              <p className="text-white font-semibold">Free — No credit card needed</p>
              <p className="text-white/40 text-sm">Get 2 free transformations to try any scenario. No signup required.</p>
            </div>
          </div>
          <Link href="/upload"
            className="shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all">
            Try for Free →
          </Link>
        </div>

        {/* ── Credit packs ── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
            <span className="text-xs text-white/35 uppercase tracking-widest font-medium">Credit Packs — Buy once, use anytime</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PACKS.map((pack) => (
              <div key={pack.name}
                className="relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={pack.highlight ? {
                  background: "linear-gradient(145deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 100%)",
                  border: "1px solid rgba(201,168,76,0.35)",
                  boxShadow: "0 0 50px rgba(201,168,76,0.12)",
                } : {
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>

                {pack.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-b-xl text-xs font-bold text-black"
                      style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}>
                      {pack.badge}
                    </div>
                  </div>
                )}

                {pack.highlight && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 60%)" }} />
                )}

                <div className="relative z-10">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-1">{pack.name}</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-5xl font-bold text-white">${pack.price}</span>
                  </div>
                  <p className="text-white/30 text-sm mb-6">${pack.perImage} per image</p>

                  <div className="space-y-3 mb-7">
                    {[
                      { icon: "✦", label: `${pack.images} transformations` },
                      { icon: "✦", label: pack.scenarios },
                      { icon: "✦", label: `${pack.resolution} resolution` },
                      { icon: "✦", label: "No watermark" },
                      { icon: "✦", label: "Never expires" },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5 text-sm text-white/55">
                        <span className={`text-[10px] ${pack.highlight ? "text-[#c9a84c]" : "text-white/25"}`}>{f.icon}</span>
                        {f.label}
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={pack.highlight ? {
                      background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
                      color: "#000",
                    } : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}>
                    {pack.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dream Club ── */}
        <div className="relative rounded-3xl overflow-hidden mt-10"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 50%, rgba(201,168,76,0.06) 100%)",
            border: "1px solid rgba(201,168,76,0.3)",
            boxShadow: "0 0 80px rgba(201,168,76,0.08)",
          }}>

          {/* Corner glow */}
          <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />

          <div className="relative z-10 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-6">
                  <span className="text-sm">👑</span>
                  <span className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest">Dream Club</span>
                </div>

                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                  A new luxury world,{" "}
                  <span className="italic" style={{
                    background: "linear-gradient(135deg, #c9a84c, #f5e6b8)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    every month.
                  </span>
                </h2>

                <p className="text-white/45 leading-relaxed mb-8">
                  Members get a fresh set of exclusive luxury scenarios dropped every month — scenarios that can&apos;t be bought individually. F1 paddock one month, Cannes Film Festival the next.
                </p>

                <div className="space-y-3 mb-9">
                  {[
                    "20 transformations every month",
                    "All standard scenarios included",
                    "Exclusive monthly drops (members only)",
                    "4K resolution, no watermark",
                    "Early access to new scenarios",
                    "Priority generation queue",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                        <svg className="w-2.5 h-2.5 text-[#c9a84c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex items-end gap-2 mb-6">
                  <span className="text-5xl font-bold text-white">$15</span>
                  <span className="text-white/35 mb-1.5">/month</span>
                  <span className="mb-1.5 ml-1 text-xs text-white/25">· cancel anytime</span>
                </div>

                <button
                  className="w-full sm:w-auto px-10 py-4 rounded-full text-base font-semibold text-black transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
                    boxShadow: "0 0 40px rgba(201,168,76,0.4), 0 4px 20px rgba(0,0,0,0.4)",
                  }}>
                  Join the Dream Club
                </button>
              </div>

              {/* Right — monthly drops */}
              <div>
                <p className="text-xs text-white/35 uppercase tracking-widest mb-4 font-medium">Upcoming & Recent Drops</p>
                <div className="space-y-3">
                  {MONTHLY_DROPS.map((drop) => (
                    <div key={drop.month}
                      className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
                      style={{
                        background: drop.status === "live"
                          ? "rgba(201,168,76,0.08)"
                          : "rgba(255,255,255,0.02)",
                        border: drop.status === "live"
                          ? "1px solid rgba(201,168,76,0.25)"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}>
                      <div className="text-2xl shrink-0 mt-0.5">{drop.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-white font-semibold text-sm">{drop.theme}</span>
                          {drop.status === "live" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                              style={{ background: "rgba(201,168,76,0.2)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}>
                              Live Now
                            </span>
                          )}
                          {drop.status === "upcoming" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white/30 border border-white/8">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-white/35 text-xs">{drop.month}</p>
                        <p className="text-white/40 text-xs mt-1 leading-relaxed">{drop.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom note ── */}
        <p className="text-center text-white/20 text-sm mt-10">
          All plans include secure checkout via Stripe · No hidden fees · Cancel anytime
        </p>
      </div>

      <Footer />
    </main>
  );
}

