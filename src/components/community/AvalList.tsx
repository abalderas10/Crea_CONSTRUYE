"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAval } from "@/app/app/herramientas/actions";
import type { ToolAval } from "@/lib/data/community-tools";

const RNP_URL = "https://www.cedulaprofesional.sep.gob.mx/cedula/";

export function AvalList({
  avales,
  proposalId,
  currentUserId,
  isAdmin,
}: {
  avales: ToolAval[];
  proposalId: string;
  currentUserId: string | null;
  isAdmin: boolean;
}) {
  if (avales.length === 0) {
    return (
      <p className="text-[13px] text-faint">
        Aún sin avales de expertos. Si eres profesional del área, firma el tuyo.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {avales.map((a) => (
        <AvalCard
          key={a.id}
          aval={a}
          proposalId={proposalId}
          canDelete={isAdmin || a.author_id === currentUserId}
        />
      ))}
    </div>
  );
}

function AvalCard({
  aval,
  proposalId,
  canDelete,
}: {
  aval: ToolAval;
  proposalId: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("¿Retirar este aval?")) return;
    setBusy(true);
    const r = await deleteAval(aval.id, proposalId);
    setBusy(false);
    if (!("error" in r)) router.refresh();
  }

  return (
    <div className="rounded-xl border border-volt/30 bg-volt/[0.06] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-volt/15 text-volt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-ink">{aval.nombre}</span>
              {aval.verificado && (
                <span className="rounded-sm bg-volt/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-volt">
                  Verificado
                </span>
              )}
            </div>
            <span className="text-[12px] text-muted">
              {aval.profesion}
              {aval.area && ` · ${aval.area}`}
              {aval.institucion && ` · ${aval.institucion}`}
            </span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            disabled={busy}
            className="text-[11px] text-faint hover:text-danger disabled:opacity-50"
          >
            Retirar
          </button>
        )}
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        “{aval.declaracion}”
      </p>

      <div className="mt-3 flex items-center gap-2 text-[11px]">
        <span className="rounded-sm bg-base px-2 py-0.5 font-mono font-semibold text-muted">
          Cédula {aval.cedula}
        </span>
        <a
          href={RNP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-volt hover:underline"
        >
          Verificar en el RNP ↗
        </a>
      </div>
    </div>
  );
}
