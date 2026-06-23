export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow lima de fondo */}
      <div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--cc-lime)" }}
      />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--cc-line)] bg-[var(--cc-surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--cc-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--cc-lime)]" />
          Construcción &amp; mantenimiento
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--cc-text)] sm:text-6xl">
          Construimos lo que se{" "}
          <span className="text-[var(--cc-lime)]">calcula</span>.
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--cc-muted)] sm:text-lg">
          Obra nueva, remodelaciones, fachadas, domótica y automatización.
          Respaldados por proformas, presupuestos y supervisión con datos
          reales — de principio a fin.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contacto"
            className="rounded-md bg-[var(--cc-lime)] px-6 py-3 text-[14px] font-extrabold text-[var(--cc-base)] transition-colors hover:bg-[var(--cc-lime-sub)]"
          >
            Solicitar una cotización →
          </a>
          <a
            href="#servicios"
            className="rounded-md border border-[var(--cc-line)] px-6 py-3 text-[14px] font-semibold text-[var(--cc-text)] transition-colors hover:bg-[var(--cc-surface)]"
          >
            Ver servicios
          </a>
        </div>

        {/* Mini-stats */}
        <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">
          {[
            { n: "360°", l: "Diseño a obra" },
            { n: "Datos", l: "Proforma real" },
            { n: "Domótica", l: "& automatización" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-extrabold text-[var(--cc-lime)]">
                {s.n}
              </div>
              <div className="mt-0.5 text-[12px] text-[var(--cc-muted)]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
