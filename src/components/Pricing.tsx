"use client";

import { useState } from "react";

const PLANS = [
  {
    name: "Explorer",
    tagline: "Taste the dream",
    price: { m: 0, y: 0 },
    features: [
      "3 transformations / month",
      "4 luxury scenarios",
      "HD resolution (1024px)",
      "Watermarked downloads",
    ],
    cta: "Start Free",
    href: "/upload",
    gold: false,
  },
  {
    name: "Elite",
    tagline: "The full experience",
    price: { m: 19, y: 14 },
    features: [
      "50 transformations / month",
      "All 20+ luxury scenarios",
      "4K resolution, no watermark",
      "Priority processing (< 30s)",
      "Priority support",
    ],
    cta: "Go Elite",
    href: "/upload",
    gold: true,
    badge: "Most Popular",
  },
  {
    name: "Dynasty",
    tagline: "No limits whatsoever",
    price: { m: 49, y: 39 },
    features: [
      "Unlimited transformations",
      "All 20+ luxury scenarios",
      "8K resolution, no watermark",
      "Instant processing",
      "Custom scenario requests",
      "API access",
    ],
    cta: "Join Dynasty",
    href: "/upload",
    gold: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Pricing</span>
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
            Flexible Pricing for{" "}
            <span className="italic"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              Every Dreamer
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-md mx-auto mb-10">
            Start free. Upgrade when the dreams demand more.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center glass rounded-full p-1.5 border border-white/8">
            {["Monthly", "Yearly"].map((label, i) => {
              const active = (i === 0 && !yearly) || (i === 1 && yearly);
              return (
                <button
                  key={label}
                  onClick={() => setYearly(i === 1)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    active ? "text-black" : "text-white/40 hover:text-white/70"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #c9a84c, #e8c96a)" } : {}}
                >
                  {label}
                  {i === 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      −25%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${plan.gold ? "gold-glow" : "hover:border-white/15"}`}
              style={
                plan.gold
                  ? {
                      background: "linear-gradient(145deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 100%)",
                      border: "1px solid rgba(201,168,76,0.35)",
                    }
                  : {
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }
              }
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <div
                    className="px-4 py-1.5 rounded-b-xl text-xs font-bold text-black"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}
                  >
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Radial glow for gold card */}
              {plan.gold && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(201,168,76,0.15) 0%, transparent 60%)" }} />
              )}

              <div className="relative z-10">
                <p className={`text-xs font-medium mb-1 ${plan.gold ? "text-[#c9a84c]/70" : "text-white/30"} uppercase tracking-widest`}>
                  {plan.tagline}
                </p>
                <h3 className={`font-serif text-2xl font-bold mb-5 ${plan.gold ? "gold-text" : "text-white"}`}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-7">
                  <span className="text-5xl font-bold text-white tracking-tight">
                    ${yearly ? plan.price.y : plan.price.m}
                  </span>
                  {plan.price.m > 0 && (
                    <span className="text-white/35 text-sm">/month</span>
                  )}
                </div>

                {/* CTA */}
                <a
                  href={plan.href}
                  className={`block text-center py-3.5 rounded-full text-sm font-semibold mb-7 transition-all duration-200 hover:scale-[1.02] ${
                    plan.gold
                      ? "text-black"
                      : "text-white/80 border border-white/12 hover:border-white/25 hover:bg-white/5"
                  }`}
                  style={plan.gold ? { background: "linear-gradient(135deg, #c9a84c, #e8c96a)" } : {}}
                >
                  {plan.cta}
                </a>

                <div className="h-px mb-7" style={{ background: plan.gold ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)" }} />

                {/* Features */}
                <ul className="space-y-3.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-white/55">
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.gold ? "bg-[#c9a84c]/15" : "bg-white/8"}`}>
                        <svg className={`w-2.5 h-2.5 ${plan.gold ? "text-[#c9a84c]" : "text-white/40"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <p className="text-center mt-8 text-sm text-white/25">
          7-day money-back guarantee · No credit card to start · Cancel anytime
        </p>
      </div>
    </section>
  );
}
