import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ToolProposal } from "@/lib/data/community-tools";
import type { Database } from "@/lib/supabase/database.types";

export type Lead = Database["public"]["Tables"]["constructiva_leads"]["Row"];
export type Interest = Database["public"]["Tables"]["interest_signups"]["Row"];

/** Todas las propuestas (RLS admin). */
export async function listAllProposals(): Promise<ToolProposal[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_proposals")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as ToolProposal[] | null) ?? [];
}

/** Todos los leads de Constructiva (RLS admin). */
export async function listLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("constructiva_leads")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Lead[] | null) ?? [];
}

/** Registros de interés en la plataforma (RLS admin). */
export async function listInterest(): Promise<Interest[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("interest_signups")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Interest[] | null) ?? [];
}
