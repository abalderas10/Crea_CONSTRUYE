import { listInterest } from "@/lib/data/admin";
import { InterestRow } from "@/components/admin/InterestRow";

export default async function AdminInteresadosPage() {
  const items = await listInterest();
  const pendientes = items.filter((i) => !i.handled);
  const atendidos = items.filter((i) => i.handled);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
        Comunidad
      </p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
        Interesados en la plataforma
      </h1>
      <p className="mt-1 text-sm text-muted">
        Registros light desde «Únete». Contacto de quien quiere usar
        creaConstruye.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-raised/40 px-8 py-16 text-center text-sm text-muted">
          Aún no hay registros de interés.
        </div>
      ) : (
        <>
          {pendientes.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[12px] font-bold uppercase tracking-wide text-volt">
                Por contactar · {pendientes.length}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {pendientes.map((i) => (
                  <InterestRow key={i.id} item={i} />
                ))}
              </div>
            </section>
          )}

          {atendidos.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[12px] font-bold uppercase tracking-wide text-faint">
                Atendidos · {atendidos.length}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {atendidos.map((i) => (
                  <InterestRow key={i.id} item={i} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
