import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalNav } from "@/components/legal/LegalNav";
import { Footer } from "@/components/landing/Footer";
import { Container } from "@/components/ui";
import {
  NORMATIVAS,
  getNormativa,
  AMBITO_META,
  TEMA_META,
  fmtFecha,
} from "@/lib/legal/normativas";

export function generateStaticParams() {
  return NORMATIVAS.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const n = getNormativa(id);
  if (!n) return { title: "Norma no encontrada" };
  return { title: n.titulo, description: n.resumen };
}

export default async function NormativaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = getNormativa(id);
  if (!n) notFound();

  const am = AMBITO_META[n.ambito];

  return (
    <>
      <LegalNav />
      <main className="flex-1">
        <Container className="py-12">
          <Link href="/legal" className="text-[12px] font-semibold text-muted hover:text-ink">
            ← Legal
          </Link>

          <div className="mt-5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ background: `${am.color}1f`, color: am.color }}
              >
                {am.label}
              </span>
              <span className="rounded-sm border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                {TEMA_META[n.tema].label}
              </span>
              <span className="text-[12px] font-semibold text-muted">{n.entidad}</span>
              <span className="text-[12px] text-faint">· {n.autoridad}</span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {n.titulo}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {n.resumen}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-line bg-raised p-4 text-[13px]">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wide text-faint">Documento</dt>
                <dd className="mt-0.5 text-ink">{n.documento}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wide text-faint">Vigente desde</dt>
                <dd className="mt-0.5 text-ink">{n.vigenciaDesde}</dd>
              </div>
            </dl>
          </div>

          {/* Alerta de cambio + sugerencia */}
          {n.cambio && (
            <div className="mt-8 max-w-2xl rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
              <div className="flex items-center gap-2 text-amber-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-wide">
                  Cambio normativo · {fmtFecha(n.cambio.fecha)}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink">
                {n.cambio.resumen}
              </p>
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-base/40 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-faint">
                  Sugerencia de ajuste
                </span>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                  {n.cambio.sugerencia}
                </p>
              </div>
            </div>
          )}

          {/* Herramientas que la usan (auto-linkeo) */}
          {n.herramientas.length > 0 && (
            <div className="mt-8 max-w-2xl">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
                Herramientas que se apoyan en esta norma
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {n.herramientas.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line bg-raised px-3 py-1.5 text-[12.5px] font-semibold text-muted"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                    {h}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-faint">
                Cuando una herramienta cita esta norma, aparece aquí
                automáticamente. Si la norma cambia, esas herramientas reciben la
                alerta de ajuste.
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
