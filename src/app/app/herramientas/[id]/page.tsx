import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProposal, listComments } from "@/lib/data/community-tools";
import { checkIsAdmin } from "@/lib/admin";
import { getSection, STATUS_META } from "@/lib/community/sections";
import { Discussion } from "@/components/community/Discussion";

export default async function HerramientaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: auth }, proposal, comments, isAdmin] = await Promise.all([
    supabase.auth.getUser(),
    getProposal(id),
    listComments(id),
    checkIsAdmin(),
  ]);

  if (!proposal) notFound();

  const user = auth.user;
  const section = getSection(proposal.section);
  const status = STATUS_META[proposal.status];
  const sug = proposal.ai_suggestion;

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <Link
          href="/app/herramientas"
          className="text-[12px] font-semibold text-muted hover:text-ink"
        >
          ← Catálogo de herramientas
        </Link>

        {/* Cabecera */}
        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-xl text-[18px] font-extrabold"
              style={{ background: `${section.color}18`, color: section.color }}
            >
              {proposal.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-ink">
                {proposal.name}
              </h1>
              <span className="text-[12px] text-faint">{section.name}</span>
            </div>
          </div>
          <span
            className="shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ background: `${status.color}1f`, color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {proposal.expert_validated && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-violet/12 px-2 py-1 text-[10px] font-bold text-violet-sub">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Validada por {proposal.expert_name || "experto"}
            {proposal.expert_field && ` · ${proposal.expert_field}`}
          </div>
        )}

        {/* Descripción */}
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          {proposal.description}
        </p>

        {proposal.formulas && (
          <div className="mt-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-faint">
              Fórmulas / elementos a calcular
            </h2>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-raised p-4 font-mono text-[12.5px] leading-relaxed text-ink">
              {proposal.formulas}
            </pre>
          </div>
        )}

        {proposal.justification && (
          <div className="mt-5">
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-faint">
              Por qué aporta
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {proposal.justification}
            </p>
          </div>
        )}

        {/* Sugerencia del agente */}
        {sug && (
          <div className="mt-6 rounded-xl border border-violet/30 bg-violet/8 p-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-sub">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
              </svg>
              Plan sugerido por el agente
            </span>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
              {sug.resumen}
            </p>
            {sug.alimenta?.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wide text-faint">
                  Alimenta
                </span>
                {sug.alimenta.map((a) => (
                  <span
                    key={a}
                    className="rounded-sm border border-line bg-base px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discusión */}
        <div className="mt-10 border-t border-line pt-8">
          <Discussion
            proposalId={proposal.id}
            comments={comments}
            currentUserId={user?.id ?? null}
            canComment={!!user}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
