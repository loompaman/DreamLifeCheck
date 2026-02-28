export default function Logo({ size = 40 }: { size?: number }) {
  const aspect = 2.2;
  const w = size * aspect;
  const h = size;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 220 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main gold gradient */}
        <linearGradient id="gold-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9a6e20" />
          <stop offset="25%" stopColor="#e8c96a" />
          <stop offset="50%" stopColor="#f5e6b8" />
          <stop offset="75%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#8a5e18" />
        </linearGradient>

        {/* Lighter highlight gradient */}
        <linearGradient id="gold-light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#7a5010" />
        </linearGradient>

        {/* Swoosh gradient */}
        <linearGradient id="gold-swoosh" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a5010" stopOpacity="0.3" />
          <stop offset="30%" stopColor="#c9a84c" />
          <stop offset="60%" stopColor="#e8c96a" />
          <stop offset="100%" stopColor="#9a6e20" stopOpacity="0.4" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="text-shadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7a4a00" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ── Swoosh / ribbon ── */}
      <path
        d="M 18 72 Q 60 60 110 68 Q 155 76 200 62"
        stroke="url(#gold-swoosh)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 22 78 Q 65 66 110 74 Q 155 82 198 68"
        stroke="url(#gold-swoosh)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* ── D ── */}
      <text
        x="8"
        y="68"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="bold"
        fontSize="72"
        fontStyle="italic"
        fill="url(#gold-main)"
        filter="url(#text-shadow)"
      >
        D
      </text>

      {/* ── L ── */}
      <text
        x="62"
        y="68"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="bold"
        fontSize="72"
        fontStyle="italic"
        fill="url(#gold-main)"
        filter="url(#text-shadow)"
      >
        L
      </text>

      {/* ── C ── */}
      <text
        x="112"
        y="68"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="bold"
        fontSize="72"
        fontStyle="italic"
        fill="url(#gold-main)"
        filter="url(#text-shadow)"
      >
        C
      </text>

      {/* ── Private jet ── */}
      <g transform="translate(168, 22) rotate(-28) scale(1.1)">
        {/* Fuselage */}
        <ellipse cx="12" cy="4" rx="14" ry="3.2" fill="url(#gold-light)" />
        {/* Nose */}
        <path d="M 25 4 L 30 3.5 L 25 5.5 Z" fill="url(#gold-light)" />
        {/* Main wing */}
        <path d="M 10 4 L 4 14 L 16 8 Z" fill="url(#gold-main)" opacity="0.9" />
        {/* Tail wing */}
        <path d="M -1 4 L -5 9 L 3 6 Z" fill="url(#gold-main)" opacity="0.8" />
        {/* Tail fin */}
        <path d="M -1 3 L -3 -2 L 2 3 Z" fill="url(#gold-main)" opacity="0.85" />
        {/* Engine */}
        <ellipse cx="9" cy="10" rx="3.5" ry="1.8" fill="url(#gold-light)" opacity="0.7" />
      </g>

      {/* ── Sparkle star (top-left of D) ── */}
      <g transform="translate(14, 8)">
        {/* 4-point star */}
        <path
          d="M 0 -9 L 1.5 -1.5 L 9 0 L 1.5 1.5 L 0 9 L -1.5 1.5 L -9 0 L -1.5 -1.5 Z"
          fill="url(#gold-light)"
          opacity="0.95"
        />
        {/* Inner glow */}
        <circle cx="0" cy="0" r="2" fill="#f5e6b8" opacity="0.9" />
      </g>

      {/* ── Small accent dots ── */}
      <circle cx="6" cy="40" r="1.5" fill="#c9a84c" opacity="0.4" />
      <circle cx="215" cy="45" r="1.2" fill="#c9a84c" opacity="0.35" />
    </svg>
  );
}

