// Sistema de rigor: el nivel de validación de una herramienta se CALCULA
// de su evidencia (fuentes citadas, avales firmados, caso de prueba),
// nunca se autodeclara. Serio y verificable.

export type RigorLevel =
  | "borrador"
  | "sustentada"
  | "revisada"
  | "avalada"
  | "certificada";

export type ReferenciaTipo = "libro" | "norma" | "paper" | "dato-oficial";

export interface Referencia {
  tipo: ReferenciaTipo;
  titulo: string;
  autor?: string; // autor / editorial / autoridad
  detalle?: string; // edición, página, artículo, año
  url?: string;
}

export interface CasoPrueba {
  entradas: string;
  esperado: string;
  notas?: string;
}

export const REFERENCIA_TIPO_LABEL: Record<ReferenciaTipo, string> = {
  libro: "Libro",
  norma: "Norma",
  paper: "Paper",
  "dato-oficial": "Dato oficial",
};

export const RIGOR_META: Record<
  RigorLevel,
  { label: string; color: string; icon: string; desc: string }
> = {
  borrador: {
    label: "Borrador",
    color: "#A3A3A3",
    icon: "○",
    desc: "Es una idea en construcción; aún sin evidencia que la respalde.",
  },
  sustentada: {
    label: "Sustentada",
    color: "#06B6D4",
    icon: "❡",
    desc: "Cita fuentes verificables (libro, norma o paper). Hecha «de acuerdo al libro».",
  },
  revisada: {
    label: "Revisada",
    color: "#8B5CF6",
    icon: "✓",
    desc: "Sustentada en fuentes y revisada por el equipo de creaConstruye.",
  },
  avalada: {
    label: "Avalada por experto",
    color: "#C8FF00",
    icon: "✚",
    desc: "Un profesional identificado la firma con su cédula profesional, verificable en el RNP.",
  },
  certificada: {
    label: "Certificada",
    color: "#22C55E",
    icon: "★",
    desc: "Fuentes + aval de experto + caso de prueba resuelto. Rigor completo.",
  },
};

export interface RigorInput {
  referencias?: Referencia[] | null;
  avalesCount?: number;
  casoPrueba?: CasoPrueba | null;
  status?: string;
}

/** Calcula el nivel de rigor a partir de la evidencia disponible. */
export function rigorLevel({
  referencias,
  avalesCount = 0,
  casoPrueba,
  status,
}: RigorInput): RigorLevel {
  const tieneFuentes = (referencias?.length ?? 0) >= 1;
  const tieneAval = avalesCount >= 1;
  const tieneCaso = !!casoPrueba;
  const revisadoPorEquipo = status === "approved" || status === "published";

  if (tieneFuentes && tieneAval && tieneCaso) return "certificada";
  if (tieneAval) return "avalada";
  if (tieneFuentes && revisadoPorEquipo) return "revisada";
  if (tieneFuentes) return "sustentada";
  return "borrador";
}

/** Orden ascendente de rigor (para comparar / ordenar). */
export const RIGOR_ORDER: RigorLevel[] = [
  "borrador",
  "sustentada",
  "revisada",
  "avalada",
  "certificada",
];
