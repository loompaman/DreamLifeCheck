"use client";

const TESTIMONIALS = [
  {
    quote: "I used the jet shot as a vision board wallpaper. Seeing it every morning keeps me locked in on my goals.",
    name: "Jordan L.",
    role: "Founder · Miami",
    avatar: "J",
    color: "from-amber-400 to-orange-500",
    stars: 5,
  },
  {
    quote: "Posted one on Instagram and people asked where I was. It looks insanely real.",
    name: "Sofia K.",
    role: "Creator · LA",
    avatar: "S",
    color: "from-rose-400 to-pink-600",
    stars: 5,
  },
  {
    quote: "I pinned the yacht shot to my mood board. It’s the exact vibe I’m working toward.",
    name: "Avery M.",
    role: "Designer · NYC",
    avatar: "A",
    color: "from-sky-400 to-blue-600",
    stars: 5,
  },
  {
    quote: "I keep the supercar image on my lock screen as motivation. It’s a daily reminder.",
    name: "Kai N.",
    role: "Sales · Chicago",
    avatar: "K",
    color: "from-violet-500 to-purple-600",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 65%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Testimonials</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            They posted it.{" "}
            <span className="italic"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              Now they&apos;re chasing it.
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)" }} />

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-[#c9a84c]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
