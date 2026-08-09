// Sistema de categorías visuales para los tipos de documento.
// Cada DocumentType se mapea a una categoría semántica que se representa
// con un color apagado (no compite con volt ni violet). El violeta es
// exclusivo de AI conversacional (nunca se usa para un documento).

import type { DocumentType } from "./types";

/** Categorías visuales. `ai` NO es una categoría de documento, solo se
 *  usa para reusar el chip en superficies de razonamiento AI. */
export type DocumentCategory =
  | "legal"
  | "financiero"
  | "tecnico"
  | "sustentabilidad"
  | "arquitectura"
  | "mercado"
  | "operacion"
  | "ai";

/** Mapa DocumentType → DocumentCategory. */
export const CATEGORY_BY_TYPE: Record<DocumentType, DocumentCategory> = {
  plano_topografico: "tecnico",
  certificado_uso_suelo: "legal",
  boleta_predial: "legal",
  contrato: "legal",
  avaluo: "financiero",
  licencia_obra: "legal",
  fotos: "operacion",
  otro: "operacion",
};

/** Etiqueta legible de cada categoría. */
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  legal: "Legal",
  financiero: "Financiero",
  tecnico: "Técnico",
  sustentabilidad: "Sustentabilidad",
  arquitectura: "Arquitectura",
  mercado: "Mercado",
  operacion: "Operación",
  ai: "AI",
};

/** Paleta de cada categoría: bg (15% alpha), fg (saturado), border (25%). */
export const CATEGORY_COLORS: Record<
  DocumentCategory,
  { bg: string; fg: string; border: string }
> = {
  legal: { bg: "#8B6F4720", fg: "#8B6F47", border: "#8B6F4740" },
  financiero: { bg: "#3B6A8F20", fg: "#3B6A8F", border: "#3B6A8F40" },
  tecnico: { bg: "#B5693A20", fg: "#B5693A", border: "#B5693A40" },
  sustentabilidad: { bg: "#6B8E5A20", fg: "#6B8E5A", border: "#6B8E5A40" },
  arquitectura: { bg: "#A8575120", fg: "#A85751", border: "#A8575140" },
  mercado: { bg: "#B8943A20", fg: "#B8943A", border: "#B8943A40" },
  operacion: { bg: "#5A6B7F20", fg: "#5A6B7F", border: "#5A6B7F40" },
  ai: { bg: "#8B5CF620", fg: "#8B5CF6", border: "#8B5CF640" },
};
