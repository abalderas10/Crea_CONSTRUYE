"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DOCUMENT_TYPE_LABELS,
  EXTRACTION_STATUS_LABELS,
  CATEGORY_BY_TYPE,
  type DocumentTool,
  type DocumentType,
  type ExtractionStatus,
  type ProjectDocument,
} from "@/lib/documentacion";
import { CategoryChip } from "./CategoryChip";
import {
  deleteProjectDocument,
  retryDocumentExtraction,
} from "@/app/app/[projectId]/documentacion/actions";

interface DocumentListProps {
  projectId: string;
  documents: ProjectDocument[];
  /** Si se pasa, filtra la lista a este tool (read-only, no se muestra filtro). */
  pinnedTool?: DocumentTool;
  /** URL de descarga pre-firmada por documento (mapa por documentId). */
  downloadUrls?: Record<string, string>;
}

const ALL_TYPES: DocumentType[] = [
  "plano_topografico",
  "certificado_uso_suelo",
  "boleta_predial",
  "contrato",
  "avaluo",
  "licencia_obra",
  "fotos",
  "otro",
];

const ALL_STATUS: ExtractionStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
];

export function DocumentList({
  projectId,
  documents,
  pinnedTool,
  downloadUrls = {},
}: DocumentListProps) {
  const [filterType, setFilterType] = useState<DocumentType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ExtractionStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = documents.filter((d) => {
    if (pinnedTool && d.tool !== pinnedTool) return false;
    if (filterType !== "all" && d.document_type !== filterType) return false;
    if (filterStatus !== "all" && d.extraction_status !== filterStatus) return false;
    return true;
  });

  if (documents.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-base/30 px-4 py-6 text-center text-[12.5px] text-faint">
        Aún no hay documentos subidos a este proyecto.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filtros inline (solo si no está pinned) */}
      {!pinnedTool && (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as DocumentType | "all")}
            className="rounded-md border border-line bg-input px-2 py-1.5 text-[12px] text-ink outline-none focus:border-volt"
          >
            <option value="all">Todos los tipos</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>
                {DOCUMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ExtractionStatus | "all")}
            className="rounded-md border border-line bg-input px-2 py-1.5 text-[12px] text-ink outline-none focus:border-volt"
          >
            <option value="all">Cualquier estado</option>
            {ALL_STATUS.map((s) => (
              <option key={s} value={s}>
                {EXTRACTION_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <span className="ml-auto text-[11px] text-faint">
            {filtered.length} de {documents.length}
          </span>
        </div>
      )}

      {/* Lista */}
      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-base/30 px-4 py-6 text-center text-[12.5px] text-faint">
          Ningún documento coincide con los filtros.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              projectId={projectId}
              isExpanded={expandedId === doc.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === doc.id ? null : doc.id))
              }
              downloadUrl={downloadUrls[doc.id]}
              onMutated={() => router.refresh()}
            />
          ))}
        </ul>
      )}

      {pinnedTool && (
        <p className="text-[11px] text-faint">
          <Link
            href={`/app/${projectId}/documentacion`}
            className="text-volt hover:underline"
          >
            Ver todos los documentos del proyecto →
          </Link>
        </p>
      )}
    </div>
  );
}

// ── Card individual ──────────────────────────────────────────────

function DocumentCard({
  doc,
  projectId,
  isExpanded,
  onToggle,
  downloadUrl,
  onMutated,
}: {
  doc: ProjectDocument;
  projectId: string;
  isExpanded: boolean;
  onToggle: () => void;
  downloadUrl?: string;
  onMutated: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  function onDelete() {
    if (!confirm(`¿Eliminar "${doc.file_name}"? Esta acción no se puede deshacer.`)) return;
    setActionError(null);
    startTransition(async () => {
      const r = await deleteProjectDocument(doc.id, projectId);
      if (!r.ok) {
        setActionError(r.error);
        return;
      }
      onMutated();
    });
  }

  function onRetry() {
    setActionError(null);
    startTransition(async () => {
      const r = await retryDocumentExtraction(doc.id, projectId);
      if (!r.ok) {
        setActionError(r.error);
        return;
      }
      onMutated();
    });
  }

  return (
    <li className="rounded-lg border border-line bg-raised">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-hover"
      >
        <FileIcon />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <CategoryChip category={CATEGORY_BY_TYPE[doc.document_type as DocumentType]} />
            <p className="truncate text-[13px] font-semibold text-ink">
              {doc.file_name}
            </p>
          </div>
          <p className="mt-0.5 text-[11px] text-faint">
            {DOCUMENT_TYPE_LABELS[doc.document_type]} · {formatBytes(doc.file_size)} ·{" "}
            {new Date(doc.created_at).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusPill status={doc.extraction_status} />
        <span className="text-faint">{isExpanded ? "▾" : "▸"}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-line px-4 py-4 text-[12.5px]">
          {/* Datos extraídos */}
          {doc.extraction_status === "completed" && doc.extracted_data && (
            <ExtractedSummary
              documentType={doc.document_type as DocumentType}
              data={doc.extracted_data}
            />
          )}

          {doc.extraction_status === "failed" && (
            <div className="rounded-md border border-danger/30 bg-danger/[0.08] p-3 text-[12px] text-danger">
              <p className="font-semibold">La extracción falló</p>
              {doc.extraction_error && (
                <p className="mt-1 text-[11px] opacity-80">{doc.extraction_error}</p>
              )}
            </div>
          )}

          {(doc.extraction_status === "pending" ||
            doc.extraction_status === "processing") && (
            <p className="text-[12px] text-muted">
              {doc.extraction_status === "pending"
                ? "Documento en cola. Claude lo analizará en unos segundos."
                : "Claude está leyendo el documento y extrayendo datos."}
            </p>
          )}

          {/* Acciones */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-base/40 px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-faint"
              >
                <DownloadIcon /> Descargar original
              </a>
            )}
            {(doc.extraction_status === "failed" ||
              doc.extraction_status === "completed") && (
              <button
                type="button"
                disabled={pending}
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-base/40 px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-faint disabled:opacity-60"
              >
                {doc.extraction_status === "failed" ? "Reintentar análisis" : "Re-analizar"}
              </button>
            )}
            <Link
              href={`/app/${projectId}/documentacion`}
              className="text-[11px] text-faint hover:text-ink"
            >
              Ver todos →
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              className="ml-auto text-[11px] text-faint hover:text-danger disabled:opacity-60"
            >
              {pending ? "…" : "Eliminar"}
            </button>
          </div>
          {actionError && (
            <p className="mt-2 text-[11px] text-danger">{actionError}</p>
          )}
        </div>
      )}
    </li>
  );
}

// ── Helpers visuales ─────────────────────────────────────────────

function StatusPill({ status }: { status: ExtractionStatus }) {
  const color: Record<ExtractionStatus, string> = {
    pending: "var(--color-faint)",
    processing: "var(--color-violet)",
    completed: "var(--color-success)",
    failed: "var(--color-danger)",
  };
  return (
    <span
      className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ color: color[status], background: `${color[status]}15` }}
    >
      {EXTRACTION_STATUS_LABELS[status]}
    </span>
  );
}

function ExtractedSummary({
  documentType,
  data,
}: {
  documentType: DocumentType;
  data: Record<string, unknown>;
}) {
  // Mostrar solo los campos no-nulos
  const entries = Object.entries(data).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );
  if (entries.length === 0) {
    return (
      <p className="text-[12px] text-muted">
        Claude no encontró datos extraíbles en este documento.
      </p>
    );
  }
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
        Datos extraídos · {DOCUMENT_TYPE_LABELS[documentType]}
      </p>
      <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {entries.slice(0, 12).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2">
            <dt className="shrink-0 text-[10.5px] uppercase tracking-wide text-faint">
              {humanizeKey(k)}
            </dt>
            <dd className="truncate text-[12px] text-ink">{renderValue(v)}</dd>
          </div>
        ))}
      </dl>
      {entries.length > 12 && (
        <p className="mt-2 text-[11px] text-faint">
          +{entries.length - 12} campos más
        </p>
      )}
    </div>
  );
}

function humanizeKey(k: string): string {
  return k.replace(/_/g, " ");
}

function renderValue(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return v.toLocaleString("es-MX");
  if (Array.isArray(v)) return v.map((x) => String(x)).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-faint"
    >
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
