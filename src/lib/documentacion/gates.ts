// Sistema de gates por herramienta.
//
// Cada tool tiene un "gate" que define qué se necesita para poder
// usarla. Hay dos tipos de gate:
//   - Gate de documentos: requiere N documentos de ciertos tipos
//     (configurados en `requiresAny`).
//   - Gate de combinación: requiere que otras tools estén aprobadas
//     (configurado en `dependsOn`). No exige docs propios.
//
// Las tools ROI, cronograma y riesgos son gates de combinación.
// Terreno, zonificación, mercado, costos y financiero son gates de
// documentos. `general` no tiene gate.

import type { DocumentTool, ProjectDocument } from "./types";

export type GateStatus = "locked" | "partial" | "ready";

export type GateRequirementType =
  | "plano_topografico"
  | "boleta_predial"
  | "certificado_uso_suelo"
  | "otro"
  | "avaluo"
  | "contrato";

export interface ToolGateConfig {
  /** Tools que esta tool depende (gate de combinación). Vacío = solo docs. */
  dependsOn: DocumentTool[];
  /** Document types que satisfacen esta tool (OR). Vacío = depende solo de otras tools. */
  requiresAny: GateRequirementType[];
  /** Mensaje para mostrar al usuario cuando está locked. */
  lockedReason: string;
  /** Mínimo de docs si la tool acepta docs. Default 1. */
  minDocs?: number;
}

export const TOOL_GATES: Record<DocumentTool, ToolGateConfig> = {
  terreno: {
    dependsOn: [],
    requiresAny: ["plano_topografico", "boleta_predial"],
    lockedReason:
      "Sube el plano topográfico o la boleta predial del terreno para empezar.",
  },
  zonificacion: {
    dependsOn: [],
    requiresAny: ["certificado_uso_suelo"],
    lockedReason:
      "Sube el certificado o dictamen de uso de suelo para definir la envolvente.",
  },
  mercado: {
    dependsOn: [],
    requiresAny: ["otro", "contrato"],
    lockedReason: "Sube un estudio de mercado, comparables o un contrato relevante.",
  },
  costos: {
    dependsOn: [],
    requiresAny: ["otro", "avaluo"],
    lockedReason: "Sube un presupuesto, cotización o avalúo para arrancar costos.",
  },
  financiero: {
    dependsOn: [],
    requiresAny: ["otro", "contrato"],
    lockedReason:
      "Sube tus estados financieros, tabla de crédito o contrato bancario.",
  },
  roi: {
    dependsOn: ["terreno", "costos", "financiero"],
    requiresAny: [],
    lockedReason: "Completa Terreno + Costos + Financiero para calcular el ROI.",
  },
  cronograma: {
    dependsOn: ["terreno", "zonificacion"],
    requiresAny: [],
    lockedReason: "Completa Terreno + Zonificación para armar el cronograma.",
  },
  riesgos: {
    dependsOn: ["terreno", "zonificacion", "mercado"],
    requiresAny: [],
    lockedReason:
      "Completa Terreno + Zonificación + Mercado para evaluar los riesgos.",
  },
  general: {
    dependsOn: [],
    requiresAny: [],
    lockedReason: "",
  },
};

export interface GateEvaluation {
  status: GateStatus;
  /** % de 0 a 100 según qué tan completo está el gate. */
  progress: number;
  /** Tools faltantes (gates de combinación). */
  missingTools: DocumentTool[];
  /** Mensaje legible (lo que falta o por qué está locked). */
  reason: string;
}

/** Status de una tool en el proyecto (origen: `project_tool_data.status`). */
export type ProjectToolStatus = "empty" | "in_progress" | "done";

/**
 * Evalúa el estado del gate de una tool. Recibe los documentos del
 * proyecto y un mapa de status por tool (de `project_tool_data`).
 *
 * Devuelve `ready` cuando:
 *   - Si es gate de combinación: todas las deps están `done`/`approved`.
 *   - Si es gate de docs: hay al menos `minDocs` documentos del tool
 *     o `general`, de los tipos requeridos, y al menos `minDocs` están
 *     extraídos (`extraction_status === "completed"`).
 */
export function evaluateGate(
  tool: DocumentTool,
  documents: ProjectDocument[],
  toolStatusByTool: Partial<Record<DocumentTool, ProjectToolStatus>>,
): GateEvaluation {
  const config = TOOL_GATES[tool];

  // Tool sin gate
  if (config.requiresAny.length === 0 && config.dependsOn.length === 0) {
    return { status: "ready", progress: 100, missingTools: [], reason: "" };
  }

  // 1. Gate de combinación
  if (config.dependsOn.length > 0) {
    const missing: DocumentTool[] = [];
    for (const dep of config.dependsOn) {
      const s = toolStatusByTool[dep];
      if (s !== "done") missing.push(dep);
    }
    const readyDeps = config.dependsOn.length - missing.length;
    const progress = Math.round((readyDeps / config.dependsOn.length) * 100);
    if (missing.length === 0) {
      return { status: "ready", progress: 100, missingTools: [], reason: "" };
    }
    return {
      status: missing.length === config.dependsOn.length ? "locked" : "partial",
      progress,
      missingTools: missing,
      reason: config.lockedReason,
    };
  }

  // 2. Gate de documentos
  const minDocs = config.minDocs ?? 1;
  const toolDocs = documents.filter(
    (d) => d.tool === tool || d.tool === "general",
  );
  const matchingDocs = toolDocs.filter((d) =>
    config.requiresAny.includes(d.document_type as GateRequirementType),
  );
  const completedMatching = matchingDocs.filter(
    (d) => d.extraction_status === "completed",
  ).length;

  if (matchingDocs.length >= minDocs && completedMatching >= minDocs) {
    return { status: "ready", progress: 100, missingTools: [], reason: "" };
  }
  if (matchingDocs.length === 0) {
    return {
      status: "locked",
      progress: 0,
      missingTools: [],
      reason: config.lockedReason,
    };
  }
  // Tiene algunos pero no todos extraídos
  const progress = Math.round(
    (Math.min(completedMatching, minDocs) / minDocs) * 100,
  );
  return {
    status: "partial",
    progress,
    missingTools: [],
    reason: config.lockedReason,
  };
}

/** Evalúa los 8 gates + general de un proyecto. */
export function evaluateAllGates(
  documents: ProjectDocument[],
  toolStatusByTool: Partial<Record<DocumentTool, ProjectToolStatus>>,
): Record<DocumentTool, GateEvaluation> {
  const out = {} as Record<DocumentTool, GateEvaluation>;
  (Object.keys(TOOL_GATES) as DocumentTool[]).forEach((t) => {
    out[t] = evaluateGate(t, documents, toolStatusByTool);
  });
  return out;
}

/** Cuenta cuántas tools están en estado `ready`. */
export function countReady(
  evals: Record<DocumentTool, GateEvaluation>,
): number {
  // Solo las 8 tools core cuentan para "X/Y herramientas listas"
  const core: DocumentTool[] = [
    "terreno",
    "zonificacion",
    "mercado",
    "costos",
    "financiero",
    "roi",
    "cronograma",
    "riesgos",
  ];
  return core.filter((t) => evals[t]?.status === "ready").length;
}
