import type { Metadata } from "next";
import { BlogNav } from "@/components/blog/BlogNav";
import { Footer } from "@/components/landing/Footer";
import { InterestForm } from "@/components/landing/InterestForm";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Únete",
  description:
    "Deja tu contacto y sé de los primeros en crear, diseñar y construir con creaConstruye.",
};

export default function UnetePage() {
  return (
    <>
      <BlogNav />
      <main className="flex-1">
        <Container className="py-16">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              Comunidad creaConstruye
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Construye lo que creas, con nosotros.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              Déjanos tu contacto si te interesa la plataforma. Te avisamos de
              herramientas nuevas, eventos del sector y acceso anticipado.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <InterestForm />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
