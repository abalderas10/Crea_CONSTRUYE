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

/** Guarda los datos de Localización (Terreno) en project_tool_data.data. */
export async function saveTerrenoData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    entidad: {
      tipo: s("entidad_tipo") || "cdmx",
      estado: s("entidad_estado") || undefined,
      documento: s("entidad_documento") || undefined,
    },
    predio: {
      territorio: s("territorio"),
      cuenta_catastral: s("cuenta_catastral"),
      direccion: s("direccion"),
      colonia: s("colonia"),
      superficie_terreno: s("superficie_terreno"),
      superficie_construccion: s("superficie_construccion"),
      valor_catastral: s("valor_catastral"),
      precio_solicitado: s("precio_solicitado"),
      tipo_desarrollo: s("tipo_desarrollo"),
    },
    zonificacion: {
      zona_codigo: s("zona_codigo"),
      uso_permitido: s("uso_permitido"),
      cos: s("cos"),
      cus: s("cus"),
      niveles_max: s("niveles_max"),
      area_libre_pct: s("area_libre_pct"),
    },
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "terreno",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/terreno`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Genera el análisis de Claude para Terreno y lo persiste. */
export async function generateTerrenoAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const [{ data: tool }, { data: project }] = await Promise.all([
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "terreno")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("name, municipio, tipo, context_summary")
      .eq("id", projectId)
      .maybeSingle(),
  ]);

  const data = tool?.data as import("@/lib/proforma/terreno").TerrenoData | null;
  if (!data?.predio?.direccion) {
    return { error: "Primero guarda los datos del terreno." };
  }

  const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  try {
    const { analyzeTerreno } = await import("@/lib/ai/terreno");
    const analysis = await analyzeTerreno(data, context);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "terreno",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() },
      },
      { onConflict: "project_id,tool_id" },
    );
    if (error) return { error: "No se pudo guardar el análisis." };
  } catch {
    return { error: "El análisis de Claude falló. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/terreno`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
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
