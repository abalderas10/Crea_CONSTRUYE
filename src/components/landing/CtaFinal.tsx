import { Container, Cta } from "@/components/ui";

export function CtaFinal() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-volt/25 bg-volt/[0.05] px-8 py-16 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]"
            style={{ background: "radial-gradient(circle, #C8FF00 0%, transparent 70%)" }}
          />
          <h2 className="relative text-balance text-3xl font-black tracking-tight sm:text-4xl">
            Evalúa tu primer terreno gratis hoy.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-pretty text-muted">
            Una proforma profesional completa, sin tarjeta de crédito. Descubre
            si tu proyecto es GO o NO-GO antes de invertir un peso.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Cta href="/registro" size="lg">
              Empezar gratis →
            </Cta>
          </div>
          <p className="relative mt-4 text-xs text-faint">
            1 proyecto completo gratis · Sin tarjeta de crédito
          </p>
        </div>
      </Container>
    </section>
  );
}
