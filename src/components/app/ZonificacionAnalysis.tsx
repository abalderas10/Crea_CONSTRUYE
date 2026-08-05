"use client";

import { useState, useTransition } from "react";
import { generateZonificacionAnalysis } from "@/app/app/actions";

export interface ZonificacionAnalysis {
  veredicto: "PROCEDE" | "AJUSTAR" | "NO_PROCEDE";
  confianza: number;
  resumen: string;
  puntos_cumplimiento: string[];
  puntos_ajuste: string[];
  permisos_orden: string[];
  riesgos_adicionales: string[];
  generated_at?: string;
}

const VERDICT = {
  PROCEDE: { label: "PROCEDE", color: "var(--color-success)" },
  AJUSTAR: { label: "AJUSTAR", color: "var(--color-warning)" },
  NO_PROCEDE: { label: "NO PROCEDE", color: "var(--color-danger)" },
} as const;

export function ZonificacionAnalysis({
  projectId,
  analysis,
  hasInputs,
}: {
  projectId: string;
  analysis: ZonificacionAnalysis | null;
  hasInputs: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await generateZonificacionAnalysis(projectId);
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
          Análisis de Claude · Regulación
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
          Guarda primero la normatividad de la zona para poder analizar.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {pending && (
        <p className="mt-3 text-[13px] text-violet-sub">
          Claude está revisando la normatividad aplicable al proyecto…
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
          </div>

          <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">
            {analysis.resumen}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <List
              title="Cumplimiento"
              items={analysis.puntos_cumplimiento}
              color="var(--color-success)"
            />
            <List
              title="Ajustes necesarios"
              items={analysis.puntos_ajuste}
              color="var(--color-warning)"
            />
          </div>

          {analysis.permisos_orden.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
                Permisos en orden lógico
              </div>
              <ol className="mt-2 space-y-1.5">
                {analysis.permisos_orden.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-lg border border-line bg-base/40 px-3 py-2 text-[12.5px] text-muted"
                  >
                    <span className="tabular w-5 shrink-0 text-right text-faint">
                      {i + 1}.
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {analysis.riesgos_adicionales.length > 0 && (
            <List
              title="Riesgos adicionales"
              items={analysis.riesgos_adicionales}
              color="var(--color-danger)"
              className="mt-4"
            />
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
  className = "",
}: {
  title: string;
  items: string[];
  color: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-line bg-base/40 p-4 ${className}`}>
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
