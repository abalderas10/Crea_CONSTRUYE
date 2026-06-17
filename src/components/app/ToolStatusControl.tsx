"use client";

import { useTransition } from "react";
import { setToolStatus } from "@/app/app/actions";
import type { ToolStatus } from "@/lib/data/projects";

const OPTIONS: { value: ToolStatus; label: string; color: string }[] = [
  { value: "empty", label: "Pendiente", color: "var(--color-faint)" },
  { value: "in_progress", label: "En proceso", color: "var(--color-violet)" },
  { value: "done", label: "Completado", color: "var(--color-success)" },
];

export function ToolStatusControl({
  projectId,
  toolId,
  current,
}: {
  projectId: string;
  toolId: string;
  current: ToolStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-raised p-1">
      {OPTIONS.map((o) => {
        const active = o.value === current;
        return (
          <button
            key={o.value}
            disabled={pending}
            onClick={() =>
              startTransition(() => setToolStatus(projectId, toolId, o.value))
            }
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-60"
            style={{
              background: active ? `${o.color}1f` : "transparent",
              color: active ? o.color : "var(--color-muted)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
