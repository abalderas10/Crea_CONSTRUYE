"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProposalStatus } from "@/app/app/admin/actions";
import { getSection, STATUS_META, type ToolProposalStatus } from "@/lib/community/sections";
import { rigorLevel, RIGOR_META } from "@/lib/community/rigor";
import type { ToolProposal } from "@/lib/data/community-tools";

const FLOW: ToolProposalStatus[] = [
  "proposed",
  "in_review",
  "approved",
  "published",
  "rejected",
];

export function AdminProposalRow({ proposal }: { proposal: ToolProposal }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState(proposal.review_notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const section = getSection(proposal.section);
  const nivel = rigorLevel({
    referencias: proposal.referencias,
    avalesCount: proposal.avales_count,
    casoPrueba: proposal.caso_prueba,
    status: proposal.status,
  });

  function changeStatus(status: ToolProposalStatus) {
    setError(null);
    start(async () => {
      const r = await setProposalStatus(proposal.id, status, notes);
      if ("error" in r) setError(r.error);
      else router.refresh();
    });
  }

  function saveNotes() {
    changeStatus(proposal.status);
  }

  return (
    <div className="rounded-xl border border-line bg-raised p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-[14px] font-extrabold"
            style={{ background: `${section.color}18`, color: section.color }}
          >
            {proposal.name.charAt(0)}
          </span>
          <div>
            <h3 className="text-[14px] font-bold leading-tight text-ink">
              {proposal.name}
            </h3>
            <span className="text-[11px] text-faint">
              {section.name} · {RIGOR_META[nivel].label}
              {proposal.avales_count > 0 && ` · ${proposal.avales_count} aval(es)`}
            </span>
          </div>
        </div>
        <span
          className="shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{
            background: `${STATUS_META[proposal.status].color}1f`,
            color: STATUS_META[proposal.status].color,
          }}
        >
          {STATUS_META[proposal.status].label}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
        {proposal.description}
      </p>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-[11px] font-semibold text-muted hover:text-ink"
      >
        {open ? "Ocultar gestión" : "Gestionar →"}
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-line pt-3">
          {/* Cambiar estado */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-faint">
              Mover a
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {FLOW.map((s) => (
                <button
                  key={s}
                  disabled={pending || s === proposal.status}
                  onClick={() => changeStatus(s)}
                  className="rounded-full border px-3 py-1 text-[11px] font-bold transition-colors disabled:opacity-40"
                  style={{
                    borderColor: `${STATUS_META[s].color}55`,
                    color: STATUS_META[s].color,
                  }}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Notas de revisión */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-faint">
              Notas de revisión
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ajustes acordados, motivo de rechazo…"
              className="mt-1.5 w-full rounded-md border border-line bg-base px-3 py-2 text-[12px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
            />
            <button
              onClick={saveNotes}
              disabled={pending}
              className="mt-2 rounded-md border border-line px-3 py-1.5 text-[11px] font-bold text-muted hover:bg-hover disabled:opacity-50"
            >
              {pending ? "Guardando…" : "Guardar notas"}
            </button>
          </div>

          {error && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-[12px] text-danger">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
