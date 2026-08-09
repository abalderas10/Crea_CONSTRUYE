"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  DOCUMENT_TYPE_LABELS,
  EXTRACTION_STATUS_LABELS,
  CATEGORY_BY_TYPE,
  type DocumentTool,
  type DocumentType,
  type ProjectDocument,
} from "@/lib/documentacion";
import { fieldsForToolByExtraction } from "@/lib/documentacion";
import { evaluateGate, type GateEvaluation } from "@/lib/documentacion/gates";
import { applyExtractionToToolAction } from "@/app/app/[projectId]/documentacion/actions";
import { DocumentUploader } from "./DocumentUploader";
import { CategoryChip } from "./CategoryChip";
import { createFieldOriginIndicator } from "./FieldOriginIndicator";
import { ExtractionPoller } from "./ExtractionPoller";
import type { ProjectToolStatus } from "@/lib/documentacion/gates";

interface DocumentosAdjuntosProps {
  projectId: string;
  tool: DocumentTool;
  defaultDocumentType?: DocumentType;
  documents: ProjectDocument[];
  /** ID del form al que se aplicarán los campos (búsqueda por `name`). */
  formId?: string;
  /** Status del tool (para evaluar el gate de combinación cuando aplica). */
  toolStatus?: ProjectToolStatus;
  /** Override del gate ya evaluado (opcional, para evitar re-evaluar). */
  gate?: GateEvaluation;
}

/**
 * Sección "Inputs · Documentos adjuntos" que se incrusta al inicio de
 * cada *Form.tsx. Muestra:
 *   - Banner contextual (Vista 2) según el estado del gate de la tool.
 *   - El uploader.
 *   - La lista de documentos del tool.
 *   - Por cada documento completado, un banner con los campos aplicables
 *     y un botón "Aplicar al formulario" que busca inputs por `name` y
 *     les asigna valor. Marca `data-origin-*` en cada input modificado.
 *   - Indicador flotante (FieldOriginIndicator) junto a cada input.
 *   - Polling automático cuando hay docs en proceso.
 */
export function DocumentosAdjuntos({
  projectId,
  tool,
  defaultDocumentType,
  documents,
  formId,
  toolStatus,
  gate,
}: DocumentosAdjuntosProps) {
  const [applied, setApplied] = useState<Record<string, string[]>>({});
  // applied: documentId → [nombres de campos aplicados]
  const containerRef = useRef<HTMLDivElement>(null);

  // gate: el que nos pasaron o uno evaluado con los docs de este tool.
  const evaluation: GateEvaluation =
    gate ??
    evaluateGate(
      tool,
      documents,
      { [tool]: toolStatus ?? "empty" } as Partial<
        Record<DocumentTool, ProjectToolStatus>
      >,
    );

  const toolDocs = documents.filter((d) => d.tool === tool);
  const completedDocs = toolDocs.filter(
    (d) => d.extraction_status === "completed",
  );

  // Refrescar `applied` cuando llegan documentos nuevos
  useEffect(() => {
    setApplied((prev) => {
      const next: Record<string, string[]> = {};
      for (const d of completedDocs) {
        next[d.id] = prev[d.id] ?? [];
      }
      return next;
    });
  }, [documents.length, completedDocs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // MutationObserver: detecta cuando el usuario edita un input manualmente
  // y limpia el FieldOriginIndicator asociado.
  useEffect(() => {
    const formEl = formId ? document.getElementById(formId) : null;
    const root = formEl ?? containerRef.current?.parentElement ?? null;
    if (!root) return;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type !== "attributes") continue;
        const target = m.target as HTMLElement;
        if (!(target instanceof HTMLInputElement) &&
            !(target instanceof HTMLTextAreaElement) &&
            !(target instanceof HTMLSelectElement)) {
          continue;
        }
        // Si el input perdió el data-origin-doc-id → su indicador ya no aplica.
        if (!target.dataset.originDocId) {
          // Buscar y eliminar indicador hermano
          const sib = target.parentElement?.querySelector(
            ".cc-field-origin-indicator",
          );
          if (sib) sib.remove();
        }
      }
    });

    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-origin-doc-id", "value"],
    });
    return () => observer.disconnect();
  }, [formId]);

  function injectOriginIndicators(
    doc: ProjectDocument,
    inputs: HTMLInputElement[],
  ) {
    const category = CATEGORY_BY_TYPE[doc.document_type as DocumentType];
    for (const input of inputs) {
      // Etiquetar el input
      input.dataset.originDocId = doc.id;
      input.dataset.originDocName = doc.file_name;
      input.dataset.originCategory = category;

      // Inyectar indicador (sibling) si no existe
      const parent = input.parentElement;
      if (!parent) continue;
      const existing = parent.querySelector(".cc-field-origin-indicator");
      existing?.remove();
      const indicator = createFieldOriginIndicator(
        doc.id,
        doc.file_name,
        category,
        doc.updated_at ?? doc.created_at,
      );
      // Insertar después del input
      input.insertAdjacentElement("afterend", indicator);
    }
  }

  function applyToForm(doc: ProjectDocument, overwrite = false): {
    written: string[];
    inputs: HTMLInputElement[];
  } {
    const data = doc.extracted_data;
    if (!data) return { written: [], inputs: [] };
    const fieldMap = fieldsForToolByExtraction(
      tool,
      doc.document_type as DocumentType,
      data,
    );
    if (Object.keys(fieldMap).length === 0) return { written: [], inputs: [] };

    // Buscar los inputs: primero dentro del form (formId), luego en el container,
    // luego en todo el document.
    const root = formId
      ? (document.getElementById(formId) ?? containerRef.current ?? document)
      : (containerRef.current ?? document);
    const written: string[] = [];
    const inputs: HTMLInputElement[] = [];
    for (const [name, value] of Object.entries(fieldMap)) {
      // input[name], select[name], textarea[name]
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        `[name="${CSS.escape(name)}"]`,
      );
      if (!input) continue;
      if (!overwrite && input.value.trim() !== "") continue;
      input.value = value;
      // Disparar evento change/input para que el form "se entere" si
      // estuviera controlado.
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      written.push(name);
      inputs.push(input as HTMLInputElement);
    }
    return { written, inputs };
  }

  function handleApply(doc: ProjectDocument, overwrite = false) {
    const { written, inputs } = applyToForm(doc, overwrite);
    if (written.length === 0) {
      alert(
        "No se pudo aplicar: los campos del formulario ya tienen valor. Marca 'Sobrescribir' para forzar.",
      );
      return;
    }
    // Marcar origen
    injectOriginIndicators(doc, inputs);
    setApplied((prev) => ({ ...prev, [doc.id]: written }));
  }

  // ── Render ───────────────────────────────────────────────────────

  const hasAnyDoc = toolDocs.length > 0;
  const hasCompleted = completedDocs.length > 0;

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Banner contextual Vista 2 */}
      <ContextBanner
        projectId={projectId}
        tool={tool}
        evaluation={evaluation}
      />

      {/* Sin documentos: mostrar el uploader plegable */}
      {!hasAnyDoc && (
        <div className="rounded-lg border border-line bg-base/30">
          <details className="rounded-lg">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[12px] font-semibold text-ink hover:bg-hover">
              <PaperclipIcon />
              <span>Documentos adjuntos</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-faint">
                Opcional · 0
              </span>
            </summary>
            <div className="border-t border-line p-4">
              <DocumentUploader
                projectId={projectId}
                tool={tool}
                defaultDocumentType={defaultDocumentType}
                showViewAll={false}
              />
            </div>
          </details>
        </div>
      )}

      {hasAnyDoc && (
        <>
          {/* Header con conteo */}
          <div className="flex items-center gap-2">
            <PaperclipIcon />
            <span className="text-[12px] font-semibold text-ink">
              Documentos adjuntos
            </span>
            <span className="rounded-sm bg-line/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-faint">
              {toolDocs.length}
            </span>
            {hasCompleted && (
              <span className="rounded-sm bg-success/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                {completedDocs.length} extraídos
              </span>
            )}
            <Link
              href={`/app/${projectId}/documentacion`}
              className="ml-auto text-[11px] text-volt hover:underline"
            >
              Ver todos
            </Link>
          </div>

          {/* Banners de documentos completados */}
          {completedDocs.map((doc) => {
            const fieldMap = fieldsForToolByExtraction(
              tool,
              doc.document_type as DocumentType,
              doc.extracted_data,
            );
            const writtenHere = applied[doc.id] ?? [];
            const category = CATEGORY_BY_TYPE[doc.document_type as DocumentType];
            return (
              <div
                key={doc.id}
                className="rounded-lg border border-success/30 bg-success/[0.05] p-3"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <CategoryChip category={category} />
                      <p className="text-[12.5px] font-semibold text-ink">
                        {doc.file_name}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-faint">
                      {DOCUMENT_TYPE_LABELS[doc.document_type as DocumentType]} ·{" "}
                      {EXTRACTION_STATUS_LABELS.completed}
                    </p>
                  </div>
                  <BannerActions
                    doc={doc}
                    projectId={projectId}
                    tool={tool}
                    hasFields={Object.keys(fieldMap).length > 0}
                    writtenFields={writtenHere}
                    onApplyLocal={handleApply}
                  />
                </div>
                {Object.keys(fieldMap).length > 0 && (
                  <p className="mt-2 text-[11px] text-muted">
                    Campos aplicables:{" "}
                    <span className="font-semibold text-ink">
                      {Object.keys(fieldMap).join(", ")}
                    </span>
                  </p>
                )}
                {writtenHere.length > 0 && (
                  <p className="mt-1 text-[11px] text-success">
                    Aplicado: {writtenHere.join(", ")}. Recuerda guardar el
                    formulario.
                  </p>
                )}
              </div>
            );
          })}

          {/* Documentos en proceso o fallidos */}
          {toolDocs.filter(
            (d) =>
              d.extraction_status !== "completed" &&
              d.extraction_status !== "failed",
          ).length > 0 && (
            <p className="rounded-md border border-violet/30 bg-violet/[0.06] px-3 py-2 text-[11.5px] text-muted">
              Hay documentos en análisis. Aparecerán aquí cuando Claude termine
              de extraer los datos.
            </p>
          )}

          {/* Uploader al final */}
          <details className="rounded-lg border border-line bg-base/30">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[12px] font-semibold text-ink hover:bg-hover">
              <PlusIcon />
              <span>Subir otro documento</span>
            </summary>
            <div className="border-t border-line p-4">
              <DocumentUploader
                projectId={projectId}
                tool={tool}
                defaultDocumentType={defaultDocumentType}
                showViewAll={false}
              />
            </div>
          </details>
        </>
      )}

      {/* Polling de extracciones (solo si hay docs del proyecto) */}
      {documents.length > 0 && <ExtractionPoller documents={documents} />}
    </div>
  );
}

// ── Banner contextual (Vista 2) ──────────────────────────────────

function ContextBanner({
  projectId,
  tool,
  evaluation,
}: {
  projectId: string;
  tool: DocumentTool;
  evaluation: GateEvaluation;
}) {
  if (evaluation.status === "ready") return null;

  if (evaluation.status === "locked") {
    return (
      <div
        className="rounded-lg border p-3"
        style={{
          background: "#A8575110",
          borderColor: "#A8575140",
        }}
      >
        <p className="text-[12.5px] font-semibold text-ink">
          🔒 {evaluation.reason}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Link
            href={`/app/${projectId}/documentacion?tool=${tool}`}
            className="rounded-md border border-line bg-base/40 px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-faint"
          >
            Ir a Documentación
          </Link>
        </div>
      </div>
    );
  }

  // partial
  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: "#B8943A10",
        borderColor: "#B8943A40",
      }}
    >
      <p className="text-[12.5px] font-semibold text-ink">
        ⏳ {evaluation.reason}
      </p>
      <p className="mt-1 text-[11px] text-faint">
        Progreso: {evaluation.progress}%. Falta extraer al menos 1 documento.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Link
          href={`/app/${projectId}/documentacion?tool=${tool}`}
          className="rounded-md bg-volt px-3 py-1.5 text-[12px] font-extrabold text-on-volt transition-all hover:bg-volt-sub"
        >
          Subir ahora
        </Link>
        <Link
          href={`/app/${projectId}/documentacion?tool=${tool}`}
          className="rounded-md border border-line bg-base/40 px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-faint"
        >
          Ver estado del gate
        </Link>
      </div>
    </div>
  );
}

function BannerActions({
  doc,
  projectId,
  tool,
  hasFields,
  writtenFields,
  onApplyLocal,
}: {
  doc: ProjectDocument;
  projectId: string;
  tool: DocumentTool;
  hasFields: boolean;
  writtenFields: string[];
  onApplyLocal: (doc: ProjectDocument, overwrite?: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const alreadyWritten = writtenFields.length > 0;

  function applyDirect(overwrite: boolean) {
    setError(null);
    startTransition(async () => {
      // 1) Aplicar localmente (al DOM del form).
      onApplyLocal(doc, overwrite);
      // 2) Guardar en project_tool_data (persiste aunque el usuario
      // no vuelva a abrir el form).
      const r = await applyExtractionToToolAction(doc.id, tool, projectId, overwrite);
      if (!r.ok) {
        // Si fue fallo por campos ya con valor, lo decimos claramente.
        if (r.error.includes("ya tienen valor")) {
          setError("Los campos ya tienen valor. Usa 'Sobrescribir' para forzar.");
        } else {
          setError(r.error);
        }
      }
    });
  }

  if (!hasFields) {
    return (
      <span className="text-[11px] text-faint">
        (sin campos aplicables a esta herramienta)
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {alreadyWritten ? (
        <span className="rounded-sm bg-success/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
          Aplicado
        </span>
      ) : (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={() => applyDirect(false)}
            className="rounded-md bg-volt px-3 py-1.5 text-[12px] font-extrabold text-on-volt transition-all hover:bg-volt-sub disabled:opacity-60"
          >
            {pending ? "…" : "Aplicar al formulario"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm("¿Sobrescribir los valores actuales del formulario con los extraídos?")) {
                applyDirect(true);
              }
            }}
            className="rounded-md border border-line bg-base/40 px-3 py-1.5 text-[11px] font-semibold text-ink transition-colors hover:border-faint disabled:opacity-60"
            title="Sobrescribe los valores actuales"
          >
            Sobrescribir
          </button>
        </>
      )}
      {error && <span className="text-[10.5px] text-danger">{error}</span>}
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-faint"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-faint"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
