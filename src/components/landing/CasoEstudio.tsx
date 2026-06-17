import { Container, Eyebrow, Pill } from "@/components/ui";

const METRICS = [
  { label: "Terreno", value: "500 m²" },
  { label: "Producto", value: "100 uds." },
  { label: "TIR anual", value: "24.5%", accent: true },
  { label: "Inversión", value: "$142M" },
];

export function CasoEstudio() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-line bg-raised">
          <div className="grid gap-8 p-8 lg:grid-cols-[1fr_0.9fr] lg:p-12">
            <div>
              <Eyebrow>Caso de estudio · Naucalpan, Edomex</Eyebrow>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Torre de uso mixto, 100 unidades residenciales.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                Un desarrollador evaluó este terreno con creaConstruye en{" "}
                <span className="font-semibold text-ink">4 horas</span>, lo que
                antes le tomaba <span className="font-semibold text-ink">3 semanas</span>{" "}
                de Excel y un estudio de mercado externo.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-success/15 text-2xl font-black text-success">
                  ✓
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-success">GO</span>
                    <Pill color="var(--color-success)">91% confianza</Pill>
                  </div>
                  <p className="text-xs text-faint">
                    Veredicto final del panel de Riesgos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-center">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg border bg-base px-4 py-5"
                  style={{
                    borderColor: m.accent
                      ? "rgba(200,255,0,0.25)"
                      : "var(--color-line)",
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
                    {m.label}
                  </div>
                  <div
                    className="tabular mt-1 text-2xl font-black"
                    style={{ color: m.accent ? "var(--color-volt)" : "var(--color-ink)" }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
