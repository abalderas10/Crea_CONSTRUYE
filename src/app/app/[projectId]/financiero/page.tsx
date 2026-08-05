import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { FinancieroIcon } from "@/components/icons/ToolIcons";
import { FinancieroForm } from "@/components/app/FinancieroForm";
import { FinancieroValoracion } from "@/components/app/FinancieroValoracion";
import { FinancieroAnalysisPanel, type FinancieroAnalysis as Analysis } from "@/components/app/FinancieroAnalysis";
import { getProject, getToolData } from "@/lib/data/projects";
import type { FinancieroData } from "@/lib/proforma/financiero";
import { num } from "@/lib/proforma/terreno";

export const metadata: Metadata = { title: "5. Financiero" };

const TOOL = TOOLS[4]; // Financiero

const REMAINING = [
  "Simulación Monte Carlo de 5,000 corridas",
  "Flujo de caja mensual detallado con devengo",
  "Análisis de sensibilidad (precio ±15%, costo ±10%)",
  "Escenario de stress: caída de absorción 50%",
  "Punto de equilibrio financiero mes a mes",
];

export default async function FinancieroPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, financieroData, mercadoData] = await Promise.all([
    getProject(projectId),
    getToolData(projectId, "financiero"),
    getToolData(projectId, "mercado"),
  ]);
  if (!project) notFound();

  const data = (financieroData?.data ?? {}) as FinancieroData;

  // Heredar de mercado (ingreso, unidades, m², precio/m²)
  if (mercadoData?.data) {
    const m = mercadoData.data as {
      unidades_totales?: string;
      m2_construir_total?: string;
      precio_m2_esperado?: string;
      precio_m2_esperado_alto?: string;
    };
    if (!data.unidades_totales && m.unidades_totales) data.unidades_totales = m.unidades_totales;
    if (!data.m2_construir_total && m.m2_construir_total) data.m2_construir_total = m.m2_construir_total;
    if (!data.precio_m2_promedio) {
      const bajo = num(m.precio_m2_esperado);
      const alto = num(m.precio_m2_esperado_alto);
      if (isFinite(bajo) && isFinite(alto)) {
        data.precio_m2_promedio = ((bajo + alto) / 2).toFixed(0);
      } else if (isFinite(bajo)) {
        data.precio_m2_promedio = bajo.toFixed(0);
      }
    }
    if (!data.ingreso_bruto_total) {
      const m2 = num(data.m2_construir_total);
      const pm2 = num(data.precio_m2_promedio);
      if (isFinite(m2) && isFinite(pm2)) {
        data.ingreso_bruto_total = (m2 * pm2).toFixed(0);
      }
    }
  }

  const analysis = (financieroData?.ai_analysis as Analysis | null) ?? null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-lg"
          style={{ background: `${TOOL.color}15`, color: TOOL.color }}
        >
          <FinancieroIcon size={22} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">5. Financiero</h1>
          <p className="text-sm text-muted">{TOOL.tagline}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          1 · Estructura de capital
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <FinancieroForm projectId={project.id} initial={data} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          3 Escenarios financieros
        </h2>
        <div className="mt-3">
          <FinancieroValoracion data={data} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Análisis AI + Veredicto
        </h2>
        <div className="mt-3">
          <FinancieroAnalysisPanel
            projectId={project.id}
            analysis={analysis}
            hasInputs={!!(data.inversion_total && data.capital_propio)}
          />
        </div>
      </section>

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