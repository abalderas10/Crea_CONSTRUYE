"use client";

import { useState, useTransition } from "react";
import { generateCostosAnalysis } from "@/app/app/actions";

export interface CostosAnalysis {
  veredicto: "EN_PRESUPUESTO" | "AJUSTAR_PARTIDAS" | "FUERA_DE_PRESUPUESTO";
  confianza: number;
  resumen: string;
  partidas_criticas: string[];
  partidas_optimizables: string[];
  recomendaciones: string[];
  costo_total_estimado: string;
  costo_por_m2: string;
  generated_at?: string;
}

const VERDICT = {
  EN_PRESUPUESTO: { label: "EN PRESUPUESTO", color: "var(--color-success)" },
  AJUSTAR_PARTIDAS: { label: "AJUSTAR PARTIDAS", color: "var(--color-warning)" },
  FUERA_DE_PRESUPUESTO: { label: "FUERA DE PRESUPUESTO", color: "var(--color-danger)" },
} as const;

export function CostosAnalysisPanel({
  projectId,
  analysis,
  hasInputs,
}: {
  projectId: string;
  analysis: CostosAnalysis | null;
  hasInputs: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await generateCostosAnalysis(projectId);
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
          Análisis de Claude · Presupuesto
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
          Guarda primero los datos de construcción para poder analizar.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {pending && (
        <p className="mt-3 text-[13px] text-violet-sub">
          Claude está revisando el presupuesto contra parámetros de mercado…
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
              <span className="text-faint">Costo total: </span>
              <span className="tabular font-bold text-ink">{analysis.costo_total_estimado}</span>
            </span>
            <span className="text-[12px] text-muted">
              <span className="text-faint">/ m²: </span>
              <span className="tabular font-bold text-ink">{analysis.costo_por_m2}</span>
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">
            {analysis.resumen}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <List
              title="Partidas críticas"
              items={analysis.partidas_criticas}
              color="var(--color-danger)"
            />
            <List
              title="Optimizables"
              items={analysis.partidas_optimizables}
              color="var(--color-success)"
            />
          </div>

          {analysis.recomendaciones.length > 0 && (
            <Box title="Recomendaciones">
              <ol className="space-y-1.5">
                {analysis.recomendaciones.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-lg border border-line bg-base/40 px-3 py-2 text-[12.5px] text-muted"
                  >
                    <span className="tabular w-5 shrink-0 text-right text-faint">
                      {i + 1}.
                    </span>
                    <span>{r}</span>
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

function List({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-line bg-base/40 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color }}>
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-muted">
            <span style={{ color }}>·</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Box({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-xl border border-line bg-raised p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}