import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getProposal,
  listComments,
  listAvales,
} from "@/lib/data/community-tools";
import { checkIsAdmin } from "@/lib/admin";
import { getSection, STATUS_META } from "@/lib/community/sections";
import {
  rigorLevel,
  RIGOR_META,
  REFERENCIA_TIPO_LABEL,
} from "@/lib/community/rigor";
import { RigorBadge } from "@/components/community/RigorBadge";
import { Discussion } from "@/components/community/Discussion";
import { AvalForm } from "@/components/community/AvalForm";
import { AvalList } from "@/components/community/AvalList";

export default async function HerramientaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: auth }, proposal, comments, avales, isAdmin] = await Promise.all([
    supabase.auth.getUser(),
    getProposal(id),
    listComments(id),
    listAvales(id),
    checkIsAdmin(),
  ]);

  if (!proposal) notFound();

  const user = auth.user;
  const section = getSection(proposal.section);
  const status = STATUS_META[proposal.status];
  const sug = proposal.ai_suggestion;

  const nivel = rigorLevel({
    referencias: proposal.referencias,
    avalesCount: proposal.avales_count,
    casoPrueba: proposal.caso_prueba,
    status: proposal.status,
  });
  const refs = proposal.referencias ?? [];

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

        {/* Nivel de rigor */}
        <div className="mt-5 rounded-xl border border-line bg-raised p-4">
          <div className="flex items-center gap-2">
            <RigorBadge level={nivel} size="md" />
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            {RIGOR_META[nivel].desc}
          </p>
          <RigorLadder current={nivel} />
        </div>

        {/* Descripción */}
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
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

        {/* ── Evidencia ───────────────────────────────────── */}
        <div className="mt-10 border-t border-line pt-8">
          <h2 className="text-[15px] font-extrabold tracking-tight text-ink">
            Evidencia que la respalda
          </h2>
          <p className="mt-1 text-[12.5px] text-muted">
            El nivel de rigor se calcula de esto, no de una autodeclaración.
          </p>

          {/* Fuentes */}
          <div className="mt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-faint">
              Fuentes citadas · {refs.length}
            </h3>
            {refs.length === 0 ? (
              <p className="mt-2 text-[13px] text-faint">
                Aún sin fuentes. Una herramienta sin referencias es solo un
                borrador.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {refs.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-line bg-raised p-3"
                  >
                    <span className="mt-0.5 shrink-0 rounded-sm bg-base px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                      {REFERENCIA_TIPO_LABEL[r.tipo]}
                    </span>
                    <div className="text-[13px] leading-snug">
                      <span className="font-semibold text-ink">{r.titulo}</span>
                      {(r.autor || r.detalle) && (
                        <span className="text-muted">
                          {" — "}
                          {[r.autor, r.detalle].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1.5 text-[12px] font-bold text-volt hover:underline"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Caso de prueba */}
          {proposal.caso_prueba && (
            <div className="mt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-faint">
                Caso de prueba resuelto
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-raised p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-faint">
                    Entradas
                  </span>
                  <p className="mt-1 whitespace-pre-wrap text-[13px] text-ink">
                    {proposal.caso_prueba.entradas}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-raised p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-faint">
                    Resultado esperado
                  </span>
                  <p className="mt-1 whitespace-pre-wrap text-[13px] text-ink">
                    {proposal.caso_prueba.esperado}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avales */}
          <div className="mt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-faint">
              Avales de expertos · {proposal.avales_count}
            </h3>
            <div className="mt-2">
              <AvalList
                avales={avales}
                proposalId={proposal.id}
                currentUserId={user?.id ?? null}
                isAdmin={isAdmin}
              />
            </div>
            <div className="mt-4">
              <AvalForm proposalId={proposal.id} canAval={!!user} />
            </div>
          </div>
        </div>

        {/* Sugerencia del agente */}
        {sug && (
          <div className="mt-8 rounded-xl border border-violet/30 bg-violet/8 p-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-sub">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
              </svg>
              Plan sugerido por el agente
            </span>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
              {sug.resumen}
            </p>
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

/** Escalera visual de niveles de rigor. */
function RigorLadder({ current }: { current: string }) {
  const steps = ["sustentada", "revisada", "avalada", "certificada"] as const;
  const order = ["borrador", "sustentada", "revisada", "avalada", "certificada"];
  const idx = order.indexOf(current);
  return (
    <div className="mt-3 flex items-center gap-1">
      {steps.map((s) => {
        const reached = order.indexOf(s) <= idx;
        return (
          <div key={s} className="flex-1">
            <div
              className="h-1 rounded-full"
              style={{
                background: reached ? RIGOR_META_color(s) : "var(--color-line)",
              }}
            />
            <span
              className="mt-1 block text-[9px] font-bold uppercase tracking-wide"
              style={{ color: reached ? RIGOR_META_color(s) : "var(--color-faint)" }}
            >
              {RIGOR_META[s].label.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RIGOR_META_color(level: keyof typeof RIGOR_META): string {
  return RIGOR_META[level].color;
}
