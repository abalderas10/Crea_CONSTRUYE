import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { MercadoIcon } from "@/components/icons/ToolIcons";
import { MercadoForm } from "@/components/app/MercadoForm";
import { MercadoValoracion } from "@/components/app/MercadoValoracion";
import { MercadoAnalysisPanel, type MercadoAnalysis as Analysis } from "@/components/app/MercadoAnalysis";
import { getProject, getToolData } from "@/lib/data/projects";
import type { MercadoData } from "@/lib/proforma/mercado";

export const metadata: Metadata = { title: "3. Mercado" };

const TOOL = TOOLS[2]; // Mercado
const REMAINING = [
  "Análisis de oferta comparable por radio específico",
  "Estudio de preventa y velocidad de venta histórica",
  "Análisis de sensibilidad de precio",
  "Comparación contra competencia directa",
  "Backlog de demanda calificada",
];

export default async function MercadoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, mercadoData, terrenoData] = await Promise.all([
    getProject(projectId),
    getToolData(projectId, "mercado"),
    getToolData(projectId, "terreno"),
  ]);
  if (!project) notFound();

  const data = (mercadoData?.data ?? {}) as MercadoData;

  // Heredar municipio del Terreno si no se ha capturado en Mercado
  if (!data.municipio) {
    const terrenoObj = terrenoData?.data as
      | { predio?: { territorio?: string } }
      | undefined;
    if (terrenoObj?.predio?.territorio) {
      data.municipio = terrenoObj.predio.territorio;
    }
  }

  const analysis = (mercadoData?.ai_analysis as Analysis | null) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${TOOL.color}15`, color: TOOL.color }}
        >
          <MercadoIcon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">3. Mercado</h1>
          <p className="text-sm text-muted">{TOOL.tagline}</p>
        </div>
      </div>

      {/* Sección 1: Captura */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          1 · Producto y zona
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <MercadoForm projectId={project.id} initial={data} />
        </div>
      </section>

      {/* Valoración */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Indicadores de mercado
        </h2>
        <div className="mt-3">
          <MercadoValoracion data={data} />
        </div>
      </section>

      {/* Análisis AI */}
      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Análisis AI + Recomendaciones
        </h2>
        <div className="mt-3">
          <MercadoAnalysisPanel
            projectId={project.id}
            analysis={analysis}
            hasInputs={!!(data.tipo_proyecto && data.unidades_totales && data.precio_m2_esperado)}
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