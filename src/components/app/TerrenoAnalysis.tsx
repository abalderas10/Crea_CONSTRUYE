"use client";

import { useState, useTransition } from "react";
import { generateTerrenoAnalysis } from "@/app/app/actions";

export interface Analysis {
  recomendacion: "COMPRAR" | "NEGOCIAR" | "NO_COMPRAR";
  precio_objetivo_m2: string;
  confianza: number;
  resumen: string;
  fortalezas: string[];
  riesgos: string[];
  generated_at?: string;
}

const VERDICT = {
  COMPRAR: { label: "COMPRAR", color: "var(--color-success)" },
  NEGOCIAR: { label: "NEGOCIAR", color: "var(--color-warning)" },
  NO_COMPRAR: { label: "NO COMPRAR", color: "var(--color-danger)" },
} as const;

export function TerrenoAnalysis({
  projectId,
  analysis,
  hasInputs,
}: {
  projectId: string;
  analysis: Analysis | null;
  hasInputs: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const res = await generateTerrenoAnalysis(projectId);
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
          Análisis de Claude · Decisión
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
          Guarda primero los datos de localización para poder analizar.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {pending && (
        <p className="mt-3 text-[13px] text-violet-sub">
          Claude está analizando el terreno con datos de México…
        </p>
      )}

      {analysis && !pending && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-md px-3 py-1.5 text-[13px] font-extrabold"
              style={{
                color: VERDICT[analysis.recomendacion].color,
                background: `${VERDICT[analysis.recomendacion].color}1f`,
              }}
            >
              {VERDICT[analysis.recomendacion].label}
            </span>
            <span className="text-[13px] text-muted">
              Precio objetivo:{" "}
              <span className="tabular font-bold text-volt">
                {analysis.precio_objetivo_m2}
              </span>
            </span>
            <span className="text-[12px] text-faint">
              Confianza {analysis.confianza}%
            </span>
          </div>

          <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">
            {analysis.resumen}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <List title="Fortalezas" items={analysis.fortalezas} color="var(--color-success)" />
            <List title="Riesgos" items={analysis.riesgos} color="var(--color-warning)" />
          </div>
        </div>
      )}
    </div>
  );
}

function List({ title, items, color }: { title: string; items: string[]; color: string }) {
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
