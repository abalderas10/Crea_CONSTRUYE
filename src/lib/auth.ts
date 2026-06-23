import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AppUser = {
  email: string;
  name: string;
  initials: string;
  demo: boolean;
  isAdmin: boolean;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "")
  ).toUpperCase();
}

/**
 * Usuario actual. En modo UI-only (sin Supabase configurado) devuelve un
 * usuario demo para poder navegar el shell sin backend.
 */
export async function getCurrentUser(): Promise<AppUser> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const name =
        (user.user_metadata?.full_name as string | undefined) ||
        user.email!.split("@")[0];
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      return {
        email: user.email!,
        name,
        initials: initialsOf(name),
        demo: false,
        isAdmin: profile?.is_admin ?? false,
      };
    }
  }
  return {
    email: "demo@creaconstruye.com",
    name: "Invitado Demo",
    initials: "ID",
    demo: true,
    isAdmin: false,
  };
}
