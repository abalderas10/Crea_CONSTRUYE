"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addModule, removeModule } from "@/app/app/[projectId]/composicion/actions";
import { getSection } from "@/lib/community/sections";
import type { ToolProposal } from "@/lib/data/community-tools";

export function OptionalModules({
  projectId,
  enabled,
  available,
}: {
  projectId: string;
  enabled: ToolProposal[];
  available: ToolProposal[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [picker, setPicker] = useState(false);

  function add(id: string) {
    start(async () => {
      await addModule(projectId, id);
      setPicker(false);
      router.refresh();
    });
  }
  function remove(id: string) {
    start(async () => {
      await removeModule(projectId, id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold tracking-tight text-ink">
            Herramientas de comunidad
          </h2>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Enchufa, ajusta o quita módulos según este proyecto.
          </p>
        </div>
        <button
          onClick={() => setPicker((v) => !v)}
          disabled={available.length === 0}
          className="rounded-md bg-volt px-3.5 py-2 text-[12px] font-extrabold text-on-volt transition-colors hover:bg-volt-sub disabled:opacity-40"
        >
          + Agregar
        </button>
      </div>

      {/* Picker de disponibles */}
      {picker && (
        <div className="mt-3 rounded-xl border border-line bg-raised p-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-faint">
            Publicadas disponibles
          </span>
          {available.length === 0 ? (
            <p className="mt-2 text-[12.5px] text-muted">
              No hay más herramientas publicadas por ahora.
            </p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {available.map((t) => {
                const s = getSection(t.section);
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-2.5 rounded-lg border border-line bg-base p-2.5"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[12px] font-extrabold"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      {t.name.charAt(0)}
                    </span>
                    <div className="flex-1">
                      <div className="text-[12.5px] font-bold text-ink">{t.name}</div>
                      <div className="text-[11px] text-faint">{s.name}</div>
                    </div>
                    <button
                      onClick={() => add(t.id)}
                      disabled={pending}
                      className="rounded-md border border-line px-2.5 py-1 text-[11px] font-bold text-volt hover:bg-hover disabled:opacity-50"
                    >
                      Enchufar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Activas */}
      <div className="mt-3">
        {enabled.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-raised/40 px-5 py-8 text-center">
            <p className="text-[13px] text-muted">
              Esta proforma usa solo la columna vertebral.
            </p>
            <p className="mt-1 text-[12px] text-faint">
              Agrega herramientas de comunidad para extenderla.
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {enabled.map((t) => {
              const s = getSection(t.section);
              return (
                <div
                  key={t.id}
                  className="flex items-start gap-2.5 rounded-xl border border-line bg-raised p-3.5"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[13px] font-extrabold"
                    style={{ background: `${s.color}18`, color: s.color }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-ink">{t.name}</div>
                    {t.feeds_tools.length > 0 && (
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-faint">
                          Alimenta
                        </span>
                        {t.feeds_tools.map((f) => (
                          <span
                            key={f}
                            className="rounded-sm border border-line bg-base px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => remove(t.id)}
                    disabled={pending}
                    className="text-[11px] font-semibold text-faint hover:text-danger disabled:opacity-50"
                  >
                    Quitar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
