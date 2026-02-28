"use client";

const BRANDS = [
  { name: "Lamborghini", icon: "🏎️" },
  { name: "Gulfstream", icon: "✈️" },
  { name: "Sunseeker", icon: "🛥️" },
  { name: "Rolls-Royce", icon: "👑" },
  { name: "Hermès", icon: "🧣" },
  { name: "Patek Philippe", icon: "⌚" },
  { name: "Four Seasons", icon: "🏨" },
  { name: "Maldives", icon: "🏝️" },
];

const STATS = [
  { value: "4K", label: "Resolution Output" },
  { value: "< 30s", label: "Generation Time" },
  { value: "20+", label: "Luxury Scenarios" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function LuxuryShowcase() {
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dividers */}
      <div className="gold-divider mb-12" />
      <div className="gold-divider mt-12" />

      {/* Marquee */}
      <div className="relative overflow-hidden mb-10">
        <div className="flex gap-6 marquee-track w-max">
          {doubled.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-full glass border border-white/6 text-white/40 hover:text-white/70 transition-colors cursor-default shrink-0"
            >
              <span className="text-xl">{b.icon}</span>
              <span className="text-sm font-medium tracking-wide">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-6 text-center overflow-hidden group transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 70%)" }}
              />
              <div
                className="font-serif text-4xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #f5e6b8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div className="text-sm text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
