"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS, type DocumentCategory } from "@/lib/documentacion/categories";

interface CategoryChipProps {
  category: DocumentCategory;
  /** sm = solo dot 8x8 (default). md = dot + label. */
  size?: "sm" | "md";
  /** Si true, siempre muestra el label aunque el size sea sm. */
  showLabel?: boolean;
  className?: string;
}

/**
 * Chip de categoría visual. Usa los hex exactos definidos en
 * `CATEGORY_COLORS`. Por defecto solo muestra un dot 8x8 con el color
 * (modo "sm"); con `size="md"` o `showLabel` muestra también el texto.
 *
 * El violeta (`ai`) está reservado para superficies de razonamiento AI
 * y NO debe usarse como categoría de documento.
 */
export function CategoryChip({
  category,
  size = "sm",
  showLabel = false,
  className = "",
}: CategoryChipProps) {
  const colors = CATEGORY_COLORS[category];
  const showText = size === "md" || showLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs ${
        showText ? "px-1.5 py-0.5" : ""
      } text-[10px] font-bold uppercase tracking-wide ${className}`}
      style={{
        background: showText ? colors.bg : "transparent",
        color: colors.fg,
        border: showText ? `1px solid ${colors.border}` : "none",
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: 8,
          height: 8,
          background: colors.fg,
          flexShrink: 0,
        }}
        aria-hidden
      />
      {showText && <span>{CATEGORY_LABELS[category]}</span>}
    </span>
  );
}
