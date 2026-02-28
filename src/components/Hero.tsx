"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    type P = { x: number; y: number; vx: number; vy: number; op: number; size: number; pulse: number };
    const particles: P[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2, vy: -Math.random() * 0.3 - 0.05,
      op: Math.random() * 0.45 + 0.1, size: Math.random() * 1.4 + 0.3,
      pulse: Math.random() * Math.PI * 2,
    }));
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.pulse += 0.018;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.op * (0.7 + 0.3 * Math.sin(p.pulse))})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.55 }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 30% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />

      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #03030a, transparent)" }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 pt-44 pb-24 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 items-center">

        {/* ── LEFT: Copy ── */}
        <div>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-gold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a84c]" />
            </span>
            <span className="text-[#c9a84c] text-sm font-medium tracking-widest uppercase">AI Luxury Photos</span>
          </div>

          <h1 className="font-serif text-[clamp(40px,4.8vw,72px)] font-bold leading-[1.08] tracking-tight mb-7">
            <span className="block text-white">See Yourself</span>
            <span className="block italic pb-3" style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #f5e6b8 40%, #e8c96a 60%, #c9a84c 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Living Luxury
            </span>
          </h1>

          <div className="flex items-center gap-4 mb-7">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
            <svg className="w-4 h-4 text-[#c9a84c]/50 spin-slow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L19 7L14.74 11.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 11.74L5 7L10.91 8.26L12 2Z" />
            </svg>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
          </div>

          <p className="font-serif italic text-lg text-white/25 mb-7 tracking-wide">
            &ldquo;Fake it till you make it.&rdquo;
          </p>

          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm font-light">
            Upload your photo and we&apos;ll place you inside a
            <span className="text-white/70"> private jet</span>,
            <span className="text-white/70"> Lamborghini</span>,
            <span className="text-white/70"> superyacht</span> — delivered to your inbox within 24 hours.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
            <Link
              href="/upload"
              className="group relative overflow-hidden px-8 py-4 rounded-full text-base font-semibold text-black transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #b8923e, #e8c96a, #f5e6b8, #c9a84c)",
                boxShadow: "0 0 50px rgba(201,168,76,0.4), 0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              See My Dream Life →
              </span>
            </Link>
            <a href="#demo" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors py-4">
              See examples
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 text-sm text-white/40">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-[#c9a84c]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span><strong className="text-[#c9a84c]">2,847</strong> dreams created this week</span>
          </div>
        </div>

        {/* ── RIGHT: Before / After showcase ── */}
        <div className="w-full">
          {/* Images side by side */}
          <div className="relative grid grid-cols-2 gap-0 rounded-3xl overflow-hidden"
            style={{
              border: "1px solid rgba(201,168,76,0.2)",
              boxShadow: "0 0 80px rgba(201,168,76,0.1), 0 30px 80px rgba(0,0,0,0.6)",
            }}>

            {/* ── BEFORE ── */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo-person.jpg" alt="Before" className="w-full h-full object-cover object-top" />
              {/* greyscale + dark overlay to look "raw" */}
              <div className="absolute inset-0" style={{ background: "rgba(3,3,10,0.35)", mixBlendMode: "multiply" }} />
              <div className="absolute inset-0" style={{ backdropFilter: "saturate(0.4)" }} />
              {/* gradient bottom */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,3,10,0.75) 0%, transparent 55%)" }} />

              {/* BEFORE label */}
              <div className="absolute top-3 left-3">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Before
                </span>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-3 left-3">
                <p className="text-white/35 text-[11px] font-medium">Your selfie</p>
              </div>
            </div>

            {/* ── CENTER DIVIDER with transform icon ── */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center gap-1 pointer-events-none">
              {/* vertical line top */}
              <div className="w-px flex-1" style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.6))" }} />
              {/* icon */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #b8923e, #e8c96a)",
                  boxShadow: "0 0 20px rgba(201,168,76,0.7), 0 0 40px rgba(201,168,76,0.3)",
                }}>
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              {/* vertical line bottom */}
              <div className="w-px flex-1" style={{ background: "linear-gradient(to top, transparent, rgba(201,168,76,0.6))" }} />
            </div>

            {/* ── AFTER ── */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo-jet-dubai.png" alt="AI Result" className="w-full h-full object-cover object-center" />
              {/* gold-tinted gradient for vibrancy */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 50%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,3,10,0.7) 0%, transparent 50%)" }} />

              {/* AFTER label */}
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-black"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", boxShadow: "0 0 12px rgba(201,168,76,0.5)" }}>
                  After ✨
                </span>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[#c9a84c] text-[11px] font-semibold">Dubai · Private Jet ✈️</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/40 text-[10px]">AI generated</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA strip below */}
          <Link href="/upload"
            className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-black transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", boxShadow: "0 0 30px rgba(201,168,76,0.25)" }}>
            Upload my photo →
          </Link>

          <p className="text-center text-white/20 text-xs mt-3">
            Delivered to your inbox within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
