import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { ZonificacionIcon } from "@/components/icons/ToolIcons";
import { ZonificacionForm } from "@/components/app/ZonificacionForm";
import { ZonificacionValoracion } from "@/components/app/ZonificacionValoracion";
import { ZonificacionAnalysis, type ZonificacionAnalysis as Analysis } from "@/components/app/ZonificacionAnalysis";
import { getProject, getToolData } from "@/lib/data/projects";
import { num } from "@/lib/proforma/terreno";
import type { ZonificacionData } from "@/lib/proforma/zonificacion";

export const metadata: Metadata = { title: "2. Zonificación" };

const TOOL = TOOLS[1]; // Zonificación

const REMAINING = [
  "Capacidad de servicios (CFE/SACMEX/CAEM)",
  "Análisis de densidad vecinal",
  "Histórico de uso de suelo",
  "Restricciones por monumento o vialidad primaria",
  "Afectaciones municipales vigentes",
];

export default async function ZonificacionPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, zonifData, terrenoData] = await Promise.all([
    getProject(projectId),
    getToolData(projectId, "zonificacion"),
    getToolData(projectId, "terreno"),
  ]);
  if (!project) notFound();

  const data = (zonifData?.data ?? {}) as ZonificacionData;
  const analysis = (zonifData?.ai_analysis as Analysis | null) ?? null;
  // Heredamos superficie del terreno si existe.
  const superficieTerreno = num(
    (terrenoData?.data as { predio?: { superficie_terreno?: string } } | null)
      ?.predio?.superficie_terreno,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${TOOL.color}15`, color: TOOL.color }}
        >
          <ZonificacionIcon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">2. Zonificación</h1>
          <p className="text-sm text-muted">{TOOL.tagline}</p>
        </div>
      </div>

      {/* Sección 1: Captura */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          1 · Normativa aplicable
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <ZonificacionForm projectId={project.id} initial={data} />
        </div>
      </section>

      {/* Valoración */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Verificación y capacidad
        </h2>
        <div className="mt-3">
          <ZonificacionValoracion
            data={data}
            superficieTerreno={isFinite(superficieTerreno) ? superficieTerreno : undefined}
          />
        </div>
      </section>

      {/* Análisis AI */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Análisis AI + Veredicto
        </h2>
        <div className="mt-3">
          <ZonificacionAnalysis
            projectId={project.id}
            analysis={analysis}
            hasInputs={!!data.norma?.zona_codigo}
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
