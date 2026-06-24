import { Container, Cta, Pill } from "@/components/ui";
import { HeroLogo } from "./HeroLogo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[120px]"
        style={{ background: "radial-gradient(circle, #C8FF00 0%, transparent 70%)" }}
      />

      <Container className="relative grid gap-12 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:pt-24 lg:pb-28">
        <div className="animate-float-up">
          <div className="mb-6 inline-flex items-center gap-2">
            <Pill color="var(--color-volt)">Plataforma para crear y construir</Pill>
            <span className="text-xs text-faint">Hecho en México 🇲🇽</span>
          </div>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Construye lo que{" "}
            <span className="text-volt">creas.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Proformas, costos, ROI y riesgos en herramientas de precisión. Un{" "}
            <span className="font-semibold text-ink">laboratorio para crear las tuyas</span>{" "}
            y una comunidad que diseña el sector inmobiliario contigo —
            de la idea a la obra.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Cta href="/registro" size="lg">
              Evalúa tu primer terreno gratis →
            </Cta>
            <Cta href="#como" variant="ghost" size="lg">
              Ver cómo funciona
            </Cta>
          </div>

          <p className="mt-4 text-xs text-faint">
            Sin tarjeta de crédito · 1 proyecto completo gratis
          </p>
        </div>

        <div className="animate-float-up [animation-delay:120ms]">
          <HeroLogo />
        </div>
      </Container>
    </section>
  );
}
