"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SCENARIO_LABELS: Record<string, { label: string; emoji: string }> = {
  jet:        { label: "Private Jet",   emoji: "✈️"  },
  ferrari:    { label: "Supercar",      emoji: "🏎️" },
  yacht:      { label: "Superyacht",    emoji: "🛥️" },
  monaco:     { label: "Monaco",        emoji: "🏁"  },
  club:       { label: "Night Club",    emoji: "🍾"  },
  racetrack:  { label: "Race Track",    emoji: "🏆"  },
  restaurant: { label: "Fine Dining",   emoji: "🍽️" },
  jet2:       { label: "Jet Boarding",  emoji: "🛫"  },
};

type Result = { scenario: string; imageUrl: string };

export default function ConfirmationPage() {
  const router = useRouter();
  const hasFired = useRef(false);

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Preparing your photos...");

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const generate = async () => {
      try {
        const photo = sessionStorage.getItem("uploadedPhoto");
        const scenariosRaw = sessionStorage.getItem("selectedScenarios");

        if (!photo || !scenariosRaw) {
          router.replace("/upload");
          return;
        }

        const scenarios: string[] = JSON.parse(scenariosRaw);

        // Convert base64 data URL → File
        const fetchRes = await fetch(photo);
        const blob = await fetchRes.blob();
        const file = new File([blob], "photo.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("image", file);
        formData.append("scenarios", JSON.stringify(scenarios));

        // Animate progress while waiting
        setStatusText("Sending to AI model...");
        setProgress(10);

        const messages = [
          "Placing you into the scene...",
          "Adding luxury details...",
          "Perfecting the lighting...",
          "Almost ready...",
        ];
        let msgIdx = 0;
        const interval = setInterval(() => {
          setProgress((p) => Math.min(p + 3, 88));
          if (msgIdx < messages.length) {
            setStatusText(messages[msgIdx++]);
          }
        }, 3000);

        const response = await fetch("/api/transform", {
          method: "POST",
          body: formData,
        });

        clearInterval(interval);
        setProgress(100);
        setStatusText("Done!");

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Generation failed");

        setResults(data.results ?? []);

        // Clear session storage
        sessionStorage.removeItem("uploadedPhoto");
        sessionStorage.removeItem("selectedScenarios");
        sessionStorage.removeItem("uploadedPhotoName");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [router]);

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="bg-[#03030a] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm w-full">
            {/* Pulsing orb */}
            <div className="relative inline-flex items-center justify-center w-28 h-28 mb-10">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: "radial-gradient(circle, #c9a84c, transparent)" }} />
              <div className="absolute inset-2 rounded-full animate-pulse opacity-30"
                style={{ background: "radial-gradient(circle, #c9a84c, transparent)" }} />
              <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.04))",
                  border: "1.5px solid rgba(201,168,76,0.3)",
                  boxShadow: "0 0 60px rgba(201,168,76,0.15)",
                }}>
                <span className="text-4xl">✨</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-white mb-2">
              Creating your dream life
            </h2>
            <p className="text-white/35 text-sm mb-8">{statusText}</p>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-[3000ms] ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #b8923e, #f5e6b8, #c9a84c)",
                  boxShadow: "0 0 12px rgba(201,168,76,0.6)",
                }}
              />
            </div>
            <p className="text-white/20 text-xs">This takes 15–60 seconds · please don&apos;t close this tab</p>
          </div>
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <main className="bg-[#03030a] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-6">😔</div>
            <h2 className="text-white text-xl font-semibold mb-3">Generation failed</h2>
            <p className="text-white/40 text-sm mb-8">{error}</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-black text-sm"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}
            >
              Try Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── Results ── */
  return (
    <main className="bg-[#03030a] min-h-screen">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,76,0.05) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-24">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest">Your Results</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Your{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg, #c9a84c, #f5e6b8, #c9a84c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Dream Life
            </span>
          </h1>
          <p className="text-white/35 text-sm">Long-press on mobile or right-click on desktop to save any photo.</p>
        </div>

        {/* Results grid */}
        <div className={`grid gap-5 ${results.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
          {results.map(({ scenario, imageUrl }) => {
            const meta = SCENARIO_LABELS[scenario] ?? { label: scenario, emoji: "🌟" };
            return (
              <div
                key={scenario}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={meta.label} className="w-full object-cover" />
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{meta.emoji}</span>
                    <span className="text-white font-medium text-sm">{meta.label}</span>
                  </div>
                  <a
                    href={imageUrl}
                    download={`dreamlife-${scenario}.jpg`}
                    className="text-xs px-3 py-1.5 rounded-full transition-colors"
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.25)",
                      color: "#c9a84c",
                    }}
                  >
                    Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 space-y-4">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-black text-base transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
              boxShadow: "0 0 50px rgba(201,168,76,0.35), 0 5px 30px rgba(0,0,0,0.5)",
            }}
          >
            Generate More Photos
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p className="text-white/20 text-xs">Share your results with friends 📸</p>
        </div>
      </div>
    </main>
  );
}
