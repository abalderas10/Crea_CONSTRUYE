"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setInterestHandled } from "@/app/app/admin/actions";
import type { Interest } from "@/lib/data/admin";

export function InterestRow({ item }: { item: Interest }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      await setInterestHandled(item.id, !item.handled);
      router.refresh();
    });
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        item.handled ? "border-line bg-raised/50 opacity-70" : "border-line bg-raised"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-bold text-ink">{item.name}</h3>
            {item.role && (
              <span className="rounded-sm bg-violet/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-sub">
                {item.role}
              </span>
            )}
            {item.city && (
              <span className="text-[11px] text-faint">· {item.city}</span>
            )}
          </div>
          <a href={`mailto:${item.email}`} className="mt-0.5 block text-[12px] text-muted hover:text-ink">
            {item.email}
          </a>
        </div>
        <button
          onClick={toggle}
          disabled={pending}
          className={`shrink-0 rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50 ${
            item.handled
              ? "border border-line text-muted hover:bg-hover"
              : "bg-volt text-on-volt hover:bg-volt-sub"
          }`}
        >
          {pending ? "…" : item.handled ? "Reabrir" : "Marcar atendido"}
        </button>
      </div>

      {item.message && (
        <p className="mt-3 rounded-lg border border-line bg-base/50 p-3 text-[12.5px] leading-relaxed text-muted">
          {item.message}
        </p>
      )}

      <div className="mt-3 text-[11px] text-faint">
        {new Date(item.created_at).toLocaleString("es-MX", {
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
