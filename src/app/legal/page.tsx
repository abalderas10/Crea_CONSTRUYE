import Link from "next/link";
import type { Metadata } from "next";
import { LegalNav } from "@/components/legal/LegalNav";
import { Footer } from "@/components/landing/Footer";
import { LegalExplorer } from "@/components/legal/LegalExplorer";
import { Container } from "@/components/ui";
import { NORMATIVAS, normativasConCambio, fmtFecha } from "@/lib/legal/normativas";

export const metadata: Metadata = {
  title: "Legal · Normatividad",
  description:
    "Biblioteca de normatividad vigente para México: federal, estatal y municipal. Uso de suelo, construcción, ambiental y más — el espacio de consulta del sector.",
};

export default function LegalPage() {
  const alertas = normativasConCambio();

  return (
    <>
      <LegalNav />
      <main className="flex-1">
        <Container className="py-14">
          {/* Encabezado */}
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              Legal · Normatividad
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              La normatividad del sector, en un solo lugar.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Federal, estatal y municipal. Cada herramienta de creaConstruye se
              apoya en estas normas — y cuando una cambia, te avisamos con la
              sugerencia de ajuste.
            </p>
          </div>

          {/* Alertas de cambio */}
          {alertas.length > 0 && (
            <div className="mt-8 space-y-2">
              {alertas.map((n) => (
                <Link
                  key={n.id}
                  href={`/legal/${n.id}`}
                  className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 transition-colors hover:bg-amber-500/15"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-amber-500">
                        Cambio normativo · {fmtFecha(n.cambio!.fecha)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-ink">
                      {n.titulo}
                    </p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                      {n.cambio!.resumen}
                    </p>
                    <span className="mt-1 inline-block text-[12px] font-bold text-amber-500">
                      Ver más →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Explorador */}
          <div className="mt-10">
            <LegalExplorer normativas={NORMATIVAS} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
