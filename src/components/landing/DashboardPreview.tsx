// Mockup estático del dashboard para el hero. Comunica el producto de un vistazo.

import { LogoMark } from "@/components/brand/LogoMark";

const KPIS = [
  { label: "Precio/m²", value: "$8,420", accent: true },
  { label: "TIR anual", value: "24.5%", accent: false },
  { label: "Absorción", value: "72%", accent: false },
  { label: "Riesgo", value: "GO", accent: false, ok: true },
];

export function DashboardPreview() {
  return (
    <div className="rounded-xl border border-line bg-raised p-3 shadow-card sm:p-4">
      {/* Topbar simulada */}
      <div className="mb-3 flex items-center gap-2 border-b border-line pb-3">
        <LogoMark size={16} />
        <span className="text-[12px] font-semibold text-ink">
          Torre Naucalpan Centro
        </span>
        <span className="ml-auto rounded-sm bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
          3/8
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="rounded-md border bg-base px-3 py-2.5"
            style={{ borderColor: k.accent ? "rgba(200,255,0,0.25)" : "var(--color-line)" }}
          >
            <div className="text-[8px] font-bold uppercase tracking-[0.1em] text-faint">
              {k.label}
            </div>
            <div
              className="tabular text-lg font-black"
              style={{
                color: k.accent
                  ? "var(--color-volt)"
                  : k.ok
                    ? "var(--color-success)"
                    : "var(--color-ink)",
              }}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Mini chart */}
      <div className="mt-2 rounded-md border border-line bg-base px-3 py-2.5">
        <div className="mb-1 text-[9px] text-faint">Tendencia de precios · 5 años</div>
        <svg viewBox="0 0 240 56" className="h-12 w-full">
          <defs>
            <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C8FF00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="0,46 48,42 96,34 144,26 192,16 240,10 240,56 0,56"
            fill="url(#voltGrad)"
          />
          <polyline
            points="0,46 48,42 96,34 144,26 192,16 240,10"
            fill="none"
            stroke="#C8FF00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="240" cy="10" r="3" fill="#0C0C0E" stroke="#C8FF00" strokeWidth="2" />
        </svg>
      </div>

      {/* AI panel */}
      <div
        className="mt-2 rounded-md border px-3 py-2.5"
        style={{ borderColor: "rgba(139,92,246,0.28)", background: "rgba(139,92,246,0.06)" }}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span className="grid h-4 w-4 place-items-center rounded-[4px] bg-violet text-[7px] font-black text-white">
            AI
          </span>
          <span className="text-[9px] font-bold text-violet-sub">
            Claude · Análisis de Mercado
          </span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet animate-pulse-slow" />
        </div>
        <p className="text-[10px] leading-relaxed text-muted">
          Precio objetivo{" "}
          <span className="tabular font-bold text-volt">$8,200–8,400</span>/m² ·
          Déficit de <span className="font-semibold text-ink">~4,200 unidades</span>{" "}
          en zona. Recomiendo unidades de 85–100 m² con home office.
        </p>
      </div>
    </div>
  );
}
