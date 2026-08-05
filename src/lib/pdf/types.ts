// Tipos compartidos para todos los reportes PDF.

import type { ToolStatusMap, Project } from "@/lib/data/projects";
import type { ToolId } from "@/lib/tools";

/** Data de una herramienta: inputs + análisis AI. */
export interface ToolRow {
  data: unknown;
  ai_analysis: unknown;
}

/** Data de todas las herramientas del proyecto, indexada por id. */
export type ToolRows = Partial<Record<ToolId, ToolRow>>;

/** Props base que comparten los 4 reportes. */
export interface BaseReportProps {
  project: Project;
  toolData: ToolRows;
  statuses: ToolStatusMap;
  /** Fecha de generación (por defecto = hoy). */
  generatedAt?: Date;
}

/** Mapea veredicto de cualquier herramienta a un GO/NO-GO estandarizado. */
export function goNoGoFromTools(
  toolData: ToolRows,
  statuses: ToolStatusMap,
): { verdict: "GO" | "GO_WITH_CONDITIONS" | "NO_GO" | "PENDIENTE"; confidence: number; reason: string } {
  const riesgos = toolData.riesgos;
  const roi = toolData.roi;
  const terreno = toolData.terreno;

  if (!terreno?.ai_analysis && !roi?.ai_analysis) {
    return {
      verdict: "PENDIENTE",
      confidence: 0,
      reason: "Faltan análisis por generar (Terreno y/o ROI).",
    };
  }

  // Si tenemos veredicto de Riesgos, ese manda
  const r = riesgos?.ai_analysis as { veredicto?: string; confianza?: number } | undefined;
  if (r?.veredicto) {
    const v = r.veredicto.toUpperCase();
    if (v === "GO" || v === "PROCEDE" || v === "COMPRAR")
      return { verdict: "GO", confidence: r.confianza ?? 0, reason: "Análisis de Riesgos: procede." };
    if (v === "GO_WITH_CONDITIONS" || v === "AJUSTAR" || v === "NEGOCIAR")
      return {
        verdict: "GO_WITH_CONDITIONS",
        confidence: r.confianza ?? 0,
        reason: "Análisis de Riesgos: proceder con ajustes.",
      };
    if (v === "NO_GO" || v === "NO_PROCEDE" || v === "NO_COMPRAR")
      return {
        verdict: "NO_GO",
        confidence: r.confianza ?? 0,
        reason: "Análisis de Riesgos: no procede.",
      };
  }

  // Si no, inferimos del estado: 6+ herramientas hechas = plausible GO
  const done = Object.values(statuses).filter((s) => s === "done").length;
  if (done >= 6) {
    return {
      verdict: "GO_WITH_CONDITIONS",
      confidence: 60,
      reason: `Proforma ${done}/8 completa. Falta veredicto formal de Riesgos.`,
    };
  }

  return {
    verdict: "PENDIENTE",
    confidence: 0,
    reason: `Solo ${done}/8 herramientas completas.`,
  };
}

/** Cuenta herramientas por estado. */
export function countByStatus(statuses: ToolStatusMap) {
  return {
    done: Object.values(statuses).filter((s) => s === "done").length,
    inProgress: Object.values(statuses).filter((s) => s === "in_progress").length,
    empty: Object.values(statuses).filter((s) => s === "empty").length,
  };
}
