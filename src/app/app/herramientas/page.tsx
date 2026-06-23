import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { ToolCard } from "@/components/community/ToolCard";
import { CreateToolButton } from "@/components/community/CreateToolForm";
import { SECTIONS, getSection } from "@/lib/community/sections";
import { CATALOG } from "@/lib/community/catalog";
import { listPublishedTools, listMyProposals } from "@/lib/data/community-tools";

export const metadata: Metadata = { title: "Herramientas" };

export default async function HerramientasPage() {
  const [user, published, mine] = await Promise.all([
    getCurrentUser(),
    listPublishedTools(),
    listMyProposals(),
  ]);

  const pendientes = mine.filter((p) => p.status !== "published").length;

  // Catálogo combinado: semilla core + herramientas publicadas por comunidad.
  const items = [
    ...CATALOG.map((c) => ({
      key: `seed-${c.id}`,
      name: c.name,
      section: c.section,
      description: c.description,
      feeds: c.feeds,
      normatividad: c.normatividad,
      expertValidated: c.expertValidated,
      available: c.available,
    })),
    ...published.map((p) => ({
      key: `pub-${p.id}`,
      name: p.name,
      section: p.section,
      description: p.description,
      feeds: p.feeds_tools,
      normatividad: p.normatividad?.[0]?.doc,
      expertValidated: p.expert_validated,
      available: true,
    })),
  ];

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        {/* Encabezado */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              Comunidad
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
              Herramientas
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Todo lo que sirve para crear, construir y calcular. La comunidad
              las propone, los expertos las validan, y alimentan tus proformas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/app/herramientas/pendientes"
              className="relative inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-[13px] font-semibold text-muted hover:bg-hover hover:text-ink"
            >
              Mis propuestas
              {pendientes > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet px-1.5 text-[10px] font-bold text-white">
                  {pendientes}
                </span>
              )}
            </Link>
            <CreateToolButton />
          </div>
        </div>

        {/* Secciones */}
        <div className="mt-10 space-y-10">
          {SECTIONS.filter((s) => s.id !== "otro" || items.some((i) => i.section === "otro")).map(
            (section) => {
              const tools = items.filter((i) => i.section === section.id);
              if (tools.length === 0 && section.id === "otro") return null;
              return (
                <section key={section.id}>
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: section.color }}
                    />
                    <h2 className="text-[15px] font-extrabold tracking-tight text-ink">
                      {section.name}
                    </h2>
                    <span className="text-[12px] text-faint">
                      {section.tagline}
                    </span>
                    <span className="tabular ml-auto text-[11px] font-bold text-faint">
                      {tools.length}
                    </span>
                  </div>

                  {tools.length > 0 ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((t) => (
                        <ToolCard
                          key={t.key}
                          name={t.name}
                          description={t.description}
                          color={getSection(t.section).color}
                          feeds={t.feeds}
                          normatividad={t.normatividad}
                          expertValidated={t.expertValidated}
                          available={t.available}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-dashed border-line bg-raised/40 px-5 py-8 text-center">
                      <p className="text-[13px] text-muted">
                        Aún no hay herramientas en {section.name}.
                      </p>
                      <p className="mt-1 text-[12px] text-faint">
                        Propón la primera con «+ Herramienta».
                      </p>
                    </div>
                  )}
                </section>
              );
            },
          )}
        </div>
      </main>
    </>
  );
}
