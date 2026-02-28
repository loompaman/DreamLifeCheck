"use client";

import Link from "next/link";

const SCENE_PREVIEWS = [
  { src: "/demo-jet-dubai.png", label: "Private Jet" },
  { src: "/demo-ferrari.png", label: "Ferrari" },
  { src: "/demo-yacht.png", label: "Superyacht" },
  { src: "/demo-monaco.png", label: "Monaco" },
];

export default function CTASection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.03) 50%, transparent 100%)" }} />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Scrolling preview strip */}
        <div className="flex gap-3 justify-center mb-14 overflow-hidden">
          {SCENE_PREVIEWS.map((p) => (
            <div key={p.src}
              className="relative rounded-xl overflow-hidden flex-shrink-0"
              style={{ width: 90, height: 120, border: "1px solid rgba(201,168,76,0.15)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.label} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(3,3,10,0.7) 0%, transparent 50%)" }} />
              <p className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] text-white/50 font-medium">{p.label}</p>
            </div>
          ))}
        </div>

        {/* Main CTA card */}
        <div className="relative rounded-3xl overflow-hidden text-center px-8 py-16"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 0 100px rgba(201,168,76,0.06), 0 40px 80px rgba(0,0,0,0.4)",
          }}>

          {/* Inner glow top */}
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)" }} />

          <div className="max-w-xl mx-auto">
            <p className="font-serif italic text-white/25 text-lg mb-5 tracking-wide">
              &ldquo;Fake it till you make it.&rdquo;
            </p>

            <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-bold text-white leading-tight mb-4">
              Ready to see your{" "}
              <span className="italic" style={{
                background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                dream life?
              </span>
            </h2>

            <p className="text-white/40 text-base mb-10 leading-relaxed">
              Upload one photo. We&apos;ll place you in the scenes of your choice and deliver high-res results within 24 hours.
            </p>

            <Link
              href="/upload"
              className="group inline-flex items-center gap-3 px-10 py-4.5 py-[18px] rounded-full text-base font-bold text-black transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
                boxShadow: "0 0 60px rgba(201,168,76,0.45), 0 4px 30px rgba(0,0,0,0.5)",
              }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Create My Dream Life
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <p className="mt-5 text-white/20 text-sm">
              Delivered to your inbox within 24 hours · No subscription required
            </p>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 opacity-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3L3 10M3 3L10 3" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute top-6 right-6 opacity-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 3L21 10M21 3L14 3" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-6 opacity-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 21L3 14M3 21L10 21" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute bottom-6 right-6 opacity-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L21 14M21 21L14 21" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

