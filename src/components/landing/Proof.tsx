import { Container } from "@/components/ui";

const STATS = [
  { value: "120+", label: "proyectos evaluados en México" },
  { value: "4 hrs", label: "vs. 3 semanas en manual" },
  { value: "8", label: "herramientas de proforma" },
  { value: "4.9/5", label: "calificación de early adopters" },
];

export function Proof() {
  return (
    <section className="border-y border-line bg-surface/40">
      <Container className="grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="px-4 py-6 text-center">
            <div className="tabular text-2xl font-black text-ink sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-faint">{s.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}
