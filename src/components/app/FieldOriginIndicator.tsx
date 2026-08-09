"use client";

import { CATEGORY_LABELS, type DocumentCategory } from "@/lib/documentacion/categories";
import { CategoryChip } from "./CategoryChip";

interface FieldOriginIndicatorProps {
  docId: string;
  docFileName: string;
  category: DocumentCategory;
  appliedAt: string;
}

/**
 * Indicador flotante que muestra de qué documento provino el valor
 * de un input. Se monta como hermano del input vía `MutationObserver`
 * en `DocumentosAdjuntos` (no se usa directamente en el form).
 */
export function FieldOriginIndicator({
  docId,
  docFileName,
  category,
  appliedAt,
}: FieldOriginIndicatorProps) {
  const tip = `De: ${docFileName} · aplicado el ${new Date(appliedAt).toLocaleDateString(
    "es-MX",
    { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" },
  )}`;

  return (
    <span
      data-origin-doc-id={docId}
      className="ml-1.5 inline-flex items-center gap-1 align-middle"
      title={tip}
    >
      <CategoryChip category={category} />
    </span>
  );
}

/** Crea un indicador flotante listo para inyectar. */
export function createFieldOriginIndicator(
  docId: string,
  docFileName: string,
  category: DocumentCategory,
  appliedAt: string,
): HTMLSpanElement {
  const el = document.createElement("span");
  el.dataset.originDocId = docId;
  el.dataset.originDocName = docFileName;
  el.dataset.originCategory = category;
  el.dataset.originAppliedAt = appliedAt;
  el.className = "cc-field-origin-indicator ml-1.5 inline-flex items-center gap-1 align-middle";
  el.title = `De: ${docFileName} · aplicado el ${new Date(appliedAt).toLocaleDateString(
    "es-MX",
    { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" },
  )}`;
  el.setAttribute("aria-label", `Origen: ${docFileName}`);

  // Dot con color de la categoría
  const colors: Record<DocumentCategory, string> = {
    legal: "#8B6F47",
    financiero: "#3B6A8F",
    tecnico: "#B5693A",
    sustentabilidad: "#6B8E5A",
    arquitectura: "#A85751",
    mercado: "#B8943A",
    operacion: "#5A6B7F",
    ai: "#8B5CF6",
  };
  const dot = document.createElement("span");
  dot.style.width = "8px";
  dot.style.height = "8px";
  dot.style.borderRadius = "9999px";
  dot.style.background = colors[category];
  dot.style.display = "inline-block";
  dot.style.flexShrink = "0";
  el.appendChild(dot);

  // Label opcional (oculto, solo AT)
  const label = document.createElement("span");
  label.textContent = CATEGORY_LABELS[category];
  label.style.fontSize = "10px";
  label.style.fontWeight = "700";
  label.style.textTransform = "uppercase";
  label.style.letterSpacing = "0.05em";
  label.style.color = colors[category];
  label.style.display = "none";
  el.appendChild(label);

  return el;
}
