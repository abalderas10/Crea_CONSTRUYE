import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getToolStatuses } from "@/lib/data/projects";
import {
  listProjectDocuments,
  getDocumentDownloadUrl,
} from "@/lib/data/documents";
import { TOOLS } from "@/lib/tools";
import { DocumentUploader } from "@/components/app/DocumentUploader";
import { DocumentList } from "@/components/app/DocumentList";
import { FaseZero } from "@/components/app/FaseZero";
import { ExtractionPoller } from "@/components/app/ExtractionPoller";
import { DOCUMENT_TYPE_LABELS } from "@/lib/documentacion";

export const metadata: Metadata = { title: "Documentación" };

export default async function DocumentacionPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, documents, statuses] = await Promise.all([
    getProject(projectId),
    listProjectDocuments(projectId),
    getToolStatuses(projectId),
  ]);
  if (!project) notFound();

  // URLs de descarga (firmadas, 60s) para que la lista tenga link directo.
  const downloadUrls: Record<string, string> = {};
  await Promise.all(
    documents.map(async (d) => {
      const url = await getDocumentDownloadUrl(d.file_path, 60);
      if (url) downloadUrls[d.id] = url;
    }),
  );

  // Conteos por tool
  const byTool: Record<string, number> = {};
  for (const d of documents) {
    byTool[d.tool] = (byTool[d.tool] ?? 0) + 1;
  }

  // toolStatus del proyecto (de `project_tool_data.status`).
  const toolStatusByTool = statuses as Record<
    string,
    "empty" | "in_progress" | "done"
  >;

  return (
    <div className="space-y-10">
      {/* Fase 0 · Hub post-crear */}
      <FaseZero
        projectId={projectId}
        projectName={project.name}
        municipio={project.municipio}
        tipo={project.tipo}
        documents={documents}
        toolStatusByTool={toolStatusByTool}
      />

      {/* Resumen por herramienta */}
      {documents.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
            Distribución
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(byTool).map(([tool, count]) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-raised px-2.5 py-1 text-[11.5px] text-ink"
              >
                <span className="font-semibold">{humanizeTool(tool)}</span>
                <span className="text-faint">· {count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Uploader global */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Subir documento
        </h2>
        <div className="mt-3 rounded-xl border border-line bg-raised p-5">
          <p className="mb-3 text-[12.5px] text-muted">
            Sube planos topográficos, certificados, boletas prediales,
            contratos, fotos del predio o cualquier documento relevante. Claude
            lo analiza en cuanto termina la subida.
          </p>
          <DocumentUploader
            projectId={projectId}
            tool="general"
            defaultDocumentType="otro"
            showViewAll={false}
          />
        </div>
      </section>

      {/* Lista completa */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Documentos del proyecto · {documents.length}
        </h2>
        <div className="mt-3">
          <DocumentList
            projectId={projectId}
            documents={documents}
            downloadUrls={downloadUrls}
          />
        </div>
      </section>

      {/* Tipos de documento soportados (referencia) */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
          Tipos soportados
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(
            Object.entries(DOCUMENT_TYPE_LABELS) as [keyof typeof DOCUMENT_TYPE_LABELS, string][]
          ).map(([key, label]) => (
            <div
              key={key}
              className="rounded-lg border border-line bg-raised/40 px-3 py-2.5 text-[12.5px]"
            >
              <p className="font-semibold text-ink">{label}</p>
              <p className="mt-0.5 text-[10.5px] text-faint">{key}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Polling global */}
      <ExtractionPoller documents={documents} />
    </div>
  );
}

function humanizeTool(t: string): string {
  const found = TOOLS.find((x) => x.id === t);
  if (found) return found.name;
  if (t === "general") return "Generales";
  return t;
}
