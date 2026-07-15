/**
 * BeerBottle — SVG beer bottle with realistic gradients and Lagunitas label.
 * Height prop controls the rendered size.
 */
const BeerBottle = ({ height = 420 }) => {
  const aspect = 420 / 130; // original viewBox ratio
  const width  = Math.round(height / aspect);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 130 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lagunitas IPA bottle"
      role="img"
    >
      <defs>
        {/* Bottle glass gradient */}
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#c8820a" stopOpacity="0.85" />
          <stop offset="25%"  stopColor="#e8a020" stopOpacity="0.95" />
          <stop offset="50%"  stopColor="#f5c040" stopOpacity="1" />
          <stop offset="75%"  stopColor="#d4900f" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#9a6008" stopOpacity="0.85" />
        </linearGradient>

        {/* Highlight streak */}
        <linearGradient id="highlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="30%"  stopColor="white" stopOpacity="0.35" />
          <stop offset="60%"  stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Cap gradient */}
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#888" />
          <stop offset="50%"  stopColor="#ddd" />
          <stop offset="100%" stopColor="#888" />
        </linearGradient>

        {/* Label gradient */}
        <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#ede7d9" />
        </linearGradient>

        {/* Neck gradient */}
        <linearGradient id="neck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#b07010" />
          <stop offset="40%"  stopColor="#e09020" />
          <stop offset="60%"  stopColor="#e8a030" />
          <stop offset="100%" stopColor="#904808" />
        </linearGradient>

        <clipPath id="bottleClip">
          <path d="
            M52,8 L52,28
            C52,28 30,45 24,80
            C18,115 18,140 18,200
            L18,380
            C18,392 28,400 65,400
            C102,400 112,392 112,380
            L112,200
            C112,140 112,115 106,80
            C100,45 78,28 78,28
            L78,8 Z
          " />
        </clipPath>
      </defs>

      {/* ── Bottle body ── */}
      <path
        d="
          M52,8 L52,28
          C52,28 30,45 24,80
          C18,115 18,140 18,200
          L18,380
          C18,392 28,400 65,400
          C102,400 112,392 112,380
          L112,200
          C112,140 112,115 106,80
          C100,45 78,28 78,28
          L78,8 Z
        "
        fill="url(#glass)"
      />

      {/* Highlight streak */}
      <path
        clipPath="url(#bottleClip)"
        d="M45,30 L45,395 Q55,398 60,395 L60,30 Z"
        fill="url(#highlight)"
        opacity="0.7"
      />

      {/* Beer fill (inside) */}
      <path
        clipPath="url(#bottleClip)"
        d="M18,170 L18,380 C18,392 28,400 65,400 C102,400 112,392 112,380 L112,170 Z"
        fill="#c8720a"
        opacity="0.3"
      />

      {/* ── Label ── */}
      <rect x="22" y="200" width="86" height="140" rx="2" fill="url(#label)" />

      {/* Red top stripe */}
      <rect x="22" y="200" width="86" height="22" fill="#C41E3A" />

      {/* Label text – LAGUNITAS */}
      <text x="65" y="217" textAnchor="middle" fill="white"
        fontFamily="Georgia, serif" fontWeight="900" fontSize="9.5" letterSpacing="2">
        LAGUNITAS
      </text>

      {/* Dog logo placeholder circle */}
      <circle cx="65" cy="250" r="20" fill="none" stroke="#1a1208" strokeWidth="1.5" />
      <text x="65" y="254" textAnchor="middle" fill="#1a1208"
        fontFamily="Georgia, serif" fontWeight="700" fontSize="7" letterSpacing="0.5">
        EST 1993
      </text>

      {/* IPA large text */}
      <text x="65" y="285" textAnchor="middle" fill="#C41E3A"
        fontFamily="Georgia, serif" fontWeight="900" fontSize="22" letterSpacing="3">
        IPA
      </text>

      {/* India Pale Ale subtitle */}
      <text x="65" y="298" textAnchor="middle" fill="#5c4d3a"
        fontFamily="Arial, sans-serif" fontWeight="700" fontSize="6" letterSpacing="2">
        INDIA PALE ALE
      </text>

      {/* ABV line */}
      <text x="65" y="318" textAnchor="middle" fill="#5c4d3a"
        fontFamily="Arial, sans-serif" fontSize="5.5" letterSpacing="1">
        ABV 6.2%  ·  IBU 51.1
      </text>

      {/* Red bottom stripe */}
      <rect x="22" y="328" width="86" height="12" fill="#C41E3A" />

      {/* ── Neck ── */}
      <path
        d="M52,8 L52,50 C52,50 42,58 40,68 L90,68 C88,58 78,50 78,50 L78,8 Z"
        fill="url(#neck)"
      />

      {/* Neck label */}
      <rect x="44" y="52" width="42" height="14" rx="1" fill="#f5f0e8" opacity="0.9" />
      <text x="65" y="62" textAnchor="middle" fill="#C41E3A"
        fontFamily="Georgia, serif" fontWeight="900" fontSize="6" letterSpacing="1.5">
        PETALUMA·CA
      </text>

      {/* ── Cap ── */}
      <rect x="48" y="0" width="34" height="10" rx="2" fill="url(#cap)" />
      <rect x="44" y="7" width="42" height="5" rx="1" fill="#777" />

      {/* Bottle edge shadow */}
      <path
        d="
          M52,8 L52,28
          C52,28 30,45 24,80
          C18,115 18,140 18,200
          L18,380
          C18,392 28,400 65,400
        "
        stroke="#7a4a05"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="
          M78,8 L78,28
          C78,28 100,45 106,80
          C112,115 112,140 112,200
          L112,380
          C112,392 102,400 65,400
        "
        stroke="#f0c060"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
};

export default BeerBottle;
