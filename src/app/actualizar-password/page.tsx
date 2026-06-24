import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default function ActualizarPasswordPage() {
  return (
    <AuthShell
      title="Crea tu contraseña nueva"
      subtitle="Elige una contraseña segura para tu cuenta."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
