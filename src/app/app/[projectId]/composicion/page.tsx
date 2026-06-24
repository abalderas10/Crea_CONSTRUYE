import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject } from "@/lib/data/projects";
import { getProjectModules } from "@/lib/data/modules";
import { TOOLS, TOOL_GRAPH, getTool, type ToolId } from "@/lib/tools";
import { OptionalModules } from "@/components/app/OptionalModules";

export const metadata: Metadata = { title: "Composición" };

export default async function ComposicionPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, modules] = await Promise.all([
    getProject(projectId),
    getProjectModules(projectId),
  ]);
  if (!project) notFound();

  return (
    <div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
          Modularidad
        </p>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight">
          Composición de la proforma
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Una proforma es modular: 8 herramientas fijas como columna vertebral
          y las de comunidad que enchufes según el proyecto. Cada una consume y
          alimenta a otras.
        </p>
      </div>

      {/* Columna vertebral (fijas) */}
      <section className="mt-8">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-bold uppercase tracking-wide text-muted">
            Columna vertebral
          </h2>
          <span className="inline-flex items-center gap-1 rounded-sm bg-line/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-faint">
            <LockIcon /> Fijas
          </span>
        </div>
        <p className="mt-1 text-[12px] text-faint">
          Fijas por la naturaleza de los datos que capturan y su relevancia en
          el estudio. No se quitan.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t) => {
            const g = TOOL_GRAPH[t.id];
            return (
              <div
                key={t.id}
                className="rounded-xl border border-line bg-raised p-4"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold"
                    style={{ background: `${t.color}18`, color: t.color }}
                  >
                    {t.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[13.5px] font-bold leading-tight text-ink">
                      {t.name}
                    </h3>
                  </div>
                  <span className="text-faint" title="Fija">
                    <LockIcon />
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <DepRow label="Consume" ids={g.consumes} empty="datos iniciales" />
                  <DepRow label="Alimenta" ids={g.feeds} empty="decisión final" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Herramientas de comunidad */}
      <section className="mt-10">
        <OptionalModules
          projectId={project.id}
          enabled={modules.enabled}
          available={modules.available}
        />
      </section>
    </div>
  );
}

function DepRow({
  label,
  ids,
  empty,
}: {
  label: string;
  ids: ToolId[];
  empty: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-faint">
        {label}
      </span>
      {ids.length === 0 ? (
        <span className="text-[11px] italic text-faint">{empty}</span>
      ) : (
        ids.map((id) => {
          const tool = getTool(id);
          return (
            <span
              key={id}
              className="rounded-sm border border-line bg-base px-1.5 py-0.5 text-[10px] font-semibold text-muted"
              style={{ color: tool?.color }}
            >
              {tool?.name ?? id}
            </span>
          );
        })
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}
