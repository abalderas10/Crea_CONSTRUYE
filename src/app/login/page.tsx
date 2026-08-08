import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthFormWithSuspense } from "@/components/auth/AuthFormWithSuspense";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Bienvenido de vuelta"
      subtitle="Entra para continuar con tus proformas."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-volt hover:underline">
            Crea una gratis
          </Link>
        </>
      }
    >
      <AuthFormWithSuspense mode="login" />
    </AuthShell>
  );
}
