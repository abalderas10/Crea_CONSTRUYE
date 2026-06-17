import { Container, Eyebrow } from "@/components/ui";

const USERS = [
  { icon: "🏗️", title: "Desarrolladores", desc: "Evalúa más oportunidades en menos tiempo y descarta las malas antes de comprometer capital." },
  { icon: "🔨", title: "Constructores", desc: "Presupuestos paramétricos con datos BIMSA y cronogramas con ruta crítica desde el día uno." },
  { icon: "📐", title: "Arquitectos", desc: "Verifica COS/CUS y envolvente construible antes de diseñar, no después." },
  { icon: "🪧", title: "Propietarios de terrenos", desc: "Conoce el valor real y el potencial de tu terreno antes de venderlo o desarrollarlo." },
  { icon: "🤝", title: "Brokers", desc: "Presenta oportunidades con una proforma profesional que cierra inversionistas más rápido." },
  { icon: "💼", title: "Inversionistas", desc: "Audita la viabilidad con métricas estandarizadas: TIR, VAN, VaR y GO/NO-GO con confianza." },
];

export function Usuarios() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Eyebrow>Para quién</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Para todos los que toman decisiones sobre un terreno.
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USERS.map((u) => (
            <div
              key={u.title}
              className="rounded-xl border border-line bg-raised p-6"
            >
              <div className="text-2xl">{u.icon}</div>
              <h3 className="mt-3 font-bold text-ink">{u.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {u.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
