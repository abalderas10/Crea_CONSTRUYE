"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function currentEnabled(
  projectId: string,
): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; ids: string[] } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("projects")
    .select("enabled_modules")
    .eq("id", projectId)
    .maybeSingle();
  const ids = Array.isArray(data?.enabled_modules)
    ? (data!.enabled_modules as string[])
    : [];
  return { supabase, ids };
}

/** Enchufa una herramienta de comunidad a la proforma del proyecto. */
export async function addModule(
  projectId: string,
  moduleId: string,
): Promise<{ error: string } | { ok: true }> {
  const ctx = await currentEnabled(projectId);
  if (!ctx) return { error: "Sesión expirada." };
  if (ctx.ids.includes(moduleId)) return { ok: true };

  const { error } = await ctx.supabase
    .from("projects")
    .update({ enabled_modules: [...ctx.ids, moduleId] })
    .eq("id", projectId);

  if (error) return { error: "No se pudo agregar." };
  revalidatePath(`/app/${projectId}/composicion`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Quita una herramienta de comunidad de la proforma. */
export async function removeModule(
  projectId: string,
  moduleId: string,
): Promise<{ error: string } | { ok: true }> {
  const ctx = await currentEnabled(projectId);
  if (!ctx) return { error: "Sesión expirada." };

  const { error } = await ctx.supabase
    .from("projects")
    .update({ enabled_modules: ctx.ids.filter((id) => id !== moduleId) })
    .eq("id", projectId);

  if (error) return { error: "No se pudo quitar." };
  revalidatePath(`/app/${projectId}/composicion`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}
