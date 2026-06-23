import type { ToolSection } from "./sections";

// Herramientas "core" ya disponibles en la plataforma.
// Sirven como semilla del catálogo y como ejemplo de lo que la
// comunidad puede ampliar (ej. CUS/COS de otros estados).

export interface CatalogTool {
  id: string;
  name: string;
  section: ToolSection;
  description: string;
  /** Herramientas core de la proforma a las que alimenta. */
  feeds: string[];
  /** Normatividad en la que se basa (para sección Legal). */
  normatividad?: string;
  expertValidated?: boolean;
  /** true = lista para usar; false = pendiente de construir. */
  available: boolean;
}

export const CATALOG: CatalogTool[] = [
  {
    id: "cos-cus-cdmx",
    name: "COS / CUS · CDMX",
    section: "arquitectura",
    description:
      "Envolvente construible según el Coeficiente de Ocupación y Utilización del Suelo de la Ciudad de México (CUZUS / SEDUVI).",
    feeds: ["terreno", "zonificacion", "costos"],
    normatividad: "CDMX · SEDUVI · Programa de Desarrollo Urbano",
    available: true,
  },
  {
    id: "cos-cus-edomex",
    name: "COS / CUS · Edo. de México",
    section: "arquitectura",
    description:
      "Misma envolvente con las reglas del Plan Municipal de Desarrollo Urbano del Estado de México (SEDUI).",
    feeds: ["terreno", "zonificacion", "costos"],
    normatividad: "Edomex · SEDUI · Plan Municipal de Desarrollo Urbano",
    available: true,
  },
  {
    id: "calculo-estructural",
    name: "Cálculo estructural preliminar",
    section: "construccion",
    description:
      "Predimensionamiento de estructura (cargas, claros, sistema) para alimentar el presupuesto de obra. Validable por ingeniero estructurista.",
    feeds: ["costos"],
    normatividad: "NTC · Reglamento de Construcciones (estructuras)",
    expertValidated: true,
    available: false,
  },
  {
    id: "levantamiento-espacio",
    name: "Levantamiento de espacio",
    section: "mantenimiento",
    description:
      "Mediciones, fotos y escaneo 3D/RFID de una casa u oficina. Exporta a presupuesto, cotización y lista de materiales.",
    feeds: ["costos"],
    available: false,
  },
];
