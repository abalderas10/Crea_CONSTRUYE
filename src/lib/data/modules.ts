import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ToolProposal } from "@/lib/data/community-tools";

/** Ids de módulos de comunidad activos en un proyecto. */
export async function getEnabledModuleIds(projectId: string): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("enabled_modules")
    .eq("id", projectId)
    .maybeSingle();
  const raw = data?.enabled_modules;
  return Array.isArray(raw) ? (raw as string[]) : [];
}

export interface ProjectModules {
  enabled: ToolProposal[];
  available: ToolProposal[];
}

/** Módulos de comunidad activos + publicadas disponibles para enchufar. */
export async function getProjectModules(
  projectId: string,
): Promise<ProjectModules> {
  if (!isSupabaseConfigured) return { enabled: [], available: [] };
  const supabase = await createClient();

  const [{ data: proj }, { data: published }] = await Promise.all([
    supabase
      .from("projects")
      .select("enabled_modules")
      .eq("id", projectId)
      .maybeSingle(),
    supabase
      .from("tool_proposals")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
  ]);

  const enabledIds = new Set(
    Array.isArray(proj?.enabled_modules) ? (proj!.enabled_modules as string[]) : [],
  );
  const all = (published as ToolProposal[] | null) ?? [];

  return {
    enabled: all.filter((t) => enabledIds.has(t.id)),
    available: all.filter((t) => !enabledIds.has(t.id)),
  };
}
