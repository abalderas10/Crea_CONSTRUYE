import { SERVICIOS, type ServiceType } from "@/lib/constructiva/servicios";

export function Servicios() {
  return (
    <section id="servicios" className="border-t border-[var(--cc-line)] py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--cc-lime)]">
            Lo que hacemos
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--cc-text)] sm:text-4xl">
            Servicios de Constructiva
          </h2>
          <p className="mt-3 text-[15px] text-[var(--cc-muted)]">
            Desde levantar un edificio hasta automatizar tu casa. Todo con el
            respaldo de cálculos, presupuestos y supervisión con datos reales.
          </p>
        </div>

        <Bloque
          id="construccion"
          type="construccion"
          titulo="Construcción"
          subtitulo="Proyectos de obra, completos o por fases."
        />
        <Bloque
          id="mantenimiento"
          type="mantenimiento"
          titulo="Mantenimiento y remodelación"
          subtitulo="Mejora, renueva y automatiza tu espacio."
        />
      </div>
    </section>
  );
}

function Bloque({
  id,
  type,
  titulo,
  subtitulo,
}: {
  id: string;
  type: ServiceType;
  titulo: string;
  subtitulo: string;
}) {
  const items = SERVICIOS.filter((s) => s.type === type);
  return (
    <div id={id} className="mt-12 scroll-mt-20">
      <div className="flex items-baseline gap-3">
        <h3 className="text-xl font-extrabold text-[var(--cc-text)]">
          {titulo}
        </h3>
        <span className="text-[13px] text-[var(--cc-muted)]">{subtitulo}</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div
            key={s.id}
            className="group rounded-xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-5 transition-colors hover:border-[var(--cc-lime)]/50"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-[var(--cc-text)]">
                {s.name}
              </h4>
              <span className="text-[var(--cc-lime)] opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--cc-muted)]">
              {s.description}
            </p>
            <a
              href="#contacto"
              className="mt-4 inline-block text-[12px] font-bold text-[var(--cc-lime)] hover:underline"
            >
              Solicitar este servicio
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
