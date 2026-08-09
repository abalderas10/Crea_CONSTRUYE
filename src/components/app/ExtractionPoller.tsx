"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectDocument } from "@/lib/documentacion";

interface ExtractionPollerProps {
  documents: ProjectDocument[];
  /** Cada cuánto refrescar (ms). Default 3000. */
  intervalMs?: number;
  /** Tiempo máximo de polling (ms). Default 60000. */
  maxDurationMs?: number;
}

/**
 * Si hay documentos en `pending` o `processing`, llama a
 * `router.refresh()` cada `intervalMs` durante máximo `maxDurationMs`.
 * Se desmonta solo cuando ya no hay docs en proceso o se acabó el tiempo.
 *
 * Muestra un indicador sutil "Analizando X documentos…" en la esquina
 * inferior derecha.
 */
export function ExtractionPoller({
  documents,
  intervalMs = 3000,
  maxDurationMs = 60000,
}: ExtractionPollerProps) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  const pendingCount = documents.filter(
    (d) =>
      d.extraction_status === "pending" || d.extraction_status === "processing",
  ).length;

  useEffect(() => {
    if (pendingCount === 0) return;
    setHidden(false);
    const start = Date.now();
    const id = setInterval(() => {
      if (Date.now() - start >= maxDurationMs) {
        setHidden(true);
        clearInterval(id);
        return;
      }
      router.refresh();
    }, intervalMs);
    return () => {
      clearInterval(id);
    };
  }, [pendingCount, intervalMs, maxDurationMs, router]);

  if (pendingCount === 0 || hidden) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border bg-raised/95 px-3 py-2 text-[11.5px] font-semibold shadow-card backdrop-blur"
      style={{
        borderColor: "#8B5CF640",
        color: "#a78bfa",
      }}
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: "#8B5CF6" }}
        aria-hidden
      />
      Analizando {pendingCount}{" "}
      {pendingCount === 1 ? "documento" : "documentos"}…
    </div>
  );
}
