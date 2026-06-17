import { Container, Eyebrow } from "@/components/ui";

const FLOW = [
  { step: "Ingresa el terreno", desc: "Dirección, superficie y precio." },
  { step: "La IA analiza", desc: "Mercado, costos, ROI y riesgos con datos MX." },
  { step: "Proforma lista", desc: "Reporte profesional listo para tu banco." },
];

const DIFF = [
  {
    title: "Datos reales de México",
    desc: "INEGI, Banxico, CENAPRED, BIMSA, SHF y portales inmobiliarios. No supuestos genéricos: cifras de tu zona y tu municipio.",
    color: "var(--color-volt)",
  },
  {
    title: "IA nativa, no añadida",
    desc: "Claude entiende el proyecto completo y narra cada análisis: qué significan los números y qué decisión tomar.",
    color: "var(--color-violet)",
  },
  {
    title: "Siempre actualizada",
    desc: "Precios, tasas e inflación se refrescan en background. Tu proforma nunca decide con datos viejos.",
    color: "var(--color-info)",
  },
];

export function Solucion() {
  return (
    <section className="border-y border-line bg-surface/40 py-20 sm:py-28">
      <Container>
        <Eyebrow>La solución</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          creaConstruye hace en horas lo que toma semanas.
        </h2>

        {/* Flujo */}
        <div className="mt-12 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {FLOW.map((f, i) => (
            <div key={f.step} className="contents">
              <div className="rounded-xl border border-line bg-raised p-5">
                <div className="tabular text-xs font-bold text-volt">
                  0{i + 1}
                </div>
                <div className="mt-2 font-bold text-ink">{f.step}</div>
                <div className="mt-1 text-sm text-muted">{f.desc}</div>
              </div>
              {i < FLOW.length - 1 && (
                <div className="hidden text-faint sm:block">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Diferenciadores */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {DIFF.map((d) => (
            <div
              key={d.title}
              className="rounded-xl border bg-raised p-6"
              style={{ borderColor: `${d.color}28` }}
            >
              <div
                className="h-1 w-8 rounded-full"
                style={{ background: d.color }}
              />
              <h3 className="mt-4 font-bold text-ink">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
