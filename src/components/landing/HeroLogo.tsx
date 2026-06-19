// Logo grande animado para el hero: Chispa C (la C se traza al cargar,
// el destello titila) + wordmark creaConstruye.

export function HeroLogo() {
  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Glow Volt que respira detrás de la C */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[22%] h-[340px] w-[340px] rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, #C8FF00 0%, transparent 70%)",
          animation: "glow-breathe 4.5s ease-in-out infinite",
        }}
      />

      {/* Chispa C */}
      <svg
        viewBox="0 0 100 100"
        className="relative w-52 sm:w-64"
        role="img"
        aria-label="creaConstruye"
        style={{ filter: "drop-shadow(0 0 26px rgba(200,255,0,0.18))" }}
      >
        <g transform="translate(4,0)">
          <path
            className="logo-c-draw"
            d="M64.9 77 A33 33 0 1 1 64.9 23"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            className="logo-spark"
            d="M50 35 L55 45 L65 50 L55 55 L50 65 L45 55 L35 50 L45 45 Z"
            fill="var(--color-volt)"
          />
        </g>
      </svg>

      {/* Wordmark */}
      <div className="relative mt-6 text-4xl font-black tracking-tight sm:text-5xl">
        <span className="font-normal text-muted">crea</span>
        <span className="text-ink">Construye</span>
      </div>
      <p className="relative mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-faint">
        Proforma Inteligente · México
      </p>
    </div>
  );
}
