"use client";

import { useState, useTransition } from "react";
import { generateFinancieroAnalysis } from "@/app/app/actions";

export interface FinancieroAnalysis {
  veredicto: "VIABLE" | "VIABLE_CON_CONDICIONES" | "NO_VIABLE";
  confianza: number;
  resumen: string;
  tir_estimada: string;
  payback_estimado: string;
  mejor_escenario: string;
  alertas: string[];
  recomendaciones: string[];
  generated_at?: string;
}

const VERDICT = {
  VIABLE: { label: "VIABLE", color: "var(--color-success)" },
  VIABLE_CON_CONDICIONES: { label: "VIABLE CON CONDICIONES", color: "var(--color-warning)" },
  NO_VIABLE: { label: "NO VIABLE", color: "var(--color-danger)" },
} as const;

export function FinancieroAnalysisPanel({
  projectId,
  analysis,
  hasInputs,
}: {
  projectId: string;
  analysis: FinancieroAnalysis | null;
  hasInputs: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await generateFinancieroAnalysis(projectId);
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
          Análisis de Claude · Financiero
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
          Guarda primero los datos financieros para poder analizar.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {pending && (
        <p className="mt-3 text-[13px] text-violet-sub">
          Claude está evaluando estructura de capital y escenarios…
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
              <span className="text-faint">TIR: </span>
              <span className="tabular font-bold text-ink">{analysis.tir_estimada}</span>
            </span>
            <span className="text-[12px] text-muted">
              <span className="text-faint">Payback: </span>
              <span className="tabular font-bold text-ink">{analysis.payback_estimado}</span>
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">
            {analysis.resumen}
          </p>

          <div className="mt-4 rounded-xl border border-line bg-raised p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
              Mejor escenario: <span className="ml-2 text-volt">{analysis.mejor_escenario}</span>
            </div>
          </div>

          {analysis.alertas.length > 0 && (
            <Box title="Alertas financieras" tone="danger">
              <ul className="space-y-1.5">
                {analysis.alertas.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[12.5px] leading-relaxed text-muted"
                  >
                    <span className="text-danger">·</span>
                    {a}
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {analysis.recomendaciones.length > 0 && (
            <Box title="Recomendaciones">
              <ol className="space-y-1.5">
                {analysis.recomendaciones.map((rec, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-lg border border-line bg-base/40 px-3 py-2 text-[12.5px] text-muted"
                  >
                    <span className="tabular w-5 shrink-0 text-right text-faint">
                      {i + 1}.
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ol>
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
  tone?: "neutral" | "danger";
  children: React.ReactNode;
}) {
  const borderColor = tone === "danger" ? "var(--color-danger)" : "var(--color-line)";
  return (
    <div className="mt-4 rounded-xl border bg-raised p-5" style={{ borderColor }}>
      <div
        className="text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ color: tone === "danger" ? "var(--color-danger)" : "var(--color-faint)" }}
      >
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}