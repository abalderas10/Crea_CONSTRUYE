"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  generateToolSuggestion,
  deleteProposal,
} from "@/app/app/herramientas/actions";
import { getSection, STATUS_META } from "@/lib/community/sections";
import type { ToolProposal } from "@/lib/data/community-tools";

export function ProposalCard({ proposal }: { proposal: ToolProposal }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const section = getSection(proposal.section);
  const status = STATUS_META[proposal.status];
  const sug = proposal.ai_suggestion;

  function onSuggest() {
    setError(null);
    start(async () => {
      const r = await generateToolSuggestion(proposal.id);
      if ("error" in r) setError(r.error);
      else router.refresh();
    });
  }

  function onDelete() {
    if (!confirm(`¿Borrar la propuesta "${proposal.name}"?`)) return;
    start(async () => {
      const r = await deleteProposal(proposal.id);
      if ("error" in r) setError(r.error);
      else router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-line bg-raised p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-[14px] font-extrabold"
            style={{ background: `${section.color}18`, color: section.color }}
          >
            {proposal.name.charAt(0)}
          </span>
          <div>
            <h3 className="text-[14px] font-bold leading-tight text-ink">
              {proposal.name}
            </h3>
            <span className="text-[11px] text-faint">{section.name}</span>
          </div>
        </div>
        <span
          className="shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: `${status.color}1f`, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
        {proposal.description}
      </p>

      {proposal.expert_validated && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-violet/12 px-2 py-1 text-[10px] font-bold text-violet-sub">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Validada por {proposal.expert_name || "experto"}
          {proposal.expert_field && ` · ${proposal.expert_field}`}
        </div>
      )}

      {/* Sugerencia del agente AI */}
      {sug ? (
        <div className="mt-4 rounded-lg border border-violet/30 bg-violet/8 p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-sub">
              <SparkIcon /> Sugerencia del agente
            </span>
            <span className="rounded-sm bg-base px-1.5 py-0.5 text-[10px] font-bold capitalize text-faint">
              Complejidad {sug.complejidad}
            </span>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink">
            {sug.resumen}
          </p>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-2 text-[11px] font-semibold text-violet-sub hover:underline"
          >
            {open ? "Ocultar detalle" : "Ver plan de implementación →"}
          </button>
          {open && (
            <div className="mt-3 space-y-3 border-t border-violet/20 pt-3">
              <SugList title="Pasos" items={sug.pasos} ordered />
              <SugList title="Fórmulas clave" items={sug.formulas_clave} mono />
              <SugList title="Datos necesarios" items={sug.datos_necesarios} />
              {sug.alimenta?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-faint">
                    Alimenta
                  </span>
                  {sug.alimenta.map((a) => (
                    <span
                      key={a}
                      className="rounded-sm border border-line bg-base px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onSuggest}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-md border border-violet/50 bg-violet/10 px-3 py-1.5 text-[12px] font-bold text-violet-sub hover:bg-violet/20 disabled:opacity-50"
          >
            <SparkIcon />
            {pending ? "Pensando…" : "Pedir sugerencia del agente"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <Link
          href={`/app/herramientas/${proposal.id}`}
          className="text-[11px] font-bold text-volt hover:underline"
        >
          Ver discusión →
        </Link>
        <button
          onClick={onDelete}
          disabled={pending}
          className="text-[11px] font-semibold text-faint hover:text-danger disabled:opacity-50"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}

function SugList({
  title,
  items,
  ordered,
  mono,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
  mono?: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-faint">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li
            key={i}
            className={`flex gap-2 text-[12px] leading-relaxed text-muted ${
              mono ? "font-mono text-[11px]" : ""
            }`}
          >
            <span className="text-violet-sub">{ordered ? `${i + 1}.` : "•"}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
    </svg>
  );
}
