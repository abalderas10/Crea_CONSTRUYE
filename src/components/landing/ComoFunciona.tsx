import { Container, Eyebrow } from "@/components/ui";

const STEPS = [
  {
    n: "1",
    title: "Crea un proyecto y agrega el terreno",
    desc: "Dirección, superficie, precio y tipo de desarrollo. En 2 minutos tienes tu proyecto vivo, con auto-guardado.",
  },
  {
    n: "2",
    title: "Completa las 8 herramientas",
    desc: "A tu ritmo, en una sesión o en días. Cada herramienta alimenta a la siguiente y la IA mantiene el contexto completo.",
  },
  {
    n: "3",
    title: "Descarga tu proforma profesional",
    desc: "PDF para el banco, Excel con los modelos o PowerPoint para inversionistas. Con veredicto GO / NO-GO y nivel de confianza.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <Eyebrow>Cómo funciona</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          De terreno a proforma en tres pasos.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <div className="tabular text-5xl font-black text-line">{s.n}</div>
              <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
