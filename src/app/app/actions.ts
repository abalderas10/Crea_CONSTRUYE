"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type ToolStatus = Database["public"]["Enums"]["tool_status"];
const TOOL_IDS = [
  "terreno",
  "zonificacion",
  "mercado",
  "costos",
  "financiero",
  "roi",
  "cronograma",
  "riesgos",
] as const;

export type ProjectFormState = { error: string } | null;

/** Crea un proyecto del usuario actual y redirige a su dashboard. */
export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const municipio = String(formData.get("municipio") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();

  if (!name) return { error: "El nombre del proyecto es obligatorio." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name,
      municipio: municipio || null,
      tipo: tipo || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "No se pudo crear el proyecto. Intenta de nuevo." };
  }

  revalidatePath("/app");
  redirect(`/app/${data.id}`);
}

/** Actualiza el estado de una herramienta (upsert por project+tool). */
export async function setToolStatus(
  projectId: string,
  toolId: string,
  status: ToolStatus,
): Promise<void> {
  if (!TOOL_IDS.includes(toolId as (typeof TOOL_IDS)[number])) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("project_tool_data")
    .upsert(
      { project_id: projectId, tool_id: toolId, status },
      { onConflict: "project_id,tool_id" },
    );

  revalidatePath(`/app/${projectId}`);
  revalidatePath(`/app/${projectId}/${toolId}`);
}
