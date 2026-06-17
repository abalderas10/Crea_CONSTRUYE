import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Configuración" };

export default async function ConfigPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const created = new Date(project.created_at).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">
        Configuración del proyecto
      </h1>
      <p className="mt-1 text-sm text-muted">
        Datos del proyecto y contexto que Claude usará en cada análisis.
      </p>

      <div className="mt-8 max-w-xl space-y-3">
        <Row label="Nombre" value={project.name} />
        <Row label="Municipio" value={project.municipio ?? "—"} />
        <Row label="Tipo" value={project.tipo ?? "—"} />
        <Row label="Creado" value={created} />
      </div>

      <div className="mt-8 max-w-xl rounded-xl border border-line bg-raised p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          Contexto para Claude
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          {project.context_summary ??
            "Aún no hay contexto. Se irá construyendo a medida que completes las herramientas; Claude lo usará para mantener coherencia entre análisis."}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-raised px-4 py-3">
      <span className="text-[11px] uppercase tracking-wide text-faint">{label}</span>
      <span className="text-[13px] font-medium text-ink">{value}</span>
    </div>
  );
}
