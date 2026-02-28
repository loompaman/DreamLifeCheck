import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative py-20 px-6 overflow-hidden">
      {/* Top divider */}
      <div className="gold-divider mb-16" />

      {/* Decorative background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-serif text-[200px] font-bold leading-none tracking-tighter opacity-[0.015] text-white"
        >
          DLC
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-14">
          {/* Brand — wider */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center mb-5">
              <Logo size={32} />
            </Link>
            <p className="text-sm text-white/35 max-w-xs leading-relaxed mb-6">
              AI-powered luxury lifestyle visualization. See yourself living the life
              you&apos;ve always dreamed of — before you even build it.
            </p>
            <div className="flex gap-2">
              {[
                { letter: "𝕏", label: "Twitter" },
                { letter: "in", label: "Instagram" },
                { letter: "Li", label: "LinkedIn" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40 hover:text-[#c9a84c] hover:border-[#c9a84c]/25 transition-all text-xs font-bold">
                  {s.letter}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {["Features", "Demo", "Pricing", "Upload Photo"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">© 2026 DreamLifeCheck. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <svg className="w-3 h-3 text-[#c9a84c]/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L19 7L14.74 11.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 11.74L5 7L10.91 8.26L12 2Z" />
            </svg>
            Made for dreamers everywhere
          </div>
        </div>
      </div>
    </footer>
  );
}
