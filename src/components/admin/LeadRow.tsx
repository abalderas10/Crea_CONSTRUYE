"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLeadHandled } from "@/app/app/admin/actions";
import { SERVICE_LABEL, SERVICIOS } from "@/lib/constructiva/servicios";
import type { Lead } from "@/lib/data/admin";

export function LeadRow({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const catName =
    SERVICIOS.find((s) => s.id === lead.category)?.name ?? lead.category;

  function toggle() {
    start(async () => {
      await setLeadHandled(lead.id, !lead.handled);
      router.refresh();
    });
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        lead.handled ? "border-line bg-raised/50 opacity-70" : "border-line bg-raised"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-[var(--color-violet)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-sub">
              {SERVICE_LABEL[lead.service]}
            </span>
            {catName && (
              <span className="text-[11px] font-semibold text-muted">{catName}</span>
            )}
          </div>
          <h3 className="mt-2 text-[14px] font-bold text-ink">{lead.name}</h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-muted">
            <a href={`mailto:${lead.email}`} className="hover:text-ink">
              {lead.email}
            </a>
            {lead.phone && <span>· {lead.phone}</span>}
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={pending}
          className={`shrink-0 rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50 ${
            lead.handled
              ? "border border-line text-muted hover:bg-hover"
              : "bg-volt text-on-volt hover:bg-volt-sub"
          }`}
        >
          {pending ? "…" : lead.handled ? "Reabrir" : "Marcar atendido"}
        </button>
      </div>

      {lead.message && (
        <p className="mt-3 rounded-lg border border-line bg-base/50 p-3 text-[12.5px] leading-relaxed text-muted">
          {lead.message}
        </p>
      )}

      <div className="mt-3 text-[11px] text-faint">
        {new Date(lead.created_at).toLocaleString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
