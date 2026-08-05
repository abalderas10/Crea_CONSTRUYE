import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { CostosIcon } from "@/components/icons/ToolIcons";
import { CostosForm } from "@/components/app/CostosForm";
import { CostosValoracion } from "@/components/app/CostosValoracion";
import { CostosAnalysisPanel, type CostosAnalysis as Analysis } from "@/components/app/CostosAnalysis";
import { getProject, getToolData } from "@/lib/data/projects";
import type { CostosData } from "@/lib/proforma/costes";

export const metadata: Metadata = { title: "4. Costos" };

const TOOL = TOOLS[3]; // Costos
const REMAINING = [
  "Costo de impacto ambiental y permisos especiales",
  "Costo de equipamiento especial (gimnasio, alberca, Roof Garden)",
  "Costo de marketing y preventa",
  "Costo de financiamiento durante construcción (intereses)",
  "Reserva para vicios ocultos (post-entrega)",
];

export default async function CostosPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, costosData, terrenoData] = await Promise.all([
    getProject(projectId),
    getToolData(projectId, "costos"),
    getToolData(projectId, "terreno"),
  ]);
  if (!project) notFound();

  const data = (costosData?.data ?? {}) as CostosData;
  const analysis = (costosData?.ai_analysis as Analysis | null) ?? null;

  // Heredar costo_terreno de Terreno si no se ha capturado en Costos
  const terrenoDataObj = terrenoData?.data as
    | { predio?: { precio_solicitado?: string } }
    | undefined;
  if (!data.costo_terreno && terrenoDataObj?.predio?.precio_solicitado) {
    data.costo_terreno = terrenoDataObj.predio.precio_solicitado;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${TOOL.color}15`, color: TOOL.color }}
        >
          <CostosIcon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">4. Costos</h1>
          <p className="text-sm text-muted">{TOOL.tagline}</p>
        </div>
      </div>

      {/* Sección 1: Captura */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          1 · Sistema constructivo y dimensiones
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <CostosForm projectId={project.id} initial={data} />
        </div>
      </section>

      {/* Valoración */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Presupuesto paramétrico
        </h2>
        <div className="mt-3">
          <CostosValoracion data={data} />
        </div>
      </section>

      {/* Análisis AI */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Análisis AI + Optimización
        </h2>
        <div className="mt-3">
          <CostosAnalysisPanel
            projectId={project.id}
            analysis={analysis}
            hasInputs={!!(data.m2_construir && data.tipo_estructura)}
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