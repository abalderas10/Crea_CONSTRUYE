"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ToolSection } from "@/lib/community/sections";
import type { Referencia, CasoPrueba, ReferenciaTipo } from "@/lib/community/rigor";
import type { Json } from "@/lib/supabase/database.types";

const REF_TIPOS: ReferenciaTipo[] = ["libro", "norma", "paper", "dato-oficial"];

/** Saneamiento de las referencias enviadas como JSON desde el form. */
function parseReferencias(raw: string): Referencia[] {
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((r): Referencia | null => {
        const titulo = String(r?.titulo ?? "").trim();
        const tipo = REF_TIPOS.includes(r?.tipo) ? r.tipo : "libro";
        if (!titulo) return null;
        return {
          tipo,
          titulo,
          autor: String(r?.autor ?? "").trim() || undefined,
          detalle: String(r?.detalle ?? "").trim() || undefined,
          url: String(r?.url ?? "").trim() || undefined,
        };
      })
      .filter((r): r is Referencia => r !== null)
      .slice(0, 20);
  } catch {
    return [];
  }
}

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

  const referencias = parseReferencias(s("referencias"));

  const casoEntradas = s("caso_entradas");
  const casoEsperado = s("caso_esperado");
  const caso_prueba: CasoPrueba | null =
    casoEntradas && casoEsperado
      ? { entradas: casoEntradas, esperado: casoEsperado, notas: s("caso_notas") || undefined }
      : null;

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
      referencias: referencias as unknown as Json,
      caso_prueba: caso_prueba as unknown as Json,
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

/** Agrega un comentario a la discusión de una herramienta. */
export async function addComment(
  proposalId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Escribe algo antes de enviar." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Inicia sesión para participar." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const authorName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Miembro";

  const { error } = await supabase.from("tool_comments").insert({
    proposal_id: proposalId,
    author_id: user.id,
    author_name: authorName,
    body,
  });

  if (error) return { error: "No se pudo publicar el comentario." };
  revalidatePath(`/app/herramientas/${proposalId}`);
  return { ok: true };
}

/** Borra un comentario (autor o admin, según RLS). */
export async function deleteComment(
  commentId: string,
  proposalId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const { error } = await supabase
    .from("tool_comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: "No se pudo borrar." };
  revalidatePath(`/app/herramientas/${proposalId}`);
  return { ok: true };
}

/** Avala una herramienta con credenciales profesionales (verificable en RNP). */
export async function addAval(
  proposalId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const nombre = s("nombre");
  const profesion = s("profesion");
  const cedula = s("cedula");
  const declaracion = s("declaracion");

  if (!nombre || !profesion || !cedula || !declaracion) {
    return { error: "Nombre, profesión, cédula y declaración son obligatorios." };
  }
  if (!/^\d{5,9}$/.test(cedula.replace(/\D/g, ""))) {
    return { error: "La cédula profesional debe ser numérica (5-9 dígitos)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Inicia sesión para avalar." };

  const { error } = await supabase.from("tool_avales").insert({
    proposal_id: proposalId,
    author_id: user.id,
    nombre,
    profesion,
    cedula: cedula.replace(/\D/g, ""),
    institucion: s("institucion") || null,
    area: s("area") || null,
    declaracion,
  });

  if (error) return { error: "No se pudo registrar el aval." };
  revalidatePath(`/app/herramientas/${proposalId}`);
  return { ok: true };
}

/** Borra un aval (autor o admin). */
export async function deleteAval(
  avalId: string,
  proposalId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const { error } = await supabase.from("tool_avales").delete().eq("id", avalId);
  if (error) return { error: "No se pudo borrar el aval." };
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
