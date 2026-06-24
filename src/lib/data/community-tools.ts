import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ToolSection, ToolProposalStatus } from "@/lib/community/sections";

// La tabla tool_proposals aún no está en database.types.ts (MCP de
// Supabase desconectado). Tipamos la fila a mano hasta regenerar tipos.
export interface ToolProposal {
  id: string;
  author_id: string;
  name: string;
  description: string;
  formulas: string | null;
  justification: string | null;
  section: ToolSection;
  status: ToolProposalStatus;
  review_notes: string | null;
  expert_validated: boolean;
  expert_name: string | null;
  expert_field: string | null;
  ai_suggestion: AiSuggestion | null;
  feeds_tools: string[];
  normatividad: { entidad?: string; doc?: string }[];
  created_at: string;
  updated_at: string;
}

export interface AiSuggestion {
  resumen: string;
  pasos: string[];
  formulas_clave: string[];
  datos_necesarios: string[];
  alimenta: string[];
  complejidad: "baja" | "media" | "alta";
}

/** Propuestas del usuario actual (RLS limita a las suyas). */
export async function listMyProposals(): Promise<ToolProposal[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_proposals")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as ToolProposal[] | null) ?? [];
}

/** Herramientas publicadas (catálogo de comunidad). */
export async function listPublishedTools(): Promise<ToolProposal[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_proposals")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return (data as ToolProposal[] | null) ?? [];
}

/** Una propuesta por id (RLS la limita al autor o si está publicada). */
export async function getProposal(id: string): Promise<ToolProposal | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_proposals")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as ToolProposal | null) ?? null;
}

export interface ToolComment {
  id: string;
  proposal_id: string;
  author_id: string;
  author_name: string;
  author_area: string | null;
  body: string;
  created_at: string;
}

/** Comentarios de una propuesta (orden cronológico). */
export async function listComments(proposalId: string): Promise<ToolComment[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_comments")
    .select("*")
    .eq("proposal_id", proposalId)
    .order("created_at", { ascending: true });
  return (data as ToolComment[] | null) ?? [];
}
