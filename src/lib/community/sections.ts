// Secciones del catálogo de Herramientas de comunidad.
// Fuente única de verdad para etiquetas, colores e íconos por sección.

export type ToolSection =
  | "arquitectura"
  | "construccion"
  | "normatividad"
  | "mantenimiento"
  | "otro";

export type ToolProposalStatus =
  | "proposed"
  | "in_review"
  | "approved"
  | "published"
  | "rejected";

export interface SectionMeta {
  id: ToolSection;
  name: string;
  tagline: string;
  color: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "arquitectura",
    name: "Arquitectura",
    tagline: "Diseño, envolvente, normatividad de uso de suelo",
    color: "#8B5CF6", // violet
  },
  {
    id: "construccion",
    name: "Construcción",
    tagline: "Estructura, costos, materiales, mano de obra",
    color: "#F59E0B", // amber
  },
  {
    id: "normatividad",
    name: "Normatividad",
    tagline: "Reglas locales por estado y municipio",
    color: "#06B6D4", // cyan
  },
  {
    id: "mantenimiento",
    name: "Mantenimiento",
    tagline: "Levantamiento, remodelación, instalaciones",
    color: "#22C55E", // green
  },
  {
    id: "otro",
    name: "Otro",
    tagline: "Herramientas transversales",
    color: "#A3A3A3",
  },
];

export function getSection(id?: string): SectionMeta {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[4];
}

export const STATUS_META: Record<
  ToolProposalStatus,
  { label: string; color: string }
> = {
  proposed: { label: "Propuesta", color: "#A3A3A3" },
  in_review: { label: "En revisión", color: "#06B6D4" },
  approved: { label: "Aprobada", color: "#8B5CF6" },
  published: { label: "Publicada", color: "#C8FF00" },
  rejected: { label: "No procede", color: "#EF4444" },
};
