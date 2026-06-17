import { Container, Eyebrow } from "@/components/ui";
import { TOOLS } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";

export function Herramientas() {
  return (
    <section
      id="herramientas"
      className="scroll-mt-20 border-y border-line bg-surface/40 py-20 sm:py-28"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Las 8 herramientas</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Un estudio de factibilidad completo, modular.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Cada herramienta resuelve una etapa del proforma y alimenta a la
            siguiente. La 8 reúne todo en una decisión final.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => {
            const Icon = TOOL_ICONS[t.id];
            return (
              <div
                key={t.id}
                className="group rounded-xl border border-line bg-raised p-5 transition-colors hover:border-faint"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-md transition-colors"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="tabular text-[11px] font-bold text-faint">
                    {String(t.num).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-ink">{t.name}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {t.tagline}
                </p>
                <p className="mt-3 border-t border-line pt-3 text-[11px] text-faint">
                  <span className="font-semibold text-muted">Produce:</span>{" "}
                  {t.produces}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
