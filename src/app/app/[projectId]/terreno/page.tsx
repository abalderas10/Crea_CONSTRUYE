import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { TerrenoIcon } from "@/components/icons/ToolIcons";
import { TerrenoForm } from "@/components/app/TerrenoForm";
import { TerrenoAnalysis, type Analysis } from "@/components/app/TerrenoAnalysis";
import { getProject, getToolData } from "@/lib/data/projects";

export const metadata: Metadata = { title: "1. Terreno" };

const TOOL = TOOLS[0]; // Terreno

const REMAINING = [
  "Scoring de Ubicación",
  "Servicios y Equipamiento",
  "Valoración Comparativa",
  "Alertas y Restricciones",
  "Due Diligence Checklist",
];

export default async function TerrenoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, toolData] = await Promise.all([
    getProject(projectId),
    getToolData(projectId, "terreno"),
  ]);
  if (!project) notFound();

  const data = (toolData?.data ?? {}) as {
    localizacion?: Record<string, string>;
  };
  const loc = data.localizacion;
  const analysis = (toolData?.ai_analysis as Analysis | null) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${TOOL.color}15`, color: TOOL.color }}
        >
          <TerrenoIcon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">1. Terreno</h1>
          <p className="text-sm text-muted">{TOOL.tagline}</p>
        </div>
      </div>

      {/* Sección 1: Localización */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          1 · Localización
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <TerrenoForm projectId={project.id} initial={loc} />
        </div>
      </section>

      {/* Análisis AI */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Análisis AI + Decisión
        </h2>
        <div className="mt-3">
          <TerrenoAnalysis
            projectId={project.id}
            analysis={analysis}
            hasInputs={!!loc?.direccion}
          />
        </div>
      </section>

      {/* Secciones restantes */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Próximas secciones
        </h2>
        <div className="mt-3 grid gap-2">
          {REMAINING.map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg border border-dashed border-line bg-raised/40 px-4 py-3.5"
            >
              <span className="tabular grid h-7 w-7 place-items-center rounded-md bg-base text-[11px] font-bold text-faint">
                {i + 2}
              </span>
              <span className="flex-1 text-[13px] text-muted">{name}</span>
              <span className="text-[10px] uppercase tracking-wide text-faint">
                Próximamente
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
