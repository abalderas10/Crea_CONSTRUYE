"use server";

import { createClient } from "@/lib/supabase/server";

export type InterestState = { error: string } | { ok: true } | null;

/** Registro light: deja tu contacto si te interesa creaConstruye. */
export async function submitInterest(
  _prev: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const name = s("name");
  const email = s("email");
  if (!name) return { error: "Tu nombre es obligatorio." };
  if (!email || !email.includes("@")) {
    return { error: "Necesitamos un correo válido para contactarte." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("interest_signups").insert({
    name,
    email,
    role: s("role") || null,
    city: s("city") || null,
    message: s("message") || null,
    source: "unete",
  });

  if (error) return { error: "No se pudo registrar. Intenta de nuevo." };
  return { ok: true };
}
