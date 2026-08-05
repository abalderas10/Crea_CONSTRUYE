import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Reportes" };

interface ReportMeta {
  id: string;
  name: string;
  desc: string;
  fmt: string;
  available: boolean;
  badge?: string;
  pages?: string;
}

const REPORTS: ReportMeta[] = [
  {
    id: "proforma",
    name: "Proforma completa",
    desc: "Documento ensamblado con los outputs de las 8 herramientas, análisis de IA y métricas clave.",
    fmt: "PDF",
    available: true,
    badge: "Recomendado",
    pages: "~10-15 págs",
  },
  {
    id: "ejecutivo",
    name: "Reporte ejecutivo",
    desc: "1-pager con veredicto GO/NO-GO y métricas clave. Para socios y comité de inversión.",
    fmt: "PDF",
    available: true,
    badge: "Nuevo",
    pages: "~2-3 págs",
  },
  {
    id: "memorandum",
    name: "Memorándum de inversión",
    desc: "Template formal estilo bancario para levantar capital. Incluye análisis de riesgos y próximos pasos.",
    fmt: "PDF",
    available: true,
    badge: "Nuevo",
    pages: "~7-9 págs",
  },
  {
    id: "mercado",
    name: "Estudio de mercado",
    desc: "Reporte standalone de la herramienta 3. Demanda, absorción, comparables y producto óptimo.",
    fmt: "PDF",
    available: true,
    badge: "Nuevo",
    pages: "~6-8 págs",
  },
];

export default async function ReportesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const canDownload = isSupabaseConfigured;

  return (
    <div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
          Documentos profesionales
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Reportes</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Exporta tu proforma en formato profesional. Los reportes se generan
          con los datos capturados hasta el momento. Conforme completes las
          herramientas, los reportes se enriquecen automáticamente.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {REPORTS.map((r) => {
          const href = r.available
            ? `/app/${projectId}/reportes/${r.id}`
            : undefined;
          return (
            <div
              key={r.id}
              className="group relative rounded-xl border border-line bg-raised p-5 transition-colors hover:border-faint"
            >
              {r.badge && (
                <span className="absolute right-4 top-4 rounded-sm bg-volt/15 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-volt">
                  {r.badge}
                </span>
              )}
              <h3 className="font-bold text-ink">{r.name}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {r.desc}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-faint">
                  <span>{r.fmt}</span>
                  {r.pages && (
                    <>
                      <span>·</span>
                      <span>{r.pages}</span>
                    </>
                  )}
                </div>
                {r.available && canDownload ? (
                  <Link
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-volt px-3.5 py-1.5 text-[12px] font-extrabold text-on-volt transition-colors hover:bg-volt-sub"
                  >
                    Descargar ↓
                  </Link>
                ) : r.available && !canDownload ? (
                  <span className="rounded-sm bg-base px-2 py-1 text-[10px] font-bold text-faint">
                    Sin Supabase
                  </span>
                ) : (
                  <span className="rounded-sm bg-base px-2 py-1 text-[10px] font-bold text-faint">
                    Próximamente
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-raised/40 p-5 text-[12.5px] leading-relaxed text-muted">
        <p>
          <span className="font-bold text-ink">Tip:</span>{" "}
          los reportes se generan server-side con{" "}
          <span className="font-mono text-[12px]">@react-pdf/renderer</span>.
          No se envía ningún dato a servicios externos. El PDF incluye
          watermarks sutiles de creaConstruye y un footer con paginación.
        </p>
      </div>
    </div>
  );
}
