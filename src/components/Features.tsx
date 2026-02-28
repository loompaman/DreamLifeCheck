"use client";

const SCENARIOS = [
  {
    icon: "🏎️",
    title: "Luxury Supercars",
    description: "Behind the wheel of a Lamborghini Urus, Ferrari Roma, or Rolls-Royce Cullinan — on mountain switchbacks or city boulevards.",
    accentColor: "#f59e0b",
    tag: "Most Popular",
  },
  {
    icon: "✈️",
    title: "Private Jet",
    description: "Stepping onto a Gulfstream G700 or Bombardier Global 7500. Your boarding pass: one photo.",
    accentColor: "#38bdf8",
    tag: null,
  },
  {
    icon: "🛥️",
    title: "Superyacht",
    description: "Standing at the helm of a 200-foot megayacht, cocktail in hand, with the Mediterranean as your stage.",
    accentColor: "#2dd4bf",
    tag: null,
  },
  {
    icon: "🏙️",
    title: "Penthouse Living",
    description: "Floor-to-ceiling views of Manhattan, Dubai, or Hong Kong from your 96th-floor penthouse suite.",
    accentColor: "#a78bfa",
    tag: null,
  },
  {
    icon: "⌚",
    title: "Luxury Fashion",
    description: "Draped in Hermès, Patek Philippe on your wrist — shot by an imaginary world-class fashion photographer.",
    accentColor: "#f472b6",
    tag: null,
  },
  {
    icon: "🏝️",
    title: "Private Island",
    description: "Your own Maldivian island. Crystal water, white sand, zero crowds. Total sovereignty.",
    accentColor: "#34d399",
    tag: "New",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden">
      {/* Background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 80px)"
        }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Luxury Scenarios</span>
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
            Every Dream.{" "}
            <span className="italic"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              Visualized.
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Our AI places your likeness into six distinct elite lifestyle categories — all from a single photo.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENARIOS.map((s, i) => (
            <div
              key={i}
              className="scenario-card relative group rounded-2xl p-7 cursor-default overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${s.accentColor}09 0%, transparent 60%)`,
                border: `1px solid ${s.accentColor}22`,
              }}
            >
              {/* Tag */}
              {s.tag && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: `${s.accentColor}18`,
                    color: s.accentColor,
                    border: `1px solid ${s.accentColor}35`,
                  }}
                >
                  {s.tag}
                </span>
              )}

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 30% 30%, ${s.accentColor}12 0%, transparent 65%)` }}
              />

              {/* Number */}
              <div className="absolute top-5 left-6 text-[100px] font-bold leading-none select-none pointer-events-none opacity-[0.04] text-white">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${s.accentColor}12`, border: `1px solid ${s.accentColor}25` }}
                >
                  {s.icon}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2.5 tracking-tight">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.description}</p>

                {/* Bottom accent */}
                <div
                  className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${s.accentColor}60, transparent)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
