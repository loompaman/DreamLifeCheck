"use client";

import { useState } from "react";

// Demo data: a sample person photo + 4 AI-generated luxury outputs
// Using Unsplash for demo images (free, no auth needed)
const DEMO_PERSON = {
  url: "/demo-person.jpg",
  name: "Before",
};

const DEMO_RESULTS = [
  {
    id: "jet",
    label: "Private Jet",
    sublabel: "41,000 ft · Gulfstream G700",
    emoji: "✈️",
    tag: "Private Jet",
    tagColor: "text-sky-400 bg-sky-400/10 border-sky-400/25",
    url: "/demo-jet.png",
    accentColor: "rgba(56,189,248,0.08)",
    borderColor: "rgba(56,189,248,0.2)",
  },
  {
    id: "yacht",
    label: "Superyacht",
    sublabel: "Dubai Marina · Night Cruise",
    emoji: "🛥️",
    tag: "Superyacht",
    tagColor: "text-teal-400 bg-teal-400/10 border-teal-400/25",
    url: "/demo-yacht.png",
    accentColor: "rgba(45,212,191,0.08)",
    borderColor: "rgba(45,212,191,0.2)",
  },
  {
    id: "monaco",
    label: "Monte Carlo",
    sublabel: "Monaco · Range Rover Valet",
    emoji: "🏎️",
    tag: "Luxury Car",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/25",
    url: "/demo-monaco.png",
    accentColor: "rgba(251,191,36,0.08)",
    borderColor: "rgba(251,191,36,0.2)",
  },
  {
    id: "restaurant",
    label: "Fine Dining",
    sublabel: "Skyline Restaurant · Rooftop",
    emoji: "🍽️",
    tag: "Fine Dining",
    tagColor: "text-rose-400 bg-rose-400/10 border-rose-400/25",
    url: "/demo-restaurant.png",
    accentColor: "rgba(251,113,133,0.08)",
    borderColor: "rgba(251,113,133,0.2)",
  },
  {
    id: "club",
    label: "VIP Nightclub",
    sublabel: "Armand de Brignac · Table Service",
    emoji: "🥂",
    tag: "VIP Club",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/25",
    url: "/demo-club.png",
    accentColor: "rgba(192,132,252,0.08)",
    borderColor: "rgba(192,132,252,0.2)",
  },
  {
    id: "racetrack",
    label: "Race Track",
    sublabel: "Circuit · Audemars Piguet",
    emoji: "🏁",
    tag: "Track Day",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/25",
    url: "/demo-racetrack.png",
    accentColor: "rgba(251,146,60,0.08)",
    borderColor: "rgba(251,146,60,0.2)",
  },
  {
    id: "ferrari",
    label: "Ferrari",
    sublabel: "Palm Jumeirah · Rolex Day-Date",
    emoji: "🚗",
    tag: "Supercar",
    tagColor: "text-red-400 bg-red-400/10 border-red-400/25",
    url: "/demo-ferrari.png",
    accentColor: "rgba(248,113,113,0.08)",
    borderColor: "rgba(248,113,113,0.2)",
  },
  {
    id: "jet-dubai",
    label: "Dubai Airstrip",
    sublabel: "Dubai · Boarding Private Jet",
    emoji: "🌅",
    tag: "Private Jet",
    tagColor: "text-sky-400 bg-sky-400/10 border-sky-400/25",
    url: "/demo-jet-dubai.png",
    accentColor: "rgba(56,189,248,0.08)",
    borderColor: "rgba(56,189,248,0.2)",
  },
];

export default function TransformDemo() {
  const [activeResult, setActiveResult] = useState(0);

  return (
    <section id="demo" className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Real Example</span>
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight">
            One selfie.{" "}
            <span className="italic"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              8 luxury photos.
            </span>
          </h2>
          {/* Before → After pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-sm text-white/40 font-medium">Selfie taken in a car</span>
            <svg className="w-4 h-4 text-[#c9a84c]" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "#c9a84c" }}>Placed in 8 luxury scenes</span>
          </div>
          <p className="text-white/35 text-base max-w-md mx-auto leading-relaxed">
            These are <span className="text-white/60">real AI outputs</span> using the photo on the left. Pick a scene below to see it.
          </p>
        </div>

        {/* Demo layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">

          {/* ── LEFT: Original photo ── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4 w-full lg:w-auto">

            {/* BEFORE label */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="w-2 h-2 rounded-full bg-white/30" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Before</span>
            </div>

            <div className="relative group">
              {/* Card — desaturated to look "raw" */}
              <div className="relative w-52 sm:w-60 rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.1)", filter: "saturate(0.6)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DEMO_PERSON.url}
                  alt="Demo person — before"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white/40 text-xs">Selfie · taken in a car</p>
                </div>
              </div>
            </div>

            {/* Arrow pointing right to results */}
            <div className="hidden lg:flex flex-col items-center gap-1 text-[#c9a84c]/50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
              <span className="text-[9px] uppercase tracking-widest">AI transforms</span>
            </div>
          </div>

          {/* ── MIDDLE: Arrow / transform indicator ── */}
          <div className="flex lg:flex-col items-center justify-center gap-3 lg:gap-4 lg:pt-36 flex-shrink-0">
            <div className="flex lg:flex-col items-center gap-1">
              {[0, 1, 2].map((i) => (
                <svg key={i} className="w-5 h-5 lg:rotate-90 text-[#c9a84c]"
                  style={{ opacity: 0.25 + i * 0.3, animation: `pulse-gold ${1.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Luxury results ── */}
          <div className="flex-1 w-full">
            {/* AFTER label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">After — AI Output</span>
              </div>
              <span className="text-white/25 text-xs">Pick a scene below</span>
            </div>

            {/* Scenario selector tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
              {DEMO_RESULTS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveResult(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeResult === i
                      ? "text-black scale-[1.03]"
                      : "glass text-white/50 hover:text-white hover:border-white/20"
                  }`}
                  style={
                    activeResult === i
                      ? { background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }
                      : {}
                  }
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>

            {/* Active result — large feature card */}
            {DEMO_RESULTS.map((r, i) => (
              <div
                key={r.id}
                className={`transform-card rounded-2xl overflow-hidden border ${activeResult === i ? "block" : "hidden"}`}
                style={{ borderColor: r.borderColor, background: r.accentColor }}
              >
                {/* Main image */}
                <div className="relative bg-[#05050f] flex items-center justify-center" style={{ minHeight: "480px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.url}
                    alt={r.label}
                    className="transition-transform duration-700 hover:scale-105"
                    style={{ maxWidth: "100%", maxHeight: "600px", width: "auto", height: "auto", display: "block" }}
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(3,3,10,0.9) 0%, rgba(3,3,10,0.3) 40%, transparent 70%)" }} />

                  {/* Tag pill */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${r.tagColor}`}>
                      {r.emoji} {r.tag}
                    </span>
                  </div>

                  {/* AI badge */}
                  <div className="absolute top-4 right-4 glass-dark rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/70">AI Generated</span>
                  </div>

                  {/* Bottom info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">{r.sublabel}</p>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">{r.label}</h3>
                      </div>
                      <a href="/upload"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-black transition-all hover:scale-105 shrink-0"
                        style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}>
                        Place me here
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-4">
              {DEMO_RESULTS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveResult(i)}
                  className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-300 ${
                    activeResult === i
                      ? "ring-2 ring-[#c9a84c] scale-[1.04]"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.url} alt={r.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-end p-1.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                    <span className="text-white text-[10px] font-medium leading-tight">{r.emoji} {r.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-white/30 text-sm mb-6">
            AI places <span className="text-white/60">your face</span> into scenes like these — generated fresh from your photo.
          </p>
          <a
            href="/upload"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-base font-semibold text-black transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
              boxShadow: "0 0 50px rgba(201,168,76,0.4), 0 5px 30px rgba(0,0,0,0.4)",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Try It With My Photo
          </a>
        </div>
      </div>
    </section>
  );
}

