"use client";

const STEPS = [
  {
    num: "01",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Upload Your Selfie",
    body: "A clear photo of your face is all you need. No professional shoot, no special lighting.",
    detail: "JPG · PNG · WEBP · Max 10MB",
  },
  {
    num: "02",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: "Choose Your Scenes",
    body: "Pick the luxury scenarios you want — private jet, supercar, yacht, penthouse and more.",
    detail: "8 scenes available · Mix and match",
  },
  {
    num: "03",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Receive Your Photos",
    body: "We hand-craft your luxury photos using AI and deliver them to your inbox within 24 hours.",
    detail: "High-res · Watermark-free · Ready to post",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">How It Works</span>
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight">
            Three steps to your{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              dream life.
            </span>
          </h2>
          <p className="mt-4 text-white/35 text-base max-w-sm mx-auto leading-relaxed">
            From selfie to luxury lifestyle photo in under 24 hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-[52px] left-full w-5 -translate-x-2.5 z-10">
                  <div className="h-px w-full" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)" }} />
                </div>
              )}
              <div
                className="h-full rounded-2xl p-8 transition-all duration-300 group-hover:border-[#c9a84c]/25"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-start justify-between mb-7">
                  <div
                    className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[#c9a84c]"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    {step.icon}
                  </div>
                  <span className="font-serif text-6xl font-bold leading-none select-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(201,168,76,0.18) 0%, transparent 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2.5">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5">{step.body}</p>

                <div className="flex items-center gap-2 text-xs text-white/20">
                  <div className="w-4 h-px bg-[#c9a84c]/40" />
                  {step.detail}
                </div>

                <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.5), transparent)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
