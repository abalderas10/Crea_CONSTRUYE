"use client";

import { useState, useTransition } from "react";
import { generateMercadoAnalysis } from "@/app/app/actions";

export interface MercadoAnalysis {
  veredicto: "DEMANDA_FUERTE" | "DEMANDA_MODERADA" | "DEMANDA_DEBIL";
  confianza: number;
  resumen: string;
  precio_objetivo_m2: string;
  absorcion_mensual: number;
  score_demanda: number;
  perfil_comprador: string;
  producto_optimo: string;
  insights: string[];
  alertas: string[];
  generated_at?: string;
}

const VERDICT = {
  DEMANDA_FUERTE: { label: "DEMANDA FUERTE", color: "var(--color-success)" },
  DEMANDA_MODERADA: { label: "DEMANDA MODERADA", color: "var(--color-warning)" },
  DEMANDA_DEBIL: { label: "DEMANDA DÉBIL", color: "var(--color-danger)" },
} as const;

export function MercadoAnalysisPanel({
  projectId,
  analysis,
  hasInputs,
}: {
  projectId: string;
  analysis: MercadoAnalysis | null;
  hasInputs: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await generateMercadoAnalysis(projectId);
      if (res && "error" in res) setError(res.error);
    });
  }

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "rgba(139,92,246,0.28)", background: "rgba(139,92,246,0.06)" }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-[4px] bg-violet text-[8px] font-black text-white">
          AI
        </span>
        <span className="text-[12px] font-bold text-violet-sub">
          Análisis de Claude · Mercado
        </span>
        <button
          onClick={run}
          disabled={pending || !hasInputs}
          className="ml-auto rounded-md border border-violet/50 bg-violet/10 px-3 py-1.5 text-[12px] font-bold text-violet-sub transition-colors hover:bg-violet/20 disabled:opacity-50"
        >
          {pending ? "Analizando…" : analysis ? "Regenerar" : "Generar análisis"}
        </button>
      </div>

      {!hasInputs && (
        <p className="mt-3 text-[13px] text-faint">
          Guarda primero los datos de mercado para poder analizar.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {pending && (
        <p className="mt-3 text-[13px] text-violet-sub">
          Claude está revisando oferta comparable y demanda de la zona…
        </p>
      )}

      {analysis && !pending && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-md px-3 py-1.5 text-[13px] font-extrabold"
              style={{
                color: VERDICT[analysis.veredicto].color,
                background: `${VERDICT[analysis.veredicto].color}1f`,
              }}
            >
              {VERDICT[analysis.veredicto].label}
            </span>
            <span className="text-[12px] text-faint">
              Confianza {analysis.confianza}%
            </span>
            <span className="text-[12px] text-muted">
              <span className="text-faint">Precio objetivo: </span>
              <span className="tabular font-bold text-ink">{analysis.precio_objetivo_m2}</span>
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">
            {analysis.resumen}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Box title="Perfil del comprador">
              <p className="text-[13px] leading-relaxed text-muted">
                {analysis.perfil_comprador}
              </p>
            </Box>
            <Box title="Producto óptimo recomendado">
              <p className="text-[13px] leading-relaxed text-muted">
                {analysis.producto_optimo}
              </p>
            </Box>
          </div>

          {analysis.insights.length > 0 && (
            <Box title="Insights clave">
              <ul className="space-y-1.5">
                {analysis.insights.map((it, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[12.5px] leading-relaxed text-muted"
                  >
                    <span className="text-violet-sub">·</span>
                    {it}
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {analysis.alertas.length > 0 && (
            <Box title="Alertas de mercado" tone="warning">
              <ul className="space-y-1.5">
                {analysis.alertas.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[12.5px] leading-relaxed text-muted"
                  >
                    <span className="text-warning">·</span>
                    {a}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </div>
      )}
    </div>
  );
}

function Box({
  title,
  tone = "neutral",
  children,
}: {
  title: string;
  tone?: "neutral" | "warning";
  children: React.ReactNode;
}) {
  const borderColor = tone === "warning" ? "var(--color-warning)" : "var(--color-line)";
  return (
    <div className="mt-4 rounded-xl border bg-raised p-5" style={{ borderColor }}>
      <div
        className="text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ color: tone === "warning" ? "var(--color-warning)" : "var(--color-faint)" }}
      >
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}