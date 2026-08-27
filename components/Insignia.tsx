interface InsigniaProps {
  className?: string;
  animated?: boolean;
}

/**
 * The recurring visual signature of Maveli's Trial:
 * a pookalam-inspired medallion (concentric petal rings)
 * enclosing the three ascending steps of Vamana.
 * Built entirely from SVG primitives — no external art assets.
 */
export function Insignia({ className = "", animated = true }: InsigniaProps) {
  const petals = Array.from({ length: 16 });

  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      role="img"
      aria-label="Ornamental pookalam medallion enclosing the three steps of Vamana"
    >
      <defs>
        <radialGradient id="insignia-glow" cx="50%" cy="46%" r="60%">
          <stop offset="0%" stopColor="#E3C377" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#E3C377" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="insignia-step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3C377" />
          <stop offset="100%" stopColor="#B8892B" />
        </linearGradient>
      </defs>

      <circle cx="250" cy="250" r="230" fill="url(#insignia-glow)" />

      {/* outer petal ring — pookalam */}
      <g className={animated ? "origin-center animate-spin-slow" : ""} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        {petals.map((_, i) => {
          const angle = (360 / petals.length) * i;
          return (
            <ellipse
              key={i}
              cx="250"
              cy="82"
              rx="14"
              ry="34"
              fill={i % 2 === 0 ? "#123A2C" : "#A85327"}
              fillOpacity="0.85"
              transform={`rotate(${angle} 250 250)`}
            />
          );
        })}
      </g>

      {/* dotted ring */}
      <circle
        cx="250"
        cy="250"
        r="168"
        fill="none"
        stroke="#B8892B"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeDasharray="1 10"
      />

      {/* inner ring */}
      <circle cx="250" cy="250" r="132" fill="none" stroke="#123A2C" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* base plinth */}
      <rect x="150" y="330" width="200" height="14" rx="3" fill="#123A2C" />

      {/* three ascending steps */}
      <rect x="176" y="298" width="60" height="32" rx="2" fill="url(#insignia-step)" />
      <rect x="220" y="256" width="60" height="74" rx="2" fill="url(#insignia-step)" />
      <rect x="264" y="214" width="60" height="116" rx="2" fill="url(#insignia-step)" />

      {/* lamp flame atop the final step */}
      <path
        d="M294 214 c0 -14 -9 -18 -9 -30 c0 10 -13 16 -13 30 a11 13 0 0 0 22 0 Z"
        fill="#E3C377"
      />
      <circle cx="294" cy="184" r="3" fill="#E3C377" />
    </svg>
  );
}
