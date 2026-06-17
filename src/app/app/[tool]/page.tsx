import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, type ToolId } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const t = TOOLS.find((x) => x.id === tool);
  return { title: t ? `${t.num}. ${t.name}` : "Herramienta" };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const t = TOOLS.find((x) => x.id === tool);
  if (!t) notFound();

  const Icon = TOOL_ICONS[t.id as ToolId];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${t.color}15`, color: t.color }}
        >
          <Icon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {t.num}. {t.name}
          </h1>
          <p className="text-sm text-muted">{t.tagline}</p>
        </div>
        <span
          className="ml-auto rounded-pill px-3 py-1 text-[11px] font-bold"
          style={{ background: `${t.color}15`, color: t.color }}
        >
          {t.sections} secciones
        </span>
      </div>

      {/* I/O */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-raised p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            Datos de entrada
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            {t.inputs}
          </p>
        </div>
        <div className="rounded-lg border border-success/25 bg-raised p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-success">
            Produce
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            {t.produces}
          </p>
        </div>
      </div>

      {/* Secciones (placeholder) */}
      <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
        Secciones
      </h2>
      <div className="mt-3 grid gap-2">
        {Array.from({ length: t.sections }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-dashed border-line bg-raised/40 px-4 py-4"
          >
            <span className="tabular grid h-7 w-7 place-items-center rounded-md bg-base text-[11px] font-bold text-faint">
              {i + 1}
            </span>
            <div className="h-2 flex-1 rounded-full bg-line/60" />
            <span className="text-[10px] uppercase tracking-wide text-faint">
              Próximamente
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-xl border p-5"
        style={{ borderColor: "rgba(139,92,246,0.28)", background: "rgba(139,92,246,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-[4px] bg-violet text-[8px] font-black text-white">
            AI
          </span>
          <span className="text-[12px] font-bold text-violet-sub">
            Análisis de Claude
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Aquí Claude generará el análisis narrativo de esta herramienta con los
          datos del proyecto. Lo conectamos en la siguiente fase, una vez que el
          backend de Supabase y la API de Anthropic estén enlazados.
        </p>
      </div>
    </div>
  );
}
