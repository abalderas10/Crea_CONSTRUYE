"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DOCUMENT_TYPE_LABELS,
  CATEGORY_BY_TYPE,
  type DocumentType,
  type DocumentTool,
  type ProjectDocument,
} from "@/lib/documentacion";
import { CategoryChip } from "./CategoryChip";
import { uploadProjectDocument } from "@/app/app/[projectId]/documentacion/actions";

interface DocumentUploaderProps {
  projectId: string;
  tool: DocumentTool;
  defaultDocumentType?: DocumentType;
  /** Si se omite, se redirige a la página principal de Documentación. */
  onUploaded?: (doc: ProjectDocument) => void;
  /** Etiqueta del botón principal. */
  label?: string;
  /** Si true, muestra un link "Ver todos los documentos" debajo. */
  showViewAll?: boolean;
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

/**
 * Componente de subida de documentos.
 * - Selector de tipo (chips).
 * - Drag & drop o file input.
 * - Llama a la server action `uploadProjectDocument`.
 * - Muestra progreso y estado (pending → processing → completed/failed).
 */
export function DocumentUploader({
  projectId,
  tool,
  defaultDocumentType = "otro",
  onUploaded,
  label = "Subir documento",
  showViewAll = true,
}: DocumentUploaderProps) {
  const [docType, setDocType] = useState<DocumentType>(defaultDocumentType);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFile(file: File) {
    setError(null);
    if (!file) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("tool", tool);
      fd.set("documentType", docType);
      const result = await uploadProjectDocument(projectId, fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Refrescar la lista del servidor
      router.refresh();
      if (onUploaded) {
        onUploaded(result.data.document);
      }
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-3">
      {/* Selector de tipo */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setDocType(t)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              docType === t
                ? "border-volt/50 bg-volt/10 text-volt"
                : "border-line text-muted hover:border-faint hover:text-ink"
            }`}
          >
            <CategoryChip category={CATEGORY_BY_TYPE[t]} size="sm" />
            <span>{DOCUMENT_TYPE_LABELS[t]}</span>
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors ${
          dragOver
            ? "border-volt bg-volt/[0.06]"
            : "border-line bg-base/40 hover:border-faint"
        }`}
      >
        <UploadIcon />
        <p className="text-[12.5px] text-muted">
          <span className="font-semibold text-ink">Click para subir</span> o
          arrastra y suelta
        </p>
        <p className="text-[10.5px] text-faint">
          PDF, JPEG, PNG, HEIC, TIFF · máximo 20 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/heic,image/heif,image/tiff,.pdf,.jpg,.jpeg,.png,.heic,.heif,.tiff,.tif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = ""; // permite re-subir el mismo archivo
          }}
        />
      </div>

      {/* Estado */}
      {pending && (
        <p className="flex items-center gap-2 text-[12px] text-muted">
          <Spinner /> Subiendo y encolando para análisis…
        </p>
      )}
      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/[0.08] px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {showViewAll && (
        <p className="text-[11px] text-faint">
          Los documentos subidos quedan disponibles en{" "}
          <a
            href={`/app/${projectId}/documentacion`}
            className="text-volt hover:underline"
          >
            Documentación
          </a>
          . Se analizan con Claude en cuanto se suben.
        </p>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-faint"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin text-violet"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  );
}
