import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { Cta } from "@/components/ui";
import { listProjects } from "@/lib/data/projects";

export default async function ProjectsIndexPage() {
  const [user, projects] = await Promise.all([getCurrentUser(), listProjects()]);

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Tus proyectos
            </h1>
            <p className="mt-1 text-sm text-muted">
              {projects.length > 0
                ? "Selecciona un proyecto o crea uno nuevo."
                : "Aún no tienes proyectos."}
            </p>
          </div>
          {projects.length > 0 && (
            <Cta href="/app/nuevo">+ Nuevo proyecto</Cta>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/app/${p.id}`}
                className="group rounded-xl border border-line bg-raised p-5 transition-colors hover:border-faint"
              >
                <h3 className="font-bold text-ink">{p.name}</h3>
                <p className="mt-1 text-[13px] text-muted">
                  {p.municipio || "Sin ubicación"}
                </p>
                {p.tipo && (
                  <p className="mt-0.5 text-[12px] text-faint">{p.tipo}</p>
                )}
                <span className="mt-4 inline-block text-[12px] font-semibold text-volt opacity-0 transition-opacity group-hover:opacity-100">
                  Abrir →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-line bg-raised/40 px-8 py-16 text-center">
      <h2 className="text-lg font-bold text-ink">
        Evalúa tu primer terreno
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Crea un proyecto, agrega el terreno y deja que las 8 herramientas
        construyan tu proforma.
      </p>
      <div className="mt-6 flex justify-center">
        <Cta href="/app/nuevo" size="lg">
          + Crear mi primer proyecto
        </Cta>
      </div>
    </div>
  );
}
