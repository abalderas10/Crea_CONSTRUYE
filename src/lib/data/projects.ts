import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import type { ToolId } from "@/lib/tools";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ToolStatus = Database["public"]["Enums"]["tool_status"];
export type ToolStatusMap = Record<ToolId, ToolStatus>;

const EMPTY_STATUS: ToolStatusMap = {
  terreno: "empty",
  zonificacion: "empty",
  mercado: "empty",
  costos: "empty",
  financiero: "empty",
  roi: "empty",
  cronograma: "empty",
  riesgos: "empty",
};

/** Lista los proyectos del usuario (RLS limita a los propios). */
export async function listProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Un proyecto por id (o null si no existe / no es del usuario). */
export async function getProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Mapa de estado por herramienta para un proyecto. */
export async function getToolStatuses(
  projectId: string,
): Promise<ToolStatusMap> {
  const map: ToolStatusMap = { ...EMPTY_STATUS };
  if (!isSupabaseConfigured) return map;
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_tool_data")
    .select("tool_id, status")
    .eq("project_id", projectId);
  for (const row of data ?? []) {
    map[row.tool_id as ToolId] = row.status;
  }
  return map;
}

export type ToolData =
  Database["public"]["Tables"]["project_tool_data"]["Row"];

/** Fila de datos de una herramienta (o null si aún no existe). */
export async function getToolData(
  projectId: string,
  toolId: ToolId,
): Promise<ToolData | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_tool_data")
    .select("*")
    .eq("project_id", projectId)
    .eq("tool_id", toolId)
    .maybeSingle();
  return data;
}

export function completedCount(statuses: ToolStatusMap): number {
  return Object.values(statuses).filter((s) => s === "done").length;
}
