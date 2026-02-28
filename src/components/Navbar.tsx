"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Demo", href: "#demo" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#03030a]/85 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Logo size={36} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm text-white/50 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm text-white/50 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {l.label}
              </a>
            )
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link
            href="/upload"
            className="relative group overflow-hidden px-5 py-2.5 rounded-full text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.04]"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96a, #c9a84c)",
              backgroundSize: "200% 100%",
              boxShadow: "0 0 20px rgba(201,168,76,0.3), 0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
              </svg>
              Try Free
            </span>
            <div className="absolute inset-0 shimmer-anim opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl glass"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}
        style={{ background: "rgba(3,3,10,0.95)", backdropFilter: "blur(30px)" }}
      >
        <div className="px-6 py-4 border-t border-white/5 flex flex-col gap-1">
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {l.label}
              </a>
            )
          )}
          <Link
            href="/upload"
            className="mt-3 text-center py-3.5 rounded-full text-sm font-semibold text-black"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)" }}
          >
            Upload Your Photo
          </Link>
        </div>
      </div>
    </nav>
  );
}
