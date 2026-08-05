"use client";

import { useState, useTransition } from "react";
import { generateRiesgosAnalysis } from "@/app/app/actions";

export interface RiesgosAnalysis {
  veredicto: "GO" | "GO_CON_CONDICIONES" | "NO_GO" | "PENDIENTE";
  confianza: number;
  resumen: string;
  riesgos: Array<{
    nivel: "alto" | "medio" | "bajo";
    categoria: string;
    titulo: string;
    descripcion: string;
    mitigacion?: string;
  }>;
  mitigaciones: string[];
  varEstimado: number;
  countAlto?: number;
  countMedio?: number;
  countBajo?: number;
  generated_at?: string;
}

const VERDICT = {
  GO: { label: "GO · PROCEDE", color: "var(--color-success)", glow: "rgba(34,197,94,0.12)" },
  GO_CON_CONDICIONES: { label: "GO CON CONDICIONES", color: "var(--color-warning)", glow: "rgba(245,158,11,0.12)" },
  NO_GO: { label: "NO GO · NO PROCEDE", color: "var(--color-danger)", glow: "rgba(239,68,68,0.12)" },
  PENDIENTE: { label: "PENDIENTE", color: "var(--color-faint)", glow: "transparent" },
} as const;

export function RiesgosAnalysisPanel({
  projectId,
  analysis,
  hasInputs,
}: {
  projectId: string;
  analysis: RiesgosAnalysis | null;
  hasInputs: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await generateRiesgosAnalysis(projectId);
      if (res && "error" in res) setError(res.error);
    });
  }

  return (
    <div
      className="rounded-xl border-2 p-5"
      style={{
        borderColor: analysis ? VERDICT[analysis.veredicto].color : "var(--color-violet)",
        background: analysis ? VERDICT[analysis.veredicto].glow : "rgba(139,92,246,0.06)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-[4px] bg-violet text-[8px] font-black text-white">
          AI
        </span>
        <span className="text-[12px] font-bold text-violet-sub">
          Veredicto final · Riesgos + GO/NO-GO
        </span>
        <button
          onClick={run}
          disabled={pending || !hasInputs}
          className="ml-auto rounded-md border border-violet/50 bg-violet/10 px-3 py-1.5 text-[12px] font-bold text-violet-sub transition-colors hover:bg-violet/20 disabled:opacity-50"
        >
          {pending ? "Sintetizando…" : analysis ? "Regenerar" : "Generar veredicto"}
        </button>
      </div>

      {!hasInputs && (
        <p className="mt-3 text-[13px] text-faint">
          Para generar el veredicto final necesitas haber analizado al menos
          Terreno, Zonificación, Costos, Mercado y Financiero. Esta es la
          última herramienta del proforma — depende de las 7 anteriores.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {pending && (
        <p className="mt-3 text-[13px] text-violet-sub">
          Claude está consolidando riesgos de las 7 herramientas y emitiendo
          el veredicto final…
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
              <span className="text-faint">VaR: </span>
              <span className="tabular font-bold text-ink">
                {(analysis.varEstimado * 100).toFixed(0)}%
              </span>
              <span className="text-faint"> de la inversión</span>
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">
            {analysis.resumen}
          </p>

          {/* Resumen de la matriz */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <RiskCount
              label="Altos"
              count={analysis.countAlto ?? analysis.riesgos.filter((r) => r.nivel === "alto").length}
              color="var(--color-danger)"
            />
            <RiskCount
              label="Medios"
              count={analysis.countMedio ?? analysis.riesgos.filter((r) => r.nivel === "medio").length}
              color="var(--color-warning)"
            />
            <RiskCount
              label="Bajos"
              count={analysis.countBajo ?? analysis.riesgos.filter((r) => r.nivel === "bajo").length}
              color="var(--color-success)"
            />
          </div>

          {/* Lista de riesgos */}
          {analysis.riesgos.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
                Matriz de riesgos
              </div>
              <ul className="mt-3 space-y-2">
                {analysis.riesgos.map((r, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-line bg-base/40 p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 shrink-0 rounded-sm px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide"
                        style={
                          r.nivel === "alto"
                            ? { background: "rgba(239,68,68,0.18)", color: "var(--color-danger)" }
                            : r.nivel === "medio"
                              ? { background: "rgba(245,158,11,0.18)", color: "var(--color-warning)" }
                              : { background: "rgba(34,197,94,0.18)", color: "var(--color-success)" }
                        }
                      >
                        {r.nivel}
                      </span>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold text-ink">
                          {r.titulo}
                        </div>
                        <div className="mt-0.5 text-[12px] leading-relaxed text-muted">
                          {r.descripcion}
                        </div>
                        {r.mitigacion && (
                          <div className="mt-1 text-[12px] text-faint">
                            <span className="font-bold text-ink">Mitigación: </span>
                            {r.mitigacion}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mitigaciones */}
          {analysis.mitigaciones.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
                Plan de mitigación priorizado
              </div>
              <ol className="mt-3 space-y-1.5">
                {analysis.mitigaciones.map((m, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-lg border border-line bg-base/40 px-3 py-2 text-[12.5px] text-muted"
                  >
                    <span className="tabular w-5 shrink-0 text-right text-faint">
                      {i + 1}.
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RiskCount({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-raised p-4 text-center">
      <div className="tabular text-[24px] font-extrabold" style={{ color }}>
        {count}
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-faint">
        {label}
      </div>
    </div>
  );
}