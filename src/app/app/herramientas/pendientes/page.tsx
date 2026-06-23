import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { ProposalCard } from "@/components/community/ProposalCard";
import { CreateToolButton } from "@/components/community/CreateToolForm";
import { listMyProposals } from "@/lib/data/community-tools";

export const metadata: Metadata = { title: "Mis propuestas" };

export default async function PendientesPage() {
  const [user, proposals] = await Promise.all([
    getCurrentUser(),
    listMyProposals(),
  ]);

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <Link
          href="/app/herramientas"
          className="text-[12px] font-semibold text-muted hover:text-ink"
        >
          ← Catálogo
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              Tablero de herramientas por crear
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
              Mis propuestas
            </h1>
            <p className="mt-1 text-sm text-muted">
              {proposals.length > 0
                ? "El agente sugiere cómo construir cada una. Nosotros revisamos, ajustamos y autorizamos para publicar."
                : "Aún no has propuesto herramientas."}
            </p>
          </div>
          <CreateToolButton />
        </div>

        {proposals.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-raised/40 px-8 py-16 text-center">
            <h2 className="text-lg font-bold text-ink">
              ¿Qué herramienta falta?
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Desde un COS/CUS de otro estado hasta un cálculo estructural.
              Propónla y el agente te ayuda a construirla para la comunidad.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {proposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
