import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { NewProjectForm } from "@/components/app/NewProjectForm";

export const metadata: Metadata = { title: "Nuevo proyecto" };

export default async function NuevoProyectoPage() {
  const user = await getCurrentUser();

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-md px-6 py-12">
        <Link
          href="/app"
          className="text-xs text-faint transition-colors hover:text-muted"
        >
          ← Tus proyectos
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
          Nuevo proyecto
        </h1>
        <p className="mt-1 text-sm text-muted">
          Empieza con lo básico. Podrás afinar todo dentro del proyecto.
        </p>

        <div className="mt-8">
          <NewProjectForm />
        </div>
      </main>
    </>
  );
}
