"use server";

import { createClient } from "@/lib/supabase/server";
import type { ServiceType } from "@/lib/constructiva/servicios";

const SERVICES: ServiceType[] = ["construccion", "mantenimiento"];

export type LeadState = { error: string } | { ok: true } | null;

/** Guarda una solicitud (lead) desde la landing de Constructiva. */
export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const name = s("name");
  const email = s("email");
  if (!name) return { error: "Tu nombre es obligatorio." };
  if (!email || !email.includes("@")) {
    return { error: "Necesitamos un correo válido para contactarte." };
  }

  const serviceRaw = s("service") as ServiceType;
  const service = SERVICES.includes(serviceRaw) ? serviceRaw : "construccion";

  const supabase = await createClient();
  const { error } = await supabase.from("constructiva_leads").insert({
    service,
    name,
    email,
    phone: s("phone") || null,
    category: s("category") || null,
    message: s("message") || null,
    source: "landing",
  });

  if (error) {
    return { error: "No se pudo enviar. Intenta de nuevo o escríbenos directo." };
  }
  return { ok: true };
}
