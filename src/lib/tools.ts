// Las 8 herramientas del proforma — fuente única de verdad.
// Derivado de design-reference/creaconstruye-sitemap-brief.jsx

export type ToolId =
  | "terreno"
  | "zonificacion"
  | "mercado"
  | "costos"
  | "financiero"
  | "roi"
  | "cronograma"
  | "riesgos";

export interface Tool {
  num: number;
  id: ToolId;
  name: string;
  tagline: string;
  color: string;
  inputs: string;
  produces: string;
  sections: number;
}

export const TOOLS: Tool[] = [
  {
    num: 1,
    id: "terreno",
    name: "Terreno",
    tagline: "Ubicación, viabilidad y valoración del sitio",
    color: "#22C55E",
    inputs: "Dirección · Superficie m² · Precio · Tipo de desarrollo",
    produces: "Score de ubicación · Precio de mercado · Recomendación",
    sections: 7,
  },
  {
    num: 2,
    id: "zonificacion",
    name: "Zonificación",
    tagline: "Regulaciones, COS/CUS y envolvente máxima",
    color: "#3B82F6",
    inputs: "Clave catastral · Municipio · Proyecto propuesto",
    produces: "m² construibles · Pisos máximos · Checklist de permisos",
    sections: 6,
  },
  {
    num: 3,
    id: "mercado",
    name: "Mercado",
    tagline: "Demanda, precios, absorción y producto óptimo",
    color: "#A855F7",
    inputs: "Zona · m² construibles · Tipo de proyecto · Radio",
    produces: "Precio/m² objetivo · Absorción · Perfil de comprador",
    sections: 8,
  },
  {
    num: 4,
    id: "costos",
    name: "Costos",
    tagline: "Presupuesto paramétrico, partidas y optimizaciones",
    color: "#F59E0B",
    inputs: "m² a construir · Niveles · Estructura · Acabados",
    produces: "Presupuesto total · Costo/m² · Inversión total",
    sections: 8,
  },
  {
    num: 5,
    id: "financiero",
    name: "Financiero",
    tagline: "Flujo de caja, Monte Carlo y punto de equilibrio",
    color: "#06B6D4",
    inputs: "Inversión · Precio/m² · Absorción · Financiamiento",
    produces: "Flujo mensual · 3 escenarios · Monte Carlo · Equilibrio",
    sections: 9,
  },
  {
    num: 6,
    id: "roi",
    name: "ROI",
    tagline: "TIR, VAN, CAP Rate y benchmarking de rentabilidad",
    color: "#10B981",
    inputs: "Flujo de caja · Capital propio · Tasa de descuento",
    produces: "ROI · TIR · VAN · CAP Rate · Payback · Veredicto",
    sections: 7,
  },
  {
    num: 7,
    id: "cronograma",
    name: "Cronograma",
    tagline: "Gantt, ruta crítica, PERT y hitos de desembolso",
    color: "#6366F1",
    inputs: "Alcance · Trámites · Costos · Fecha de inicio",
    produces: "WBS · Gantt · Ruta crítica · Probabilidades PERT",
    sections: 7,
  },
  {
    num: 8,
    id: "riesgos",
    name: "Riesgos + GO/NO-GO",
    tagline: "VaR, mitigación y decisión final de inversión",
    color: "#EF4444",
    inputs: "Outputs de las 7 herramientas anteriores",
    produces: "Matriz de riesgos · VaR · GO/NO-GO con confianza",
    sections: 8,
  },
];

// ── Grafo de la proforma ─────────────────────────────────────
// Qué consume y qué alimenta cada herramienta core. Define la
// modularidad: el orden, las dependencias y qué se desbloquea.
export const TOOL_GRAPH: Record<ToolId, { consumes: ToolId[]; feeds: ToolId[] }> = {
  terreno: { consumes: [], feeds: ["zonificacion", "mercado", "costos"] },
  zonificacion: { consumes: ["terreno"], feeds: ["costos", "mercado"] },
  mercado: { consumes: ["terreno", "zonificacion"], feeds: ["financiero", "roi"] },
  costos: { consumes: ["terreno", "zonificacion"], feeds: ["financiero", "cronograma"] },
  financiero: { consumes: ["costos", "mercado", "cronograma"], feeds: ["roi", "riesgos"] },
  roi: { consumes: ["financiero", "mercado"], feeds: ["riesgos"] },
  cronograma: { consumes: ["costos"], feeds: ["financiero", "riesgos"] },
  riesgos: {
    consumes: ["terreno", "zonificacion", "mercado", "costos", "financiero", "roi", "cronograma"],
    feeds: [],
  },
};

// Las 8 son fijas (core): por la naturaleza de los datos que capturan
// y su relevancia, no se quitan de la proforma. Son la columna vertebral.
export const CORE_TOOL_IDS: ToolId[] = TOOLS.map((t) => t.id);

export function getTool(id: ToolId): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
