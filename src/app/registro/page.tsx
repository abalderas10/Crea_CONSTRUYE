import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <AuthShell
      title="Evalúa tu primer terreno gratis"
      subtitle="Crea tu cuenta — sin tarjeta de crédito."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-volt hover:underline">
            Entra aquí
          </Link>
        </>
      }
    >
      <AuthForm mode="registro" />
    </AuthShell>
  );
}
