import { listAllProposals } from "@/lib/data/admin";
import { AdminProposalRow } from "@/components/admin/AdminProposalRow";
import { STATUS_META, type ToolProposalStatus } from "@/lib/community/sections";

const ORDER: ToolProposalStatus[] = [
  "proposed",
  "in_review",
  "approved",
  "published",
  "rejected",
];

export default async function AdminHerramientasPage() {
  const proposals = await listAllProposals();

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
        Validación
      </p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
        Herramientas de la comunidad
      </h1>
      <p className="mt-1 text-sm text-muted">
        Analiza, ajusta y autoriza. Al publicar, la herramienta aparece en el
        catálogo.
      </p>

      {proposals.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-raised/40 px-8 py-16 text-center text-sm text-muted">
          Aún no hay propuestas de la comunidad.
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {ORDER.map((status) => {
            const group = proposals.filter((p) => p.status === status);
            if (group.length === 0) return null;
            return (
              <section key={status}>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: STATUS_META[status].color }}
                  />
                  <h2 className="text-[12px] font-bold uppercase tracking-wide text-muted">
                    {STATUS_META[status].label}
                  </h2>
                  <span className="tabular text-[11px] font-bold text-faint">
                    {group.length}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {group.map((p) => (
                    <AdminProposalRow key={p.id} proposal={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
