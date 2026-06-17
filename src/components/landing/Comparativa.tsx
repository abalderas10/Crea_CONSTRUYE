import { Container, Eyebrow } from "@/components/ui";

const ROWS = [
  { feature: "Tiempo de entrega", cc: "Horas", excel: "Semanas", desp: "Semanas" },
  { feature: "Costo por proyecto", cc: "Suscripción", excel: "Gratis*", desp: "$80,000+" },
  { feature: "Datos actualizados", cc: true, excel: false, desp: false },
  { feature: "IA integrada", cc: true, excel: false, desp: false },
  { feature: "Colaboración", cc: true, excel: false, desp: false },
  { feature: "Export profesional", cc: true, excel: false, desp: true },
];

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string")
    return <span className="text-sm text-muted">{v}</span>;
  return v ? (
    <span className="text-success">✓</span>
  ) : (
    <span className="text-faint">—</span>
  );
}

export function Comparativa() {
  return (
    <section className="border-y border-line bg-surface/40 py-20 sm:py-28">
      <Container>
        <Eyebrow>Comparativa</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Lo mejor de un despacho, a velocidad de software.
        </h2>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
                  &nbsp;
                </th>
                <th className="rounded-t-lg border border-volt/30 bg-volt/[0.06] px-4 py-3 text-center text-sm font-extrabold text-volt">
                  creaConstruye
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-muted">
                  Excel manual
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-muted">
                  Despacho
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.feature}>
                  <td className="border-t border-line px-4 py-3 text-sm text-ink">
                    {r.feature}
                  </td>
                  <td
                    className={`border-x border-volt/30 bg-volt/[0.04] px-4 py-3 text-center ${
                      i === ROWS.length - 1 ? "rounded-b-lg border-b" : ""
                    }`}
                  >
                    <Cell v={r.cc} />
                  </td>
                  <td className="border-t border-line px-4 py-3 text-center">
                    <Cell v={r.excel} />
                  </td>
                  <td className="border-t border-line px-4 py-3 text-center">
                    <Cell v={r.desp} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-faint">
          * Excel es gratis pero el costo real son las semanas de trabajo y los
          errores que no ves.
        </p>
      </Container>
    </section>
  );
}
