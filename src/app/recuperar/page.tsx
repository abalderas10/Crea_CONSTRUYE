import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetRequestForm } from "@/components/auth/ResetRequestForm";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <AuthShell
      title="¿Olvidaste tu contraseña?"
      subtitle="Te enviamos un enlace para crear una nueva."
      footer={
        <>
          ¿Ya la recordaste?{" "}
          <Link href="/login" className="font-semibold text-volt hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <ResetRequestForm />
    </AuthShell>
  );
}
