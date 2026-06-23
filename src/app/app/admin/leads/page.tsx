import { listLeads } from "@/lib/data/admin";
import { LeadRow } from "@/components/admin/LeadRow";

export default async function AdminLeadsPage() {
  const leads = await listLeads();
  const pendientes = leads.filter((l) => !l.handled);
  const atendidos = leads.filter((l) => l.handled);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
        Constructiva
      </p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
        Bandeja de solicitudes
      </h1>
      <p className="mt-1 text-sm text-muted">
        Leads de construcción y mantenimiento desde la landing de Constructiva.
      </p>

      {leads.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-raised/40 px-8 py-16 text-center text-sm text-muted">
          Aún no hay solicitudes.
        </div>
      ) : (
        <>
          {pendientes.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[12px] font-bold uppercase tracking-wide text-volt">
                Por atender · {pendientes.length}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {pendientes.map((l) => (
                  <LeadRow key={l.id} lead={l} />
                ))}
              </div>
            </section>
          )}

          {atendidos.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[12px] font-bold uppercase tracking-wide text-faint">
                Atendidos · {atendidos.length}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {atendidos.map((l) => (
                  <LeadRow key={l.id} lead={l} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
