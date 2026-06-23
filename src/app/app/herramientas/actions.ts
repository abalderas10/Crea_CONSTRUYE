"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ToolSection } from "@/lib/community/sections";

const SECTIONS: ToolSection[] = [
  "arquitectura",
  "construccion",
  "normatividad",
  "mantenimiento",
  "otro",
];

export type CreateToolState =
  | { error: string }
  | { ok: true; id: string }
  | null;

/** Crea una propuesta de herramienta del usuario actual. */
export async function createToolProposal(
  _prev: CreateToolState,
  formData: FormData,
): Promise<CreateToolState> {
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const name = s("name");
  const description = s("description");
  if (!name) return { error: "El nombre es obligatorio." };
  if (!description) return { error: "La descripción es obligatoria." };

  const sectionRaw = s("section") as ToolSection;
  const section = SECTIONS.includes(sectionRaw) ? sectionRaw : "construccion";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const expert_validated = s("expert_validated") === "on";

  const { data, error } = await supabase
    .from("tool_proposals")
    .insert({
      author_id: user.id,
      name,
      description,
      formulas: s("formulas") || null,
      justification: s("justification") || null,
      section,
      status: "proposed",
      expert_validated,
      expert_name: expert_validated ? s("expert_name") || null : null,
      expert_field: expert_validated ? s("expert_field") || null : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "No se pudo guardar la propuesta. Intenta de nuevo." };
  }

  revalidatePath("/app/herramientas");
  revalidatePath("/app/herramientas/pendientes");
  return { ok: true, id: data.id };
}

/** Genera (o regenera) la sugerencia AI de implementación para una propuesta. */
export async function generateToolSuggestion(
  proposalId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const { data: proposal } = await supabase
    .from("tool_proposals")
    .select("name, description, formulas, justification, section")
    .eq("id", proposalId)
    .maybeSingle();

  if (!proposal) return { error: "No se encontró la propuesta." };

  try {
    const { suggestToolImplementation } = await import(
      "@/lib/ai/tool-suggestion"
    );
    const suggestion = await suggestToolImplementation(proposal);

    const { error } = await supabase
      .from("tool_proposals")
      .update({
        ai_suggestion: suggestion as unknown as import("@/lib/supabase/database.types").Json,
        feeds_tools: suggestion.alimenta ?? [],
      })
      .eq("id", proposalId);

    if (error) return { error: "No se pudo guardar la sugerencia." };
  } catch {
    return { error: "La sugerencia de Claude falló. Intenta de nuevo." };
  }

  revalidatePath("/app/herramientas/pendientes");
  revalidatePath(`/app/herramientas/${proposalId}`);
  return { ok: true };
}

/** Borra una propuesta propia. */
export async function deleteProposal(
  proposalId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const { error } = await supabase
    .from("tool_proposals")
    .delete()
    .eq("id", proposalId);

  if (error) return { error: "No se pudo borrar." };
  revalidatePath("/app/herramientas/pendientes");
  return { ok: true };
}
