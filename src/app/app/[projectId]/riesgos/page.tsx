import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { RiesgosIcon } from "@/components/icons/ToolIcons";
import { RiesgosForm } from "@/components/app/RiesgosForm";
import { RiesgosAnalysisPanel, type RiesgosAnalysis as Analysis } from "@/components/app/RiesgosAnalysis";
import { getProject, getToolData } from "@/lib/data/projects";

export const metadata: Metadata = { title: "8. Riesgos + GO/NO-GO" };

const TOOL = TOOLS[7]; // Riesgos

const REMAINING = [
  "Monte Carlo con 5,000 simulaciones (probabilístico)",
  "Análisis de estrés (caída de absorción 50%)",
  "Plan de contingencia detallado por riesgo",
  "Matriz RACI del equipo de mitigación",
  "Trigger events para re-evaluación del proyecto",
];

export default async function RiesgosPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, riesgosData] = await Promise.all([
    getProject(projectId),
    getToolData(projectId, "riesgos"),
  ]);
  if (!project) notFound();

  const data = (riesgosData?.data ?? {}) as {
    notas_adicionales?: string;
    experiencia_previa?: "nula" | "1_proyecto" | "2-5_proyectos" | "5+_proyectos";
    tiene_socio_inversionista?: boolean;
  };

  const analysis = (riesgosData?.ai_analysis as Analysis | null) ?? null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${TOOL.color}15`, color: TOOL.color }}
        >
          <RiesgosIcon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">8. Riesgos + GO/NO-GO</h1>
          <p className="text-sm text-muted">{TOOL.tagline}</p>
        </div>
      </div>

      {/* Context inputs */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Contexto del equipo y del proyecto
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <RiesgosForm projectId={project.id} initial={data} />
        </div>
      </section>

      {/* AI Veredicto */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Veredicto final
        </h2>
        <div className="mt-3">
          <RiesgosAnalysisPanel
            projectId={project.id}
            analysis={analysis}
            hasInputs={true}
          />
        </div>
      </section>

      {/* Próximas secciones */}
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