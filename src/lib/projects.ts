// Proyectos demo para el shell mientras conectamos Supabase.
// Más adelante esto se reemplaza por queries reales a la tabla `projects`.

import type { ToolId } from "@/lib/tools";

export type ToolStatus = "empty" | "in_progress" | "done";

export interface DemoProject {
  id: string;
  name: string;
  municipio: string;
  tipo: string;
  createdAt: string;
  toolStatus: Record<ToolId, ToolStatus>;
}

export const DEMO_PROJECTS: DemoProject[] = [
  {
    id: "naucalpan-centro",
    name: "Torre Naucalpan Centro",
    municipio: "Naucalpan, Edomex",
    tipo: "Uso mixto · 100 unidades",
    createdAt: "2026-05-28",
    toolStatus: {
      terreno: "done",
      zonificacion: "done",
      mercado: "in_progress",
      costos: "empty",
      financiero: "empty",
      roi: "empty",
      cronograma: "empty",
      riesgos: "empty",
    },
  },
  {
    id: "polanco-residencial",
    name: "Residencial Polanco",
    municipio: "Miguel Hidalgo, CDMX",
    tipo: "Residencial premium · 24 deptos",
    createdAt: "2026-06-10",
    toolStatus: {
      terreno: "done",
      zonificacion: "empty",
      mercado: "empty",
      costos: "empty",
      financiero: "empty",
      roi: "empty",
      cronograma: "empty",
      riesgos: "empty",
    },
  },
];

export function getProject(id: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((p) => p.id === id);
}

export function completedCount(p: DemoProject): number {
  return Object.values(p.toolStatus).filter((s) => s === "done").length;
}
