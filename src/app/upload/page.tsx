"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SCENARIOS = [
  { id: "jet",        label: "Private Jet",  emoji: "✈️",  desc: "Gulfstream · Dubai Tarmac",  accent: "#38bdf8", price: 5, demo: "/demo-jet-dubai.png" },
  { id: "ferrari",    label: "Supercar",     emoji: "🏎️", desc: "Ferrari · Lamborghini",       accent: "#f59e0b", price: 5, demo: "/demo-ferrari.png"   },
  { id: "yacht",      label: "Superyacht",   emoji: "🛥️", desc: "Monaco Harbour · Open Sea",   accent: "#2dd4bf", price: 5, demo: "/demo-yacht.png"     },
  { id: "monaco",     label: "Monaco",       emoji: "🏁",  desc: "Casino Square · Grand Prix",  accent: "#a855f7", price: 5, demo: "/demo-monaco.png"    },
  { id: "club",       label: "Night Club",   emoji: "🍾",  desc: "VIP Table · Bottle Service",  accent: "#f472b6", price: 5, demo: "/demo-club.png"      },
  { id: "racetrack",  label: "Race Track",   emoji: "🏆",  desc: "F1 Paddock · Track Day",      accent: "#fb923c", price: 5, demo: "/demo-racetrack.png" },
  { id: "restaurant", label: "Fine Dining",  emoji: "🍽️", desc: "Michelin Star · Rooftop",     accent: "#34d399", price: 5, demo: "/demo-restaurant.png"},
  { id: "jet2",       label: "Jet Boarding", emoji: "🛫",  desc: "Stairs · Golden Hour",       accent: "#818cf8", price: 5, demo: "/demo-jet.png"       },
];

const PRICE_BY_COUNT: Record<number, number> = {
  1: 5,
  4: 15,
  8: 30,
};

const priceForCount = (count: number) => PRICE_BY_COUNT[count] ?? 0;

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("uploadedPhoto") || null;
    }
    return null;
  });
  const [selected, setSelected] = useState<string[]>(["jet"]);
  const [previewScenario, setPreviewScenario] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { setError("Please upload a JPG, PNG or WEBP image"); return; }
    if (f.size > 10 * 1024 * 1024) { setError("Image must be under 10MB"); return; }
    setFile(f); setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      try { sessionStorage.setItem("uploadedPhoto", result); } catch {}
    };
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const toggle = (id: string) =>
    setSelected((p) => {
      if (p.includes(id)) return p.filter((s) => s !== id);
      if (p.length >= 8) {
        setError("You can select up to 8 scenarios");
        return p;
      }
      return [...p, id];
    });

  const handleContinue = () => {
    if (!preview || !selected.length) return;
    try {
      sessionStorage.setItem("selectedScenarios", JSON.stringify(selected));
      if (file) sessionStorage.setItem("uploadedPhotoName", file.name);
    } catch {}
    router.push("/checkout");
  };

  const count = selected.length;
  const total = priceForCount(count);
  const canContinue = !!preview && total > 0;

  return (
    <main className="bg-[#03030a] min-h-screen">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,76,0.05) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-24">

        {/* Back */}
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to home
        </Link>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-10">
          {["Upload & Choose", "Checkout", "We deliver"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={i === 0 ? {
                    background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
                    color: "#000",
                  } : {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                  }}>
                  {i + 1}
                </div>
                <span className={`text-xs font-medium ${i === 0 ? "text-white/70" : "text-white/25"}`}>{step}</span>
              </div>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest">Step 1 of 3</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Build Your{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Order
            </span>
          </h1>
          <p className="text-white/40">Upload your photo and choose which luxury scenarios you want.</p>
        </div>

        <div className="space-y-5">
          {/* ── Step 1: Upload ── */}
          <div className="rounded-2xl p-7 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
                style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}>1</div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Upload Your Photo</h2>
            </div>

            {!preview ? (
              <div
                className={`upload-zone rounded-xl p-14 flex flex-col items-center gap-4 cursor-pointer ${dragging ? "drag-active" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <div className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center text-[#c9a84c] transition-transform hover:scale-110">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">
                    {dragging ? "Drop it here ✨" : "Drag & drop your photo here"}
                  </p>
                  <p className="text-white/35 text-sm">or click to browse · JPG, PNG, WEBP · Max 10MB</p>
                </div>
                <input id="file-input" type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0"
                  style={{ boxShadow: "0 0 0 2px rgba(201,168,76,0.4), 0 8px 30px rgba(0,0,0,0.5)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Your photo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <p className="text-white font-semibold truncate">{file?.name ?? "Photo ready"}</p>
                  </div>
                  <p className="text-white/35 text-sm">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)}MB · ` : ""}Ready ✓
                  </p>
                  <button
                    onClick={() => { setFile(null); setPreview(null); try { sessionStorage.removeItem("uploadedPhoto"); } catch {} }}
                    className="mt-3 text-xs text-white/35 hover:text-white/70 transition-colors flex items-center gap-1.5 group"
                  >
                    <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.34" />
                    </svg>
                    Change photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Step 2: Scenarios ── */}
          <div className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
                style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}>2</div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Choose Your Scenarios</h2>
              <span className="ml-auto text-xs text-white/25">{selected.length} selected</span>
            </div>
            <p className="text-white/30 text-sm mb-6 pl-10">
              Choose 1, 4, or 8 photos — 1 = $5, 4 = $15, 8 = $30.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SCENARIOS.map((s) => {
                const on = selected.includes(s.id);
                return (
                  <div key={s.id}
                    onClick={() => toggle(s.id)}
                    className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    style={{
                      border: `1.5px solid ${on ? s.accent + "60" : "rgba(255,255,255,0.07)"}`,
                      boxShadow: on ? `0 0 20px ${s.accent}20` : "none",
                    }}
                  >
                    {/* Example image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#0a0a12" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.demo}
                        alt={`${s.label} example`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 transition-opacity duration-200"
                        style={{ background: `linear-gradient(to top, rgba(3,3,10,0.85) 0%, rgba(3,3,10,${on ? "0.1" : "0.35"}) 100%)` }} />

                      {/* "Example" label top-left */}
                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.4)", backdropFilter: "blur(4px)" }}>
                          example
                        </span>
                      </div>

                      {/* Checkmark when selected */}
                      {on && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: s.accent }}>
                          <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}

                      {/* Zoom / preview button on hover */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewScenario(s.id); }}
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                        title="Preview full size"
                      >
                        <svg className="w-3.5 h-3.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </button>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between px-3 py-2.5"
                      style={{ background: on ? `${s.accent}12` : "rgba(255,255,255,0.02)" }}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{s.emoji}</span>
                          <span className="text-xs font-semibold text-white leading-tight">{s.label}</span>
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5 pl-0.5">{s.desc}</div>
                      </div>
                      {on
                        ? <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: s.accent }}><polyline points="20 6 9 17 4 12" /></svg>
                        : <svg className="w-4 h-4 shrink-0 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Running total */}
            {selected.length > 0 && (
              <div className="mt-5 flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <span className="text-white/50 text-sm">
                  {count} photo{count !== 1 ? "s" : ""}
                </span>
                <span className="font-bold text-lg" style={{
                  background: "linear-gradient(135deg, #c9a84c, #f5e6b8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {total > 0 ? `$${total} total` : "Select 1, 4, or 8"}
                </span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          {/* ── CTA ── */}
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="relative w-full py-4 rounded-full text-base font-semibold text-black overflow-hidden transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed hover:scale-[1.01] hover:brightness-110 hover:shadow-[0_0_60px_rgba(201,168,76,0.55)] active:scale-[0.99]"
            style={canContinue ? {
              background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
              boxShadow: "0 0 50px rgba(201,168,76,0.45), 0 5px 30px rgba(0,0,0,0.5)",
            } : {
              background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
            }}
          >
            <span className="flex items-center justify-center gap-2.5">
              {!preview ? "Upload a photo to continue" : !selected.length ? "Select at least one scenario" : total === 0 ? "Select 1, 4, or 8 scenarios" : (
                <>
                  Continue to Checkout — ${total}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </span>
          </button>

          <p className="text-center text-white/20 text-xs">
            Your photo is never stored · results shown instantly after payment
          </p>
        </div>
      </div>

      {/* ── Lightbox modal ── */}
      {previewScenario && (() => {
        const s = SCENARIOS.find(x => x.id === previewScenario)!;
        const on = selected.includes(s.id);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)" }}
            onClick={() => setPreviewScenario(null)}
          >
            <div
              className="relative max-w-sm w-full rounded-3xl overflow-hidden"
              style={{ border: `1.5px solid ${s.accent}50`, boxShadow: `0 0 80px ${s.accent}25, 0 40px 80px rgba(0,0,0,0.7)` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative" style={{ background: "#08080f" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.demo} alt={s.label} className="w-full object-contain" style={{ maxHeight: "70vh" }} />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(3,3,10,0.8) 0%, transparent 50%)" }} />

                {/* Close button */}
                <button
                  onClick={() => setPreviewScenario(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                >
                  <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: `${s.accent}20`, border: `1px solid ${s.accent}50`, color: s.accent }}>
                    {s.emoji} {s.label}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/40 text-xs mb-1">{s.desc}</p>
                  <p className="text-white font-semibold">Example output</p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.03)", borderTop: `1px solid ${s.accent}25` }}>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{s.label}</p>
                  <p className="text-white/35 text-xs">Bundle pricing: 1=$5 · 4=$15 · 8=$30</p>
                </div>
                <button
                  onClick={() => { toggle(s.id); setPreviewScenario(null); }}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.04]"
                  style={on ? {
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  } : {
                    background: `linear-gradient(135deg, ${s.accent}, ${s.accent}cc)`,
                    color: "#000",
                  }}
                >
                  {on ? "✓ Selected" : "Add to Order"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
