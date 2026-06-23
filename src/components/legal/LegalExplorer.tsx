"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AMBITO_META,
  TEMA_META,
  type Normativa,
  type Ambito,
  type Tema,
} from "@/lib/legal/normativas";

export function LegalExplorer({ normativas }: { normativas: Normativa[] }) {
  const [q, setQ] = useState("");
  const [ambito, setAmbito] = useState<Ambito | "todos">("todos");
  const [tema, setTema] = useState<Tema | "todos">("todos");
  const [entidad, setEntidad] = useState<string>("todas");

  const entidades = useMemo(
    () => Array.from(new Set(normativas.map((n) => n.entidad))),
    [normativas],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return normativas.filter((n) => {
      if (ambito !== "todos" && n.ambito !== ambito) return false;
      if (tema !== "todos" && n.tema !== tema) return false;
      if (entidad !== "todas" && n.entidad !== entidad) return false;
      if (needle) {
        const hay =
          `${n.titulo} ${n.resumen} ${n.autoridad} ${n.documento}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [normativas, q, ambito, tema, entidad]);

  return (
    <div>
      {/* Buscador */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca por norma, autoridad o tema…"
          className="w-full rounded-lg border border-line bg-raised py-3 pl-10 pr-3 text-[14px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
        />
      </div>

      {/* Filtros */}
      <div className="mt-4 space-y-2.5">
        <FilterRow label="Ámbito">
          <Chip active={ambito === "todos"} onClick={() => setAmbito("todos")}>
            Todos
          </Chip>
          {(Object.keys(AMBITO_META) as Ambito[]).map((a) => (
            <Chip
              key={a}
              active={ambito === a}
              color={AMBITO_META[a].color}
              onClick={() => setAmbito(a)}
            >
              {AMBITO_META[a].label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Tema">
          <Chip active={tema === "todos"} onClick={() => setTema("todos")}>
            Todos
          </Chip>
          {(Object.keys(TEMA_META) as Tema[]).map((t) => (
            <Chip key={t} active={tema === t} onClick={() => setTema(t)}>
              {TEMA_META[t].label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Entidad">
          <Chip active={entidad === "todas"} onClick={() => setEntidad("todas")}>
            Todas
          </Chip>
          {entidades.map((e) => (
            <Chip key={e} active={entidad === e} onClick={() => setEntidad(e)}>
              {e}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {/* Resultados */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-[12px] text-faint">
          {results.length} {results.length === 1 ? "norma" : "normas"}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {results.map((n) => (
          <NormaRow key={n.id} n={n} />
        ))}
        {results.length === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-raised/40 px-5 py-10 text-center text-[13px] text-muted">
            No hay normas que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}

function NormaRow({ n }: { n: Normativa }) {
  const am = AMBITO_META[n.ambito];
  return (
    <Link
      href={`/legal/${n.id}`}
      className="group block rounded-xl border border-line bg-raised p-4 transition-colors hover:border-faint"
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: `${am.color}1f`, color: am.color }}
        >
          {am.label}
        </span>
        <span className="text-[11px] font-semibold text-muted">{n.entidad}</span>
        <span className="text-[11px] text-faint">· {n.autoridad}</span>
        {n.cambio && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Cambio reciente
          </span>
        )}
      </div>
      <h3 className="mt-2 text-[15px] font-bold leading-snug text-ink">
        {n.titulo}
      </h3>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
        {n.resumen}
      </p>
    </Link>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 w-14 shrink-0 text-[10px] font-bold uppercase tracking-wide text-faint">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors ${
        active
          ? "border-transparent bg-ink text-base"
          : "border-line text-muted hover:text-ink"
      }`}
      style={active && color ? { background: color, color: "#0A0A0A" } : undefined}
    >
      {children}
    </button>
  );
}
