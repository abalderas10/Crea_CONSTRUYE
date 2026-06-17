import { Container, Cta, Eyebrow, Pill } from "@/components/ui";

const PLANS = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    desc: "Para evaluar tu primer terreno y conocer la plataforma.",
    cta: "Empezar gratis",
    href: "/registro",
    featured: false,
    features: [
      "1 proyecto completo",
      "Las 8 herramientas",
      "Análisis de IA básico",
      "Datos de mercado de México",
      "Export a PDF con marca de agua",
    ],
  },
  {
    name: "Pro",
    price: "$799",
    period: "/mes",
    desc: "Para desarrolladores e inversionistas que evalúan en serie.",
    cta: "Empezar prueba",
    href: "/registro?plan=pro",
    featured: true,
    features: [
      "Proyectos ilimitados",
      "Auto-actualización de datos",
      "Análisis de IA avanzado",
      "Monte Carlo y sensibilidad",
      "Export PDF, Excel y PowerPoint",
      "Memorándum de inversión",
    ],
  },
  {
    name: "Enterprise",
    price: "Cotizar",
    period: "",
    desc: "Para equipos y desarrolladoras con varios proyectos en paralelo.",
    cta: "Hablar con ventas",
    href: "/contacto",
    featured: false,
    features: [
      "Todo lo de Pro",
      "Multi-usuario y roles",
      "Colaboración en tiempo real",
      "API y white label",
      "Integraciones a medida",
      "Soporte prioritario",
    ],
  },
];

export function Pricing() {
  return (
    <section id="precios" className="scroll-mt-20 border-t border-line py-20 sm:py-28">
      <Container>
        <div className="text-center">
          <Eyebrow className="text-center">Precios</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empieza gratis. Escala cuando lo necesites.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Sin tarjeta de crédito para empezar. Cancela cuando quieras.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:items-start">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-7 ${
                p.featured
                  ? "border-volt/40 bg-volt/[0.03] lg:-mt-4 lg:pb-9"
                  : "border-line bg-raised"
              }`}
              style={p.featured ? { boxShadow: "var(--shadow-volt-glow)" } : undefined}
            >
              {p.featured && (
                <div className="absolute -top-3 left-7">
                  <Pill color="var(--color-volt)">Más popular</Pill>
                </div>
              )}
              <h3 className="font-bold text-ink">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="tabular text-4xl font-black text-ink">
                  {p.price}
                </span>
                <span className="text-sm text-faint">{p.period}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>

              <Cta
                href={p.href}
                variant={p.featured ? "primary" : "ghost"}
                className="mt-6 w-full"
              >
                {p.cta}
              </Cta>

              <ul className="mt-7 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-0.5 text-volt">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
