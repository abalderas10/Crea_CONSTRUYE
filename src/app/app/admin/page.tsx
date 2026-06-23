import Link from "next/link";
import { listAllProposals, listLeads } from "@/lib/data/admin";
import { STATUS_META, type ToolProposalStatus } from "@/lib/community/sections";

export default async function AdminDashboard() {
  const [proposals, leads] = await Promise.all([
    listAllProposals(),
    listLeads(),
  ]);

  const byStatus = (s: ToolProposalStatus) =>
    proposals.filter((p) => p.status === s).length;

  const pendientesLeads = leads.filter((l) => !l.handled).length;

  return (
    <div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
          Panel
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
          Administración
        </h1>
        <p className="mt-1 text-sm text-muted">
          Valida herramientas de la comunidad y atiende solicitudes de
          Constructiva.
        </p>
      </div>

      {/* KPIs herramientas */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
            Herramientas por estado
          </h2>
          <Link
            href="/app/admin/herramientas"
            className="text-[12px] font-semibold text-volt hover:underline"
          >
            Gestionar →
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(Object.keys(STATUS_META) as ToolProposalStatus[]).map((s) => (
            <div
              key={s}
              className="rounded-xl border border-line bg-raised p-4"
            >
              <div
                className="tabular text-2xl font-extrabold"
                style={{ color: STATUS_META[s].color }}
              >
                {byStatus(s)}
              </div>
              <div className="mt-0.5 text-[12px] text-muted">
                {STATUS_META[s].label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KPIs leads */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
            Constructiva · Leads
          </h2>
          <Link
            href="/app/admin/leads"
            className="text-[12px] font-semibold text-volt hover:underline"
          >
            Ver bandeja →
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-raised p-4">
            <div className="tabular text-2xl font-extrabold text-ink">
              {leads.length}
            </div>
            <div className="mt-0.5 text-[12px] text-muted">Total</div>
          </div>
          <div className="rounded-xl border border-line bg-raised p-4">
            <div className="tabular text-2xl font-extrabold text-volt">
              {pendientesLeads}
            </div>
            <div className="mt-0.5 text-[12px] text-muted">Por atender</div>
          </div>
          <div className="rounded-xl border border-line bg-raised p-4">
            <div className="tabular text-2xl font-extrabold text-faint">
              {leads.length - pendientesLeads}
            </div>
            <div className="mt-0.5 text-[12px] text-muted">Atendidos</div>
          </div>
        </div>
      </section>
    </div>
  );
}
