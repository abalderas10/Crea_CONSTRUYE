// Tipos compartidos para las tarjetas de cálculo del proforma.

/** De dónde proviene un dato usado en un cálculo (para transparencia). */
export type SourceKind = "manual" | "tool" | "data" | "ai";

export interface CalcInput {
  /** Nombre de la variable, ej. "Superficie". */
  label: string;
  /** Valor mostrado, ej. "520 m²". */
  value: string;
  /** Origen legible, ej. "Mercado", "INEGI", "Tú". */
  source: string;
  /** Categoría de origen (define el color del tag). Default: "manual". */
  kind?: SourceKind;
}

export const SOURCE_COLOR: Record<SourceKind, string> = {
  manual: "var(--color-faint)", // lo capturaste tú
  tool: "var(--color-info)", // viene de otra herramienta
  data: "var(--color-warning)", // dato externo (INEGI, BIMSA, etc.)
  ai: "var(--color-violet)", // generado por Claude
};

export const SOURCE_LABEL: Record<SourceKind, string> = {
  manual: "Manual",
  tool: "Herramienta",
  data: "Dato externo",
  ai: "IA",
};
