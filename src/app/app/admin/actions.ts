"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/admin";
import type { ToolProposalStatus } from "@/lib/community/sections";

const STATUSES: ToolProposalStatus[] = [
  "proposed",
  "in_review",
  "approved",
  "published",
  "rejected",
];

/** Cambia el estado de una propuesta (admin). */
export async function setProposalStatus(
  proposalId: string,
  status: ToolProposalStatus,
  reviewNotes?: string,
): Promise<{ error: string } | { ok: true }> {
  if (!(await checkIsAdmin())) return { error: "No autorizado." };
  if (!STATUSES.includes(status)) return { error: "Estado inválido." };

  const supabase = await createClient();
  const patch: { status: ToolProposalStatus; review_notes?: string } = {
    status,
  };
  if (reviewNotes !== undefined) patch.review_notes = reviewNotes.trim() || "";

  const { error } = await supabase
    .from("tool_proposals")
    .update(patch)
    .eq("id", proposalId);

  if (error) return { error: "No se pudo actualizar." };
  revalidatePath("/app/admin/herramientas");
  revalidatePath("/app/admin");
  revalidatePath("/app/herramientas");
  return { ok: true };
}

/** Marca un lead como atendido / no atendido (admin). */
export async function setLeadHandled(
  leadId: string,
  handled: boolean,
): Promise<{ error: string } | { ok: true }> {
  if (!(await checkIsAdmin())) return { error: "No autorizado." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("constructiva_leads")
    .update({ handled })
    .eq("id", leadId);

  if (error) return { error: "No se pudo actualizar." };
  revalidatePath("/app/admin/leads");
  revalidatePath("/app/admin");
  return { ok: true };
}
