import { Container, Eyebrow } from "@/components/ui";

const PAINS = [
  {
    icon: "📊",
    title: "Excel manual",
    desc: "Semanas armando fórmulas frágiles que se rompen al primer cambio de supuesto. Un error en una celda contamina todo el modelo.",
  },
  {
    icon: "💸",
    title: "Estudios de mercado",
    desc: "$80,000+ y varias semanas de espera por un PDF que llega tarde y queda desactualizado antes de tomar la decisión.",
  },
  {
    icon: "🕰️",
    title: "Sin actualización",
    desc: "Precios, tasas e inflación cambian cada semana. Tu proforma no. Decides con datos viejos sin saberlo.",
  },
];

export function Problema() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Eyebrow>El problema</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Evaluar un terreno hoy es lento, caro y se desactualiza solo.
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PAINS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-line bg-raised p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-2xl">{p.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
