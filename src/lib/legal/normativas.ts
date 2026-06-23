// Biblioteca de normatividad vigente para México (federal + local).
// Registro curado: se amplía agregando entradas. Cada herramienta que
// se apoya en una norma queda enlazada aquí (auto-linkeo conceptual).

export type Ambito = "federal" | "estatal" | "municipal";

export type Tema =
  | "uso-de-suelo"
  | "construccion"
  | "ambiental"
  | "fiscal"
  | "riesgo";

export interface CambioNorma {
  fecha: string; // ISO
  resumen: string;
  sugerencia: string; // ajuste sugerido en la herramienta afectada
}

export interface Normativa {
  id: string;
  titulo: string;
  ambito: Ambito;
  entidad: string; // "Federal", "CDMX", "Estado de México", municipio…
  autoridad: string; // SEDUVI, SEDUI, Cabildo, SEDATU…
  tema: Tema;
  documento: string; // tipo de documento
  resumen: string;
  vigenciaDesde: string; // ISO o año
  url?: string;
  /** Herramientas de la plataforma que se apoyan en esta norma. */
  herramientas: string[];
  /** Alerta de cambio reciente (si aplica). */
  cambio?: CambioNorma;
}

export const AMBITO_META: Record<Ambito, { label: string; color: string }> = {
  federal: { label: "Federal", color: "#06B6D4" },
  estatal: { label: "Estatal", color: "#8B5CF6" },
  municipal: { label: "Municipal", color: "#F59E0B" },
};

export const TEMA_META: Record<Tema, { label: string }> = {
  "uso-de-suelo": { label: "Uso de suelo" },
  construccion: { label: "Construcción" },
  ambiental: { label: "Ambiental" },
  fiscal: { label: "Fiscal" },
  riesgo: { label: "Riesgo" },
};

export const NORMATIVAS: Normativa[] = [
  // ── Federal ────────────────────────────────────────────────
  {
    id: "lgahotdu",
    titulo:
      "Ley General de Asentamientos Humanos, Ordenamiento Territorial y Desarrollo Urbano",
    ambito: "federal",
    entidad: "Federal",
    autoridad: "SEDATU",
    tema: "uso-de-suelo",
    documento: "Ley General (LGAHOTDU)",
    resumen:
      "Marco federal que rige la planeación del territorio, los usos del suelo y la coordinación entre federación, estados y municipios.",
    vigenciaDesde: "2016",
    herramientas: ["Terreno", "COS / CUS · CDMX", "COS / CUS · Edo. de México"],
  },
  {
    id: "leey-equilibrio-ecologico",
    titulo: "Ley General del Equilibrio Ecológico y la Protección al Ambiente",
    ambito: "federal",
    entidad: "Federal",
    autoridad: "SEMARNAT",
    tema: "ambiental",
    documento: "Ley General (LGEEPA)",
    resumen:
      "Regula la evaluación de impacto ambiental (MIA) y las condiciones para desarrollos que afectan recursos naturales.",
    vigenciaDesde: "1988",
    herramientas: ["Terreno", "Riesgos + GO/NO-GO"],
  },

  // ── CDMX ───────────────────────────────────────────────────
  {
    id: "ley-desarrollo-urbano-cdmx",
    titulo: "Ley de Desarrollo Urbano de la Ciudad de México",
    ambito: "estatal",
    entidad: "CDMX",
    autoridad: "SEDUVI",
    tema: "uso-de-suelo",
    documento: "Ley local + Programas de Desarrollo Urbano",
    resumen:
      "Define usos de suelo, COS, CUS y alturas en la CDMX a través de los Programas Delegacionales/Parciales y el sistema CUZUS.",
    vigenciaDesde: "2010",
    herramientas: ["COS / CUS · CDMX", "Terreno", "Zonificación"],
  },
  {
    id: "reglamento-construcciones-cdmx",
    titulo: "Reglamento de Construcciones para la Ciudad de México",
    ambito: "estatal",
    entidad: "CDMX",
    autoridad: "Gobierno de la CDMX",
    tema: "construccion",
    documento: "Reglamento + Normas Técnicas Complementarias (NTC)",
    resumen:
      "Establece los requisitos estructurales, de seguridad y de proyecto. Las NTC detallan cargas, sismo y diseño estructural.",
    vigenciaDesde: "2017",
    herramientas: ["Costos", "Cálculo estructural preliminar"],
    cambio: {
      fecha: "2026-05-12",
      resumen:
        "Actualización de las NTC para Diseño por Sismo: nuevos espectros y factores para algunas zonas geotécnicas de la CDMX.",
      sugerencia:
        "Revisar el predimensionamiento estructural en la herramienta de Cálculo estructural; los factores de sismo pueden subir el costo de estructura.",
    },
  },

  // ── Estado de México ───────────────────────────────────────
  {
    id: "codigo-administrativo-edomex-libro-quinto",
    titulo:
      "Código Administrativo del Estado de México — Libro Quinto (Ordenamiento Territorial)",
    ambito: "estatal",
    entidad: "Estado de México",
    autoridad: "SEDUI",
    tema: "uso-de-suelo",
    documento: "Código Administrativo + Reglamento del Libro Quinto",
    resumen:
      "Rige el ordenamiento territorial y los usos de suelo en el Edomex. El detalle por municipio vive en los Planes Municipales de Desarrollo Urbano.",
    vigenciaDesde: "2002",
    herramientas: ["COS / CUS · Edo. de México", "Terreno", "Zonificación"],
  },
  {
    id: "plan-municipal-desarrollo-urbano-edomex",
    titulo: "Plan Municipal de Desarrollo Urbano",
    ambito: "municipal",
    entidad: "Estado de México",
    autoridad: "Ayuntamiento / Cabildo",
    tema: "uso-de-suelo",
    documento: "Plan Municipal (por municipio)",
    resumen:
      "Documento municipal que fija COS, CUS, densidades y usos específicos por zona. Es la fuente operativa para la envolvente construible en el Edomex.",
    vigenciaDesde: "Variable por municipio",
    herramientas: ["COS / CUS · Edo. de México", "Terreno"],
  },
];

export function getNormativa(id: string): Normativa | undefined {
  return NORMATIVAS.find((n) => n.id === id);
}

export function normativasConCambio(): Normativa[] {
  return NORMATIVAS.filter((n) => n.cambio);
}

const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

export function fmtFecha(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[(m ?? 1) - 1]} ${y}`;
}
